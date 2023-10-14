/**
 * Thread manager for spawned node processes.
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 * 
 * @module @jumpcutking/threads/src/threads
 * @auther @jumpcutking
 */

/**
 * Process's are spawned using spawn.
 */
var { spawn } = require('child_process');

/**
 * Using util to deep dive into objects.
 */
var util = require('util');
var fs = require('fs');
var path = require('path');

/**
 * To facilitate logging stacktraces.
 */
var jckConsole = require("@jumpcutking/console");

// /**
//  * To prevent recursion, use this to not report console messages through jckConsole.
//  * THIS should be development only.
//  */
// var Console = require("node:console").Console;
// var noneRecursiveConsole = new Console(process.stdout, process.stderr);
// noneRecursiveConsole.info("***** Using noneRecursiveConsole to prevent recursion.");

/**
 * Using colors to colorize console output.
 * @see {@link https://www.npmjs.com/package/colors} For more information.
 */
var colorOf = require("colors");

/**
 * Connects to deffered promises.
 */
var defferedPrimise = require("./defferedPromise.js");

/**
 * Options for the thread manager.
 * @property {string} id The id for the thread manager.
 * @property {boolean} verbose Whether to output verbose logs.
 * @property {string} closeID The id to close the thread.
 * @property {boolean} logging Whether to output any logs from console.log from the child thread. Logging must be enabled at the child thread.
 */
var options = {
    id: "threads",
    verbose: false,
    logging: true,
    reportStderr: false,
    closeID: "thread.close"
}
// module.exports.options = options;

/**
 * A special wrapper for simple accounting of threads and actions.
 */
var spzArr = require("./spzArray.js");
const { threadId } = require('worker_threads');

/**
 * Internal object for the thread manager.
 * @property {spzArr} threads The registered threads by ID.
 * @property {spzArr} actions The registered actions that will be performed on the mian thread by ID.
 * @property {Object} listener The listener objects.
 * @property {Array} listener.requests The listener functions for requests.
 * @property {Array} listener.received The listener functions for received messages.
 * @property {Array} listener.noPromiseFound The listener functions for no promise found.
 * @property {Array} listener.uncaught The listener functions for uncaught exceptions.
 */
var my = {
    threads: false,
    actions: false,
    listener: {
        requests: [],
        received: [],
        noPromiseFound: [],
        uncaught: []
    }
}

/**
 * The registered threads by ID.
 */
module.exports.threads = my.threads;

/**
 * The registered actions that will be performed on the mian thread by ID.
 */
module.exports.actions = my.actions;

/**
 * Create and initialize a thread manager.
 * Warning: This thread manager is designed for one manager per application. 
 *          Threads attach to the same manager. Only call this once!
 * @param {string} id The id of the thread manager.
 * @param {*} _options The options to set up the thread manager with. 
 * @property {boolean} _options.verbose Whether to output verbose logs.
 * @property {string} _options.closeID The id to close the thread.
 * @property {boolean} _options.logging Whether to output any logs from console.log from the child thread. Logging must be enabled at the child thread.
 * @property {boolean} _options.reportStderr Will errors from the process error channel be reported directly? Disable this to prevent duplicate error messages (exceptions, and console.warn|error will parrot to the thread manager on stderr resulting in duplicate messages).
 * @throws {Error} If the thread manager has already been initialized. 
 */
function init(id = "threads", _options = {}) {
    SimpleLog(`Setting up thread manager: ${id}`, {
        id: id
    })

    options.id = id;
    options.ns = id;

    //Passthrough the options
    if ("verbose" in _options) {
        options.verbose = _options.verbose;
    }

    if ("logging" in _options) {
        options.logging = _options.logging;
    }

    if ("reportStderr" in _options) {
        options.reportStderr = _options.reportStderr;
    }

    if (!options.reportStderr) {
        SimpleLog("options.reportStderr is false. Errors from the process error channel will not be reported directly.");
    }

    my.threads = new spzArr(`${options.id}.threads`);
    my.actions = new spzArr(`${options.id}.actions`);
    
    //support the child logs (without dual passing them.
    addAction("log", receivedLog);

    //if the Thread Manager's process is closing, close all threads
    process.on('exit', function () {

        // are there any threads left?
        if (my.threads.registry.length == 0) {
            // SimpleLog("No threads to close.");
            return;
        }

        SimpleLog("Process is exiting. Closing all threads.");

        Send(options.closeID, {
            exitType: "process.exit" 
        });

    });

    addAction("thread.ready", async (data) => {
        SimpleLog("Thread is ready.", data);

        // console.log("Thread is ready.", data);

        //using data.$.threadId, get the thread object
        var thread = my.threads.search(data.$.threadId).items[0];
        
        if (!thread) {
            throw new Error(`Thread: ${data.$.threadId} requested it was ready but is no longer attached to the manager.`);
        }

        // console.log("Thread is ready.", thread);

        if ("onStartup" in thread.options) {
            try {

                thread.options.onStartup(data);

            } catch (error) {

                receivedLog({
                    thread: thread.id,
                    action: `onStartup.error`,
                    message: `Error in onStartup handler for thread: ${thread.id}`,
                    objects: {
                        error: error
                    }
                });

            }

        }


    });


} module.exports.init = init;

/**
 * Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.
 * @param {*} listener The event/callback to fire.
 * @deprecated Use .on("requests", listener) instead.
 */
