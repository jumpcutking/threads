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

/**
 * Options for the thread manager.
 * - id: The id for the thread manager.
 * - ns: Extra varable for the thread manager that matches to ID for enclosed functions.
 * - verbose: Whether to output verbose logs.
 * - closeID: The id to close the thread.
 */
var options = {
    id: "threads",
    verbose: true,
    closeID: "thread.close"
}
// module.exports.options = options;

var spzArr = require("./spzArray.js");

/**
 * Internal object for the thread manager.
 */
var my = {
    threads: false,
    actions: false
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
 * @param {*} id The id of the thread manager.
 */
function init(id = "threads") {
    SimpleLog(`Setting up thread manager: ${id}`, {
        id: id
    })

    options.id = id;
    options.ns = id;

    my.threads = new spzArr(`${options.id}.threads`);
    my.actions = new spzArr(`${options.id}.actions`);
    
    //support the child logs (without dual passing them.
    addAction("log", receivedLog);

    //if the Thread Manager's process is closing, close all threads
    process.on('exit', function () {
        SimpleLog("Process is exiting. Closing all threads.");
        Send(options.closeID, {
            exitType: "process.exit" 
        });
    });

}  
module.exports.init = init;

/**
 * Adds a thead to the manager.
 * Messages sent from the child thread that are not formatted correctly can be read by attaching an onData handler.
 * Options:     All options are optional.
 *              onData: function(data) { ... }  Return from the thread.
 *              onError: function(data) { ... } Return from the thread on an error
 *              onExit: function(code) { ... }  Return from the thread when it exits.
 *              onSend: function(message) { ... }  Reports what's being sent to a thread before it is sent.
 *              disableActions: true|false      Disable the default action handler.
 * @param {*} id the id of the thread. Must be unique.
 * @param {*} local the script to spawn
 * @param {*} options the options, such as spawn args, and delegates. 
 * @returns 
 */
function add(id, local, options) {
    SimpleLog("Adding thread.", {
        id: id,
        local: local,
        options: options
    });

    try {
        
        var thread = {
            id: id,
            local: local,
            options: options,
            process: false,
            send: false,
            buffer: ''
        };

        if (my.threads.add(thread)) {

            SimpleLog("Spwaning process.", {
                id: id,
                local: local
            });

            thread.process = spawn('node', [local]);

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
                        action: `process.creation.notConnected`,
                        message: `Thread: ${thread.id} not running. Message failed.`,
                        objects: {
                            message: message,
                            data: data
                        }
                    });
                 }
            };

            return true;

        } else {
            receivedLog({
                thread: thread.id,
                action: `process.creation.failed`,
                message: `Thread: ${thread.id} not running. Message failed.`,
                objects: {
                    message: message
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
 * @param {*} id The id of the action.
 * @param {*} handler The function to call when the action is requested.
 * @returns 
 */
function addAction(id, handler) {
    SimpleLog("Adding action.", {
        id: id,
        handler: handler
    });

    return my.actions.add({
        id: id,
        handler: handler
    });
}
module.exports.addAction = addAction;

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
function Send(actionID, message, threadID = "") {
    
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

    var sent = false;
    try {
        //if thread is blank or "*"
        if (threadID == "*" || threadID == "") {
            threadID = "*";
            //send to all threads
            my.threads.registry.forEach(thread => {
               thread.send(message);
               sent = true;
            });
        } else {
            //send to a specific thread
            my.threads.search(threadID)?.send(message);
            sent = true;
        }
    } catch (error) {
        receivedLog({
            thread: id,
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

/**
 * Handles messages received from the child thread.
 * @param {*} thread The thread object that the message was received from.
 * @param {*} message The data received from the thread.
 * @returns 
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
        if (message[0] != "{") {
            // console.log("***** Not JSON");
            // console.dir(message); <-- see the actual real data in the console (not trimmed by console.log)
            SimpleLog("Message not JSON.", {
                thread: detialsOfThread(thread),
                message: message
            });
            return;
        }

        //convert the message to a json object
        message = JSON.parse(message);

        //is an action registered
        var action = my.actions.search(message.$.id)?.handler;
        if (action) {
            SimpleLog("Running found action.", {
                thread: detialsOfThread(thread),
                message: message
            });
            action(message);
        } else {
            receivedLog({
                thread: thread.id,
                action: `onData.actionNotRegistered`,
                message: `Requested action: ${message.$.id} is not registered.`,
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
 * @returns  A clone of the thread obect without the process.
 */
function detialsOfThread(thread) {
    //clone the obect and remove process
    var details = JSON.parse(JSON.stringify(thread));
    delete details.process;
    delete details.buffer;
    return details;
}

/**
 * Reports messages from threads to the console. (to prevent tripple messages)
 * @param {*} message 
 */
function receivedLog(message) {
    // console.log(message);
    console.log(`${message.thread}:[${message.action}] ${message.message}`, message);
}

/**
 * Reports parent thread the messages to the console (in the same format as children).
 * @param {*} action The ID of the action. 
 * @param {*} message The message to report.
 * @param {*} objects The objects sent from the child thread.
 */
function log(action, message, objects) {
    console.log(`${options.id}:[${action}] ${message}`, {
        thread: options.id,
        action: action,
        message: message,
        objects: objects
    });
}

module.exports.log = log

/**
 * A simple log function that can be turned on and off.
 * @param {*} message The message to log.
 * @param {*} object The object to report if possible.
 */
function SimpleLog(message, object = {}) {
    if (options.verbose) {
        console.log(message, object, {verbose: verbose});
    }
}

/**
 * Should the thread output extra log messages?
 * @param {*} verbose 
 */
function SetVerbose(verbose) {
    options.verbose = verbose;
} module.exports.SetVerbose = SetVerbose;