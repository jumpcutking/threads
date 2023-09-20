/**
 * Thread manager for spawned node processes.
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 **/

var { spawn } = require('child_process');
var util = require('util');

//let's us log colors to the console, for easy reading
var colorOf = require("colors");

/**
 * Options for the thread manager.
 * - id: The id for the thread manager.
 * - verbose: Whether to output verbose logs.
 * - closeID: The id to close the thread.
 * - logging: Whether to output any logs from console.log from the child thread. Logging must be enabled at the child thread.
 */
var options = {
    id: "threads",
    verbose: false,
    logging: true,
    closeID: "thread.close"
}
// module.exports.options = options;

var spzArr = require("./spzArray.js");

/**
 * Internal object for the thread manager.
 */
var my = {
    threads: false,
    actions: false,
    listener: {
        requests: [],
        received: []
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
 *  - id: The id for the thread manager.
 *  - verbose: Whether to output verbose logs.
 *  - closeID: The id to close the thread.
 *  - logging: Whether to output any logs from console.log from the child thread. Logging must be enabled at the child thread.
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


}  
module.exports.init = init;

/**
 * Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.
 * @param {*} listener 
 */
function addRequestsListener(listener) {
    my.listener.requests.push(listener);
    SimpleLog("Added requesting message listener.", listener);
}
module.exports.addRequestsListener = addRequestsListener;

/**
 * Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.
 * @param {*} listener
 */
function addReceivedListener(listener) {
    my.listener.received.push(listener);
    SimpleLog("Added received message listener.", listener);
}
module.exports.addReceivedListener = addReceivedListener;


/**
 * Adds a thead to the manager.
 * Messages sent from the child thread that are not formatted correctly can be read by attaching an onData handler.
 * Options:     All options are optional.
 *              onData: function(data) { ... }  Return from the thread.
 *              onError: function(data) { ... } Return from the thread on an error
 *              onExit: function(code) { ... }  Return from the thread when it exits.
 *              onSend: function(message) { ... }  Reports what's being sent to a thread before it is sent.
 *              disableActions: true|false      Disable the default action handler.
 *              spawn: {
 *                  command: "node",            The command to spawn the thread with. Default: node, but can be any command.
 *              }
 * @param {string} id the id of the thread. Must be unique.
 * @param {*} local the script to spawn
 * @param {*} options the options for the thread.
 * @returns {boolean} True if the thread was added or false if the thread had an issue.
 */
function add(id, local, options = {}) {

    if (my.threads == false) {
        throw new Error("Thread manager not initialized. Call init() first.");
    }


    SimpleLog("Adding thread.", {
        id: id,
        local: local,
        options: options
    });

    var spawnOptions = {
        command: "node"
    }

    //Passthrough the options for spawning a new process.
    if ("spawn" in options) {
        if ("command" in options.spawn) {
            spawnOptions.command = options.spawn.command;
        }
    }

    try {
        
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
                local: local
            });

            thread.process = spawn(spawnOptions.command, [local]);

            // set the encoding of the stdout stream to 'utf8'
            thread.process.stdout.setEncoding('utf8'); //may need to change to UTF-32

            /**
             * Handles an exit from the thread.
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
             */
            thread.process.stderr.on('data', (data) => {
                //TO DO: Check if I need to buffer error data as well?
                data = `${data}`;

                receivedLog({
                    thread: thread.id,
                    action: `process.stderr`,
                    message: `Error in thread: ${id}`,
                    objects: {
                        message: data
                    }
                });

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
             * @param {*} message 
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
                my.threads.add(thread)
                return true;
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

    } catch (error) {

        receivedLog({
            thread: thread.id,
            action: `process.creation.error`,
            message: `Could not add thread: ${thread.id}.`,
            objects: {
                id: id,
                local: local,
                options: options,
                error: error
            }
        });

        return false;
        
    }


}
module.exports.addThread = add;
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
}
module.exports.addAction = addAction;

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
}
module.exports.list = list;

/**
 * Send message to a thread.
 * If threadID is not provided, the message will be sent to all threads.
 * @param {*} actionID The id of the action to be called.
 * @param {*} message The message to be sent.
 * @param {*} threadID The id of the thread to send the message to. If id is blank, the message will be sent to all threads.
 */