function addRequestsListener(listener) {
    on("requests", listener);
    // my.listener.requests.push(listener);
    // SimpleLog("Added requesting message listener.", listener);
} module.exports.addRequestsListener = addRequestsListener;

/**
 * Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.
 * @param {*} listener The event/callback to fire.
 * @deprecated Use .on("received", listener) instead.
 */
function addReceivedListener(listener) {
    on("received", listener);
    // my.listener.received.push(listener);
    // SimpleLog("Added received message listener.", listener);
} module.exports.addReceivedListener = addReceivedListener;

/**
 * Adds an event listener to the thread manager.
 * @param {string} type The type of listener to add.
 * - requests: The listener will be called when a request is sent to the thread manager.
 * - received: The listener will be called when a message is received from the thread manager.
 * - noPromiseFound: The listener will be called when a promise is not found.
 * - uncaught: The listener will be called when an uncaught exception is thrown.
 * @param {*} listener The event/callback to fire.
 */
function on(type, listener) {
    //if the name is in the listener object, add the new 
    if (type in my.listener) {
        my.listener[type].push(listener);
        SimpleLog(`Added ${type} message listener.`, listener);
    } else {
        throw new Error(`The listener type: ${type} is not supported.`);
    }
} module.exports.on = on;

/**
 * Adds a thead to the manager.
 * Messages sent from the child thread that are not formatted correctly can be read by attaching an onData handler.
 * The thread manager will create the following default actions
 *  - thread.startup The thread has started up and is ready to receive messages.
 *  - thread.close The thread is closing.
 *  - promise.resolve The promise has been resolved.
 *  - promise.reject The promise has been rejected.
 * Options:     All options are optional.
 * @param {string} id the id of the thread. Must be unique.
 * @param {*} local the script to spawn
 * @param {*} options the options for the thread.
 * @property {function} options.onData The function to call when data is received from the thread.
 * @property {function} options.onError The function to call when an error is received from the thread.
 * @property {function} options.onExit The function to call when the thread exits.
 * @property {function} options.onSend The function to call when a message is sent to the thread.
 * @property {function} options.onStartup The function to call when the thread starts up.
 * @property {boolean} options.disableActions Whether to disable actions for the thread.
 * @property {Object} options.spawn The options for spawning the thread.
 * @property {string} options.spawn.command The command to spawn the thread with. Default: node, but can be any command.
 * @property {string|array} options.spawn.args The arguments to pass to the command. The local script is always the first argument.
 * @throws {Error} If the thread manager has not been initialized.
 * @throws {Error} If the thread id is not unique.
 * @throws {Error} If the thread could not be added.
 * @returns {boolean} True if the thread was added or false if the thread had an issue.
 */
function add(id, local, options = {}) {

    //This check is to help keep the order of events.
    if (my.threads == false) {
        throw new Error("Thread manager not initialized. Call init() first.");
    }

    //check to see if the thread id is unique
    SimpleLog("Adding thread.", {
        id: id,
        local: local,
        options: options
    });

    //defualt spawn options
    var spawnOptions = {
        command: "node"
    }

    //Passthrough the options for spawning a new process.
    if ("spawn" in options) {
        if ("command" in options.spawn) {
            spawnOptions.command = options.spawn.command;
        }
    }

    var commandArgs = [local];

    //If I have additional command args, add them to the commandArgs array.
    if ("spawn" in options) {
        if ("args" in options.spawn) {

            //if args is a string and not an array
            if (typeof options.spawn.args == "string") {
                //split the string by spaces
                options.spawn.args = options.spawn.args.split(" ");
            }
            
            commandArgs = [...options.spawn.args];
            commandArgs.unshift(local);

        }
    }

    try {
        
        /**
         * The default thread object.
         * @property {string} id The id of the thread.
         * @property {*} local The script to spawn.
         * @property {*} options The options for the thread.
         * @property {*} process The process object.
         * @property {*} send The send function.
         * @property {string} buffer The buffer for the thread.
         */
        var thread = {
            id: id,
            local: local,
            options: options,
            process: false,
            send: false,
            buffer: ''
        };

        //Threads are by one id only.
        // if (my.threads.add(thread)) {

        SimpleLog("Spwaning process.", {
            id: id,
            commandArgs: commandArgs
        });

        //check if the file exists - if it's a node thread
        if (spawnOptions.command == "node") {

            //check if the first argument is a relative path
            if (commandArgs[0].substr(0, 1) == ".") {
                //check if the first argument actually exists
                var fileToTest = path.join(process.cwd(), commandArgs[0]);
                if (!(fs.existsSync(fileToTest))) {
                    throw new Error(`Threads: Unable to spawn a node thread. The file: ${fileToTest} does not exist.`);
                }
            }

        }

        thread.process = spawn(spawnOptions.command, commandArgs);

        // set the encoding of the stdout stream to 'utf8'
        thread.process.stdout.setEncoding('utf8'); //may need to change to UTF-32

        /**
         * Handles an exit from the thread.
         * @param {*} code The exit code.
         */
        thread.process.on('exit', (code) => {

            receivedLog({
                thread: thread.id,
                action: `process.exit`,
                message: `The thread: ${thread.id} exited with code: ${code}.`,
            })

            try {
                if ("onExit" in thread.options) {
                    thread.options.onExit(code);
                }
            } catch (error) {
                receivedLog({
                    thread: thread.id,
                    action: `process.exit.error`,
                    message: `Error in onExit handler for thread: ${thread.id}`,
                    objects: {
                        error: error
                    }
                });
                
            }

            //support received an exit message to all listeners recieving messages.
            SendMessageToRequestListeners({
                thread: thread.id,
                action: `process.exit`,
                message: `The thread: ${thread.id} exited with code: ${code}.`,
                $: {
                    id: thread.id + ".process.exit"
                }
            });


            //remove the listener - listerners are not needed anymore as send is on the thread object itself.
            SimpleLog("Removing thread.", {
                id: id
            });
            my.threads.remove(id);

        });


        /**
         * Handles messages received from the thread.
         * @param {*} data The data received from the thread.
         */
        thread.process.stdout.on('data', (data) => {
            SimpleLog("Data received.", {
                id: id,
                data: data,
                buffer: thread.buffer
            });

            thread.buffer += data;
            var messages = thread.buffer.split('\x04');
            thread.buffer = messages.pop();
        
            for (const data of messages) {
                //handle all messages
                handleMessage(thread, data);
            }

            });
        
        /**
         * Handles errors from the thread.
         * @param {*} data The data received from the thread.
         */
        thread.process.stderr.on('data', (data) => {
            //TO DO: Check if I need to buffer error data as well?
            data = `${data}`;

            if (options.reportStderr) {

                receivedLog({
                    thread: thread.id,
                    action: `process.stderr`,
                    message: `Error in thread: ${id}`,
                    objects: {
                        message: data
                    }
                });

            }

            try {
                if ("onError" in thread.options) {
                    thread.options.onError(data);
                }
            } catch (error) {
                receivedLog({
                    thread: thread.id,
                    action: `onError.error`,
                    message: `Error in onError handler for thread: ${id}`,
                    objects: {
                        error: error
                    }
                });
            }
        });

        /**
         * Add's a thread specific send event.
         * @param {*} data The data to send to the thread.
         */
        thread.send = async (data) => {

            SimpleLog(`Sending message to thread: ${thread.id}`, {
                id: id,
                data: data
            });

            if ("onSend" in thread.options) {
                thread.options.onSend(data);
            };

            //wrap message in "\x04" and json stringify it
            data =`\x04${JSON.stringify(data)}\x04`;

            if (thread.process) {
                try {
                    thread.process.stdin.write(data);
                } catch (error) {
                    receivedLog({
                        thread: thread.id,
                        action: `onSend.error`,
                        message: `Error sending message to thread: ${thread.id}`,
                        objects: {
                            error: error,
                            data: data
                        },
                    });
                }
            } else {
                receivedLog({
                    thread: thread.id,
                    action: `thread.startup.notConnected`,
                    message: `Thread: ${thread.id} not running. Message failed.`,
                    objects: {
                        message: message,
                        data: data
                    }
                });
            }
        };

        /** Tell the thread it's ID and the thread manager's ID. */
        thread.send({
            $: {
                id: "thread.startup"
            },
            threadId: thread.id,
            local: local,
            managerId: my.id
        })


        //moved to the end of the function so the thread's functions are properly set up.

        try {

            //add the thread to the thread manager
            my.threads.add(thread, )
            
        } catch (error) {

            receivedLog({
                thread: thread.id,
                action: `process.creation.failed`,
                message: `Thread: ${thread.id} not running. Message failed.`,
                objects: {
                    error: error
                }
            });

            return false;
        }

        return true;

    } catch (error) {

        receivedLog({
            thread: thread.id,
            action: `process.creation.error`,
            message: `Could not add thread: ${thread.id}.`,
            objects: {
                id: id,
                local: local,
                options: {...options},
                error: generateSafeError(error)
            }
        });

        return false;
        
    }


} module.exports.addThread = add;
module.exports.add = add;

/**
 * Adds an action to the thread manager.
 * @param {string} id The id of the action.
 * @param {*} handler The function to call when the action is requested.
 * @returns {Boolean} True if the action was added, false if it was not.
 */
function addAction(id, handler) {
    SimpleLog("Adding action.", {
        id: id,
        handler: handler
    });

    return my.actions.add({
        id: id,
        handler: handler
    }, true);
} module.exports.addAction = addAction;

/**
 * Removes an action from the thread manager.
 * @param {*} id The id of the action to remove.
 * @param {*} index The index of the action to remove.
 */
function removeActionAt(id, index) {
    SimpleLog("Removing action.", {
        id: id,
        index: index
    });

    my.actions.removeAt(id, index);
} module.exports.removeActionAt = removeActionAt;

/**
 * List all the threads and listerners.
 * @returns {Object} {threads: [], listerners: []}
 */
function list() {
    return {
        threads: my.threads.list(),
        actions: my.actions.list(),
    }
} module.exports.list = list;


/**
 * Generates a safe and passable error message
 * @param {*} err The error to generate a safe error message for.
 */
function generateSafeError(err) {

    //if err is undefined, return undefined
    if (typeof err == "undefined") {
        console.error("Threads is unable to generate a safe error. Error is undefined.");
    }

    if (typeof err == "string") {
        return err;
    }

    var safeError = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    safeError.stack = jckConsole.parseStackTrace(safeError.stack, 0);
    return safeError;

} module.exports.generateSafeError = generateSafeError;

var myDefferedPromises = []

/**
 * Async Awaits for a promise.resolve or promise.reject from a thread.
 * This function MUST be called using the new async/await syntax.
 * A chain will fail without .catch() if the promise is rejected.
 * @param {*} actionID The id of the action to be called.
 * @param {*} message The message to be sent. The message global $. Will have a .primise object added
 * @param {*} threadID  The id of the thread to send the message to. If id is blank, the message will be sent to all threads.
 * @param {*} timeout The number of seconds to wait for a response before timing out.
 * @property {pbject} message.$ FUNCITON PROVIDED. The global message object.
 * @property {string} message.$.id FUNCITON PROVIDED. The id of the action to be called.
 * @property {string} message.$.promise.id FUNCITON PROVIDED. The id of the promise.
 * @property {object} message.$.promise.resolve FUNCITON PROVIDED. The thread will generate a resolve function that can be called manually. Also note, promises auto resolve.
 * @property {object} message.$.promise.reject FUNCITON PROVIDED. The thread will generate a reject function that can be called manually. Also note, promises auto reject on exception or issue.
 * @property {object} Promise.Reject.return Typically the promise, when rejected, will return an Error json object, but it can be any data.
 * @property {object} Promise.Reject.return.stack If an error was thrown, the stack will be provided.
 * @property {object} Promise.Reject.return.message If an error was thrown, the message will be provided.
 * @property {object} Promise.Reject.return.$ The global object, a copy of the object the function will provide including a promise object.
 * @property {object} Promise.Resolve.return Typically the promise, when resolved, will return the data requested.
 * @property {object} Promise.Resolve.return.$ The global object, a copy of the object the function will provide including a promise object.
 * @see {@link module:@jumpcutking/threads/thread/handleMessage} For more information on the returned obejects.
 * @returns {Promise} The promise object.
 * @returns {object} The data returned from the thread.
 * @property {object} $.id The id of the action. promise.resolve or promise.reject
 * @property {object} $.promise The promise object.
 * @property {object} $.promise.id The id of the promise.
 * @throws {Error} If the promise has been rejected (an error is reported by the thread or the manager) such as a timeout or unregistered function.
 */
async function AsyncRequest(actionID, message = {}, threadID = "", timeout = 30) {
  
    //Create the differed promise
    var deffered = defferedPrimise.create();
    deffered.actionId = actionID;
    deffered.threadId = threadID;

    if (threadID == "") {
        deffered.promiseId = `${actionID}.*.${Date.now()}`;
    } else {
        deffered.promiseId = `${actionID}.${threadID}.${Date.now()}`;
    }

    // deffered.timeout = setTimeout;

    //check if the global message object exists
    if (!("$" in message)) {
        message.$ = {};
    }

    //ensure the message has a promise object with it's id;
    message.$.promise = {
        id: deffered.promiseId
    };

    //setup Timeout
    deffered.timeoutInterval = setTimeout(() => {
        var index = myDefferedPromises.indexOf(deffered);
        if (index > -1) {
            myDefferedPromises.splice(index, 1);
        }

        // SimpleLog("Promise timed out.", {
        //     promiseId: deffered.promiseId,
        //     actionId: deffered.actionId,
        //     threadId: deffered.threadId
        // });

        var newError = new Error(`Promise timed out after the allowed ${timeout} seconds.`);
        newError = JSON.parse(JSON.stringify(newError, Object.getOwnPropertyNames(newError)));

        newError.stack = jckConsole.parseStackTrace(newError.stack, 1);

        newError.$ = {
            id: "promise.reject",
            promise: {
                id: deffered.promiseId
            },
            actionId: deffered.actionId
        }

        if (deffered.threadId == "") {
            newError.$.threadId = "*";
        } else {
            newError.$.threadId = deffered.threadId;
        }

        deffered.reject(newError);

    }, timeout * 1000);

    myDefferedPromises.push(deffered);

    try {

        //add a error handler to the promise
      
        Send(actionID, message, threadID, true);
        var repo = await deffered.promise;

        if (repo.$.id == "promise.reject") {
            var err = new Error("A promise was rejected.");
            err = {...err, ...repo};
            throw err;
        }

        return repo;

    } catch (error) {

        //check to see if the stack trace is an object or a string
        if (typeof error.stack == "string") {
            try {
                error.stack = jckConsole.parseStackTrace(error.stack, 1);
            } catch (error) {
                console.warn(`Error parsing stack trace for an async/await.`, error);
            }
        }

        //Tricks JS into thinking the error was caught
        // sends it back to the script

        // console.warn("Error in AsyncRequest.", error);
        throw error;

    }

} module.exports.AsyncRequest = AsyncRequest;
module.exports.async = AsyncRequest;

/**
 * Send message to a thread.
 * If threadID is not provided, the message will be sent to all threads.
 * @param {*} actionID The id of the action to be called.
 * @param {*} message The message to be sent. The message will have the global action ID added to it.
 * @property {string} message.$.id The id of the action to be called.
 * @property {string} message.$.promise.id The id of the promise. (When a promise exists);
 * @param {*} threadID The id of the thread to send the message to. If id is blank, the message will be sent to all threads.
 * @param {*} shallThrow Whether to throw an error if the thread is not found. (used in AsyncRequest(s))
 */
function Send(actionID, message = {}, threadID = "", shallThrow = false) {

    // if message is null or undefined, set it to an empty object.
    if (!message) {
        message = {};
    }

    //ensure all properties of the message are now detatched using Object.GetOwnPropertyNames
    // message = JSON.parse(JSON.stringify(message, Object.getOwnPropertyNames(message)));
    
    SimpleLog("Sending message.", {
        actionID: actionID,
        message: message,
        threadID: threadID
    });

    //overide any globals or add them as needed
    if ("$" in message) {
        message.$.id = actionID;
    } else {
        message.$ = {
            id: actionID
        };
    }

    SendMessageToRequestListeners(message);

    var sent = false;
    try {
        //if thread is blank or "*"
        if (threadID == "*" || threadID == "") {
            threadID = "*";
            //send to all threads
            
            var hasThreads = false
            if (my.threads.registry == undefined) {

            } else if (my.threads.registry.length == 0) {
            } else {
                hasThreads = true;
            }
            
            if (hasThreads) {

                // console.log("Test threadss",  {
                //     threads: my.threads.registry,
                //     items: my.threads.registry[0].items
                // });
                
                my.threads.registry.forEach((thread) => {
                    thread.items[0].send(message);
                });

            } else {

                if (shallThrow) {
                    var err = new Error("No threads found.");
                    err.id = "onSend.noThreadsRegistered";
                    err.action = actionID;
                    err.thread = threadID;
                    throw new Error("No threads found.");
                };

                receivedLog({
                    thread: threadID,
                    action: `onSend.noThreadsRegistered`,
                    message: `Error sending message. No threads found.`,
                    objects: {
                        // error: error,
                        action: actionID,
                        message: message,
                        thread: threadID
                    }
                });

            }
        } else {

            try {
                
                //send to a specific thread
                my.threads.search(threadID)?.items[0].send(message);
                sent = true;

            } catch (error) {
                
                if (error.message == "my.threads.search(...)?.send is not a function") {

                    if (shallThrow) {
                        var err = new Error("No thread found.");
                        err.id = "onSend.noThread";
                        err.action = actionID;
                        err.thread = threadID;
                        throw new Error("No thread found.");
                    }

                    receivedLog({
                        thread: threadID,
                        action: `onSend.noThread`,
                        message: `Error sending message. No thread found with id: ${threadID}.`,
                        objects: {
                            // error: error,
                            action: actionID,
                            message: message,
                            thread: threadID
                        }
                    });

                } else {

                    if (shallThrow) {
                        throw error;
                    }

                    receivedLog({
                        thread: threadID,
                        action: `onSend.error`,
                        message: `Error sending message.`,
                        objects: {
                            error: error,
                            action: actionID,
                            message: message,
                            thread: threadID
                        }
                    });
                }

            }
            
        }
    } catch (error) {

        if (shallThrow) {
            throw error;
        }

        receivedLog({
            thread: threadID,
            action: `onSend.error`,
            message: `Error sending message.`,
            objects: {
                error: error,
                action: actionID,
                message: message,
                thread: threadID
            }
        });
     }
} module.exports.send = Send;
module.exports.request = Send; //for consistency sake

/**
 * Sends the request message that is about to be sent to all threads to any request listeners.
 * They should be async or functions. 
 * All errors will be caught and logged.
 * @param {*} message The standard message object. $.id is the action id.
 * @deprecated Use .fire("requests", message) instead.
 * @throws {Error} If the listener type is not supported.
 */
function SendMessageToRequestListeners(message) {
       //Send the message to any attached listener, if any, before sending to the thread.
    //    try {
        
    //     if (my.listener.requests.length > 0) {
    //         my.listener.requests.forEach(listener => {
    //             try {
    //                 listener(message)
    //             } catch (error) {
    //                 SimpleLog("Error in calling listener (request send).", {
    //                     error: error,
    //                     listerner: listener,
    //                     message: message
    //                 })
    //             }
    //         });
    //     }
    // } catch (error) {
    //     SimpleLog("Error in handling listener (request send).", {
    //         error: error,
    //         message: message
    //     });
    // }
    fire("requests", message);
}

/**
 * Sends a mesage to all listener functions aded to my.listener.received - they should be async or functions.
 * All errors will be caught and logged.
 * @param {*} message The standard message object. $.id is the action id. if $.id = thread.id + "process.exit" - a process has exited.
 * @deprecated Use .fire("received", message) instead.
 * @throws {Error} If the listener type is not supported.
 */
function SendMessageToReceivedListeners(message) {
    //fire all received listerners
    fire("received", message);
}

/**
 * Fires an event to the attached listeners.
 * @param {*} type The type of listener to fire.
 * - requests: The listener will be called when a request is sent to the thread manager.
 * - received: The listener will be called when a message is received from the thread manager.
 * - noPromiseFound: The listener will be called when a promise is not found.
 * - uncaught: The listener will be called when an uncaught exception is thrown.
 * @param {*} message The message object to send to the listener.
 * @throws {Error} If the listener type is not supported.
 */
function fire(type, message) {
    // if type is in the listener object, fire the listeners for the type
    if (type in my.listener) {
        my.listener[type].forEach(listener => {
            listener(message);
        });
    } else {
        throw new Error(`The listener type: ${type} is not supported.`);
    }
} module.exports.fire = fire;