function Send(actionID, message = {}, threadID = "") {

    // if message is null or undefined, set it to an empty object.
    if (!message) {
        message = {};
    }
    
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
module.exports.send = Send;
module.exports.request = Send; //for consistency sake

/**
 * Sends the request message that is about to be sent to all threads to any request listeners.
 * They should be async or functions. 
 * All errors will be caught and logged.
 * @param {*} message The standard message object. $.id is the action id.
 */
function SendMessageToRequestListeners(message) {
       //Send the message to any attached listener, if any, before sending to the thread.
       try {
        
        if (my.listener.requests.length > 0) {
            my.listener.requests.forEach(listener => {
                try {
                    listener(message)
                } catch (error) {
                    SimpleLog("Error in calling listener (request send).", {
                        error: error,
                        listerner: listener,
                        message: message
                    })
                }
            });
        }
    } catch (error) {
        SimpleLog("Error in handling listener (request send).", {
            error: error,
            message: message
        });
    }
}

/**
 * Sends a mesage to all listener functions aded to my.listener.received - they should be async or functions.
 * All errors will be caught and logged.
 * @param {*} message The standard message object. $.id is the action id. if $.id = thread.id + "process.exit" - a process has exited.
 */
function SendMessageToReceivedListeners(message) {
    //fire all received listerners
    try {
        if (my.listener.received.length > 0) {
            my.listener.received.forEach(listener => {
                try {
                    listener(message);
                } catch (error) {
                    SimpleLog("Error in calling listener (recv message).", {
                        error: error,
                        listerner: listener,
                        message: message
                    })
                }
            });
        }
    } catch (error) {
        SimpleLog("Error in handling listener (recv message).", {
            error: error,
            message: message
        });
    }
}

/**
 * Handles messages received from the child thread.
 * @param {*} thread The thread object that the message was received from.
 * @param {*} message The data received from the thread.
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
 * @param {*} message 
 */
function receivedLog(message) {

    // console.log(message);
    if (message.action == "process.uncaught") {

        var nObject = {...message.objects};
        delete nObject.stack;
        delete nObject.message;

        if (Object.keys(nObject).length == 0) {
            sharePrettyLog({
                $: message.$,
                // thread: message["$"].threadId,
                action: "Console",
                message: "error",
                objects: [`An uncaught error has occured in thread ${message["$"].threadId}.
    ${message.objects.message}
    ${message.objects.stack}`]
            });
            return;

        } else {

            sharePrettyLog({
                $: message.$,
                // thread: message["$"].threadId,
                action: "Console",
                message: "error",
                objects: [`An uncaught error has occured in thread ${message["$"].threadId}.
    ${message.objects.message}
    ${message.objects.stack}`, nObject]
            });
            return;
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

        //check to see if objects is now an empty array
        if (msg.objects.length == 0) {
            logHandler(colorOf.dim(`${msg.$.threadId}:[${msg.action}]`) + ` ${firstObj}`);
        } else {
            logHandler(colorOf.dim(`${msg.$.threadId}:[${msg.action}]`) + ` ${firstObj}`,
                util.inspect(msg.objects, {showHidden: false, depth: null, colors: true}));
        }
    } else {
        logHandler(colorOf.dim(`${msg.$.threadId}:[${msg.action}]`), 
            util.inspect(msg.objects, {showHidden: false, depth: null, colors: true}));
    }

}

// /**
//  * Reports parent thread the messages to the console (in the same format as children).
//  * @param {*} action The ID of the action. 
//  * @param {*} message The message to report.
//  * @param {*} objects The objects sent from the child thread.
//  */
// function log(action, message, objects) {
//     // throw new Error("Trace");
//     console.log(colorOf.dim(`${options.id}:`) + colorOf.underline(colorOf.green(`${action}`)) + ` ${message}`, {
//         thread: options.id,
//         action: action,
//         message: message,
//         objects: objects
//     });
// }

// module.exports.log = log

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
        console.log(`Closing thread ${id}`)
        thread.process.kill(1);
    } else { 
        throw new Error(`Thread ${id} not found.`);
    }
    // my.threads.search(id)?.process.kill();
} module.exports.forceQuit = kill;
module.exports.kill = kill;



// /**
//  * @deprecated
//  * Depreciated. Should the thread output extra log messages?
//  * @param {*} verbose 
//  */
// function SetVerbose(verbose) {
//     options.verbose = verbose;
// } module.exports.SetVerbose = SetVerbose;