/**
 * Handles messages received from the child thread.
 * All thread level errors are reported using ReceivedLog(). 
 * In the future, they should probably be thrown to enable better error handling.
 * However, they would be unhandled and uncaught errors and may crash the main process.
 * @param {*} thread The thread object that the message was received from.
 * @param {*} message The data received from the thread.
 * @property {string} message.$.id The id of the action to be called.
 * Here are a list of id's that have been reserved:
 *  - thread.startup The thread has started up and is ready to receive messages.
 *  - thread.close The thread is closing.
 *  - promise.resolve The promise has been resolved.
 *  - promise.reject The promise has been rejected.
 * @property {string} message.$.promise.id The id of the promise. (When a promise exists it will resolce to a promise.resolve or promise.reject)
 */
function handleMessage(thread, message) {
    SimpleLog("Handling message.", {
        thread: detialsOfThread(thread),
        message: message
    });

    //if the message is a blank string, unidefined, or null, return and don't handle message
    if (!message) {
        SimpleLog("Mesage false or null.", {
            thread: detialsOfThread(thread),
            message: message
        });
        return;
    }

    try {
        if (message.trim().length == 0) {
            SimpleLog("Message blank.", {
                thread: detialsOfThread(thread)
            });
            //I'm a blank message
            return;
        }

    } catch (error) {
        SimpleLog("Error reading the message varable.", {
            thread: detialsOfThread(thread),
            message: message,
            error: error
        });
        //no reason to handle this error
    }

    //fire the onData event
    try {
        if ("onData" in thread.options) {
            thread.options.onData(message);
        }
    } catch (error) {
        SimpleLog("Error finding onData in threadOptions", {
            thread: detialsOfThread(thread),
            message: message,
            error: error
        });
    }

    //check to see if the thread has disabled actions
    if ("disableActions" in thread.options && thread.options.disableActions) {
        SimpleLog(`Actions disabled for thread ${thread.id}`, {
            thread: detialsOfThread(thread),
            message: message
        });
        return;
    }

    try {
        //if not a json string, it must be something else - share data to console
        // if (message[0] != "{") {
        //     // console.log("***** Not JSON");
        //     // console.dir(message); <-- see the actual real data in the console (not trimmed by console.log)
        //     SimpleLog("Message not JSON.", {
        //         thread: detialsOfThread(thread),
        //         message: message
        //     });
        //     return;
        // }

        //convert the message to a json object
        try {
            message = JSON.parse(message);
        } catch (error) {
            SimpleLog("Message not JSON.", {
                thread: detialsOfThread(thread),
                message: message,
                error: error
            });
            return;
        }

        //is message an object
        if (typeof message !== "object") {
            SimpleLog("Message not an object.", {
                thread: detialsOfThread(thread),
                message: message
            });
            return;
        }

        //does message have an id
        if (!("$" in message)) {
            SimpleLog("Message does not have a global prefix ($).", {
                thread: detialsOfThread(thread),
                message: message
            });
            return;
        }

        //does message have an id
        if (!("id" in message.$)) {
            SimpleLog("Message does not have an id ($.id).", {
                thread: detialsOfThread(thread),
                message: message
            });
            return;
        }

        //send to listeners - only json objects please 
        //Perhabs should check for a $.id property to validate
        //the object is a message object - ignore else???
        SendMessageToReceivedListeners(message);


        //Let's check if the message is a promise response
        if (message.$.id == "promise.resolve" || message.$.id == "promise.reject") {
            //I'm a promise, I don't get an action resolved, I resolve to a differed promise.

            //does the message.$ have a promise object and does it have an id?
            if (!("promise" in message.$)) {
                // SimpleLog("Message does not have a promise object in the message global ($.promise).", {
                //     thread: detialsOfThread(thread),
                //     message: message
                // });
                receivedLog({
                    thread: thread.id,
                    action: `onData.promise.error.noPromiseObject`,
                    message: `The message does not have a promise object in the message global ($.promise).`,
                    objects: {
                        thread: detialsOfThread(thread),
                        message: message
                    }
                });
                return;
            }
            
            if (!("id" in message.$.promise)) {
                // SimpleLog("The promise object in the message global does not have a promise id ($.promise.id).", {
                //     thread: detialsOfThread(thread),
                //     message: message
                // });
                receivedLog({
                    thread: thread.id,
                    action: `onData.promise.error.noPromiseId`,
                    message: `The promise object in the message global does not have a promise id ($.promise.id).`,
                    objects: {
                        thread: detialsOfThread(thread),
                        message: message
                    }
                });
                return;
            }

            //find the promise
            var foundPromise, foundPromiseIndex = false;
            for (var i = 0; i < myDefferedPromises.length; i++) {
                if (myDefferedPromises[i].promiseId == message.$.promise.id) {
                    foundPromise = myDefferedPromises[i];
                    foundPromiseIndex = i;
                    break;
                }
            }

            if (!foundPromise) {

                fire("noPromiseFound", message);

                receivedLog({
                    thread: thread.id,
                    action: `onData.promise.error.noPromiseFound`,
                    message: `The promise is no longer registered, it may have timed out.`,
                    objects: {
                        thread: detialsOfThread(thread),
                        message: message
                    }
                });
                return;
            }

            //remove the promise from the list
            myDefferedPromises.splice(foundPromiseIndex, 1);

            //clear the timeout
            clearInterval(foundPromise.timeoutInterval);

            //resolve or reject the promise
            if (message.$.id == "promise.resolve") {
                foundPromise.resolve(message);
            } else {
                foundPromise.reject(message);
            }

            //an action can not be added for this message type.
            return;

        } else {

            //is an action registered
            var action = my.actions.search(message.$.id);
            if (action) {
                SimpleLog("Running found action.", {
                    thread: detialsOfThread(thread),
                    message: message
                });

                try {
                    // for each eventz.items item - call the handler
                    for (var i = 0; i < action.items.length; i++) {
                        action.items[i].handler(message);
                    }
                    // action(message);
                } catch (error) {
                    receivedLog({
                        thread: thread.id,
                        action: `onData.actionError`,
                        owner: options.id,
                        message: `Error running action: ${message.$.id} registered to the manager: ${options.id}.`,
                        objects: {
                            error: error,
                            data: message,
                            thread: detialsOfThread(thread)
                        }
                    });
                }

            } else {
                receivedLog({
                    thread: thread.id,
                    action: `onData.actionNotRegistered`,
                    owner: options.id,
                    message: `Requested action: ${message.$.id} is not registered to the manager: ${options.id}.`,
                    objects: {
                        data: message,
                        thread: detialsOfThread(thread)
                    }
                })
            }
            
        }

        
    } catch (error) {
        receivedLog({
            thread: thread.id,
            action: `onData.error`,
            message: `Thread: ${thread.id} Could not parse JSON.`,
            objects: {
                error: error,
                data: message
            }
        })
    }
}

/**
 * Get's the details of a thread. (safe)
 * @param {*} thread The thread itself.
 * @returns {Object} A clone of the thread obect without the process.
 */
function detialsOfThread(thread) {
    //clone the obect and remove process
    // console.log("Details of thread...", thread);
    var details = {
        id: thread.id,
        local: thread.local,
        options: thread.options
    };

    // var details = JSON.parse(JSON.stringify(thread));
    // delete details.process;
    // delete details.buffer;
    return details;
}

/**
 * Reports messages from child threads using console.log to the console.
 * {logging:true} must be enabled for both the child and parent thread.
 * @see {@link https://github.com/jumpcutking/console} for more information.
 * @param {*} message 
 */
function receivedLog(message) {

    // noneRecursiveConsole.log("receivedLog", message);

    if (typeof message !== "object") {
        console.error("receivedLog: Message is not an object.", message);
        return;
    }

    // if ("objects" in message) {
    //     if ("error" in message.objects) {
    //         console.error(`receivedLog: Message has an error object.`, message.objects.error);
    //         return;
    //     }
    // }

    //does the message have a global
    if (!("$" in message)) {
        // var err = new Error("receivedLog: Message does not have a global prefix ($). This may be caused by an uncaught promise exception.");
        // console.error(err);
        // console.error(message);
        // return;

        // if ("threadId" in message) {
        //     message.$ = {
        //         threadId: message.threadId
        //     }
        // } else

        if ("thread" in message) {
            message.$ = {
                threadId: message.thread
            }
        }

        // console.info(message);

    } 

    //check if a message has a thread id
    if (!("threadId" in message.$)) {
        var err = new Error("receivedLog: Message does not have an thread id.");
        console.error(err);
        return;
    }

    // console.log(message);
    if (message.action == "process.uncaught") {

        // noneRecursiveConsole.warn("Proc: Uncaught Exception", message);

        fire("uncaught", message);

        var nObject = {...message.objects};
        delete nObject.error;
        delete nObject.stack;
        delete nObject.message;

        if (Object.keys(nObject).length == 0) {

            //is message.objects.stack a object
            if (typeof message.objects.stack == "object") {

                sharePrettyLog({
                    $: message.$,
                    // thread: message["$"].threadId,
                    action: "Console",
                    message: "error",
                    objects: [`${message.message} Thread: ${message.$.threadId}.`, message.objects]
                });
                return;

            } else {

                sharePrettyLog({
                    $: message.$,
                    // thread: message["$"].threadId,
                    action: "Console",
                    message: "error",
                    objects: [`${message.message} Thread: ${message.$.threadId}.
        ${message.objects.stack}`]
                });
                return;

            }

        } else {

            // if (nObject.error == message.objects.stack) {
            //     delete nObject.error;
            // }
           
            if (typeof message.objects.stack == "object") {

                sharePrettyLog({
                    $: message.$,
                    // thread: message["$"].threadId,
                    action: "Console",
                    message: "error",
                    objects: [`${message.message} Thread: ${message.$.threadId}.`, message.objects]
                });
                return;

            } else {

                sharePrettyLog({
                    $: message.$,
                    // thread: message["$"].threadId,
                    action: "Console",
                    message: "error",
                    objects: [`${message.message} Thread: ${message.$.threadId}.
        ${message.objects.stack}`]
                });
                return;

            }

        }
        // return;
   }

    // console.log(message);
    if (options.logging) {
        if ((message.action == "Console") && (message.message == "log" ||
            message.message == "info" || message.message == "warn" ||
            message.message == "error" || message.message == "debug")) {
            
            sharePrettyLog(message);

        } else {
            // throw new Error("Trace");
            // console.log(`${message.thread}:[${message.action}] ${message.message}`, message);
            console.log(colorOf.dim(`${message.thread}:`) + colorOf.underline(colorOf.green(`${message.action}`)) + ` ${message.message}`, message);
        
        }
    }
}

/**
 * Shares a Pretty Log message from the child thread.
 * To activiate use init(,{logging: true}) on the child thread and the parent thread.
 * @param {*} msg The message object containing the console.f(...args) from the child.
 */
function sharePrettyLog(msg) {

    // console.log(msg);

    var logHandler = console.log;
    var color = false;

    switch (msg.message) {
        case "log":
            //this is default
            break;
        case "info":
            color = colorOf.blue;
            logHandler = console.info;
            break;
        case "warn":
            color = colorOf.yellow;
            logHandler = console.warn;
            break;
        case "error":
            color = colorOf.red;
            logHandler = console.error;
            break;
        case "debug":
            color = colorOf.green;
            logHandler = console.debug;
            break;
        default:
            console.warn(`Threads received an unknown log message type (${msg.message}) from a child thread.`);
            break;
    }

    var firstObj = msg.objects[0];

    if (color) {
        firstObj = color(firstObj);
    }

    //remove first object if it's a string
    if (typeof firstObj === "string") {
        msg.objects.shift();

        //if I have only one data object (second arg), don't wrap it in an array.
        if (msg.objects.length == 1) {
            msg.objects = msg.objects[0];
        }

        //Util.inspect produces a string not an object, so we append it at such.

        //check to see if the remaining object is an array
        if (Array.isArray(msg.objects)) {
            //check to see if objects is now an empty array
            if (msg.objects.length == 0) {
                logHandler(colorOf.dim(`${msg.$.threadId}:[${msg.action}]`) + ` ${firstObj}`);
            } else {
                //insert a tab
                // var tab = "\t";
                logHandler(colorOf.dim(`${msg.$.threadId}:[${msg.action}]`) + ` ${firstObj} `
                + colorOf.white(util.inspect(msg.objects, {showHidden: false, depth: null, colors: true})));
            }
        } else {
            logHandler(colorOf.dim(`${msg.$.threadId}:[${msg.action}]`) + ` ${firstObj} `
            + colorOf.white(util.inspect(msg.objects, {showHidden: false, depth: null, colors: true})));
        }

        // //check to see if objects is now an empty array
        // if (msg.objects.length == 0) {
        //     logHandler(colorOf.dim(`${msg.$.threadId}:[${msg.action}]`) + ` ${firstObj}`);
        // } else {
        //     //insert a tab
        //     // var tab = "\t";
        //     logHandler(colorOf.dim(`${msg.$.threadId}:[${msg.action}]`) + ` ${firstObj} `
        //     + colorOf.white(util.inspect(msg.objects, {showHidden: false, depth: null, colors: true})));
        // }

    } else {
        logHandler(colorOf.dim(`${msg.$.threadId}:[${msg.action}]`) + ' '
        + util.inspect(msg.objects, {showHidden: false, depth: null, colors: true}));
    }

}

/**
 * A simple log function that can be turned on and off.
 * @param {*} message The message to log.
 * @param {*} object The object to report if possible.
 */
function SimpleLog(message, object = {}) {
    if (options.verbose) {
        console.log(message, object);
    }
}

/**
 * Requesta thread to close "thread.close" action on a thread by it's ID.
 * @param {*} id The ID of the thread.
 */
function close(id) {
    var thread = my.threads.search(id);
    if (thread) {
        console.log(`Closing thread ${id}`);
        Send("thread.close", {
            close: true
        }, id);
    } else { 
        throw new Error(`Thread ${id} not found.`);
    }
    // my.threads.search(id)?.process.kill();
} module.exports.close = close;

/**
 * Force quit (kill) a thread by it's ID.
 * @param {*} id The ID of the thread.
 */
function kill(id) {
    var thread = my.threads.search(id);
    if (thread) {
        console.log(`Closing thread ${id}.`);
        thread.items[0].process.kill(1);
    } else { 
        throw new Error(`Thread ${id} not found.`);
    }
    // my.threads.search(id)?.process.kill();
} module.exports.forceQuit = kill;
module.exports.kill = kill;


var lastUncaughtException = false;

/**
 * Get the last uncaught exception.
 * Promises that reject may not report properly, therefore, this function is provided.
 * @returns {object} The last uncaught exception.
 */
function GetLastUncaughtException() {
    return lastUncaughtException;
}; module.exports.getLastUncaughtException = GetLastUncaughtException;

//handle all uncaught errors
/**
 * Handles all uncaught errors.
 * @param {*} error The error that was thrown.
 */
process.on('uncaughtException', (error) => {

    lastUncaughtException = error;

    // console.error("Manager: Uncaught Exception", error);

    // console.warn("Manager: Uncaught Exception", error, typeof error, error instanceof Error);

    //is the err an error?
    if (error instanceof Error) {
        error = generateSafeError(error);
    } else if (typeof error === "string") {
        error = {
            message: error,
            stack: jckConsole.GenerateStacktrace(),
            uncaughtException: true
        }
    }

    //Do I have any promises that are unresolved?
    if (myDefferedPromises.length > 0) {
        console.log("Uncaught Exception. Rejecting all promises.");
        myDefferedPromises.forEach((promise) => {
            promise.reject({
                $: {
                    id: "promise.reject"
                },
                error: err,
                message: error.message,
                stack: error.stack
                // stack: error.stack
            });
        });
    }

    receivedLog({
        thread: "main",
        action: `process.uncaught`,
        message: `Manager: An uncaught error has occured.`,
        objects: {
            error: error,
            stack: error.stack,
        }
    });
});