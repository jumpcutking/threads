/**
 * Thread module for the child process.
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 * 
 * @module @jumpcutking/threads/src/thread
 * @auther @jumpcutking
 */

/**
 * The @jumpcutking/console contrustor, for creating and working with the console.
 * @see https://www.github.com/jumpcutking/console
 */
var jckConsole = require("@jumpcutking/console"); 

/**
 * The options that you can set in the module.
 * id: the name of the thread
 * verbose: whether to log verbose messages
 * closeAction: the action to fire when the thread is closed
 * debug: if activated, no messages will be sent to the thread manager.
 * keepAlive: the thread will stay active awaiting further requests until closed.
 * logging: if true, the thread will log messages to the thread manager. It will also overide console.
 * quitOnException: if true, the thread will quit when an exception is thrown.
 * console: the jckConsole options. @see {@link module:@jumpcutking/console~startup} for details.
 * santizeStacktrace: if true, the stack trace will be santized to remove the path of the thread. Safe for displaying to the user. Replaces Process.cwd() with ~, usually producing "~/script.js".
 */
var options = {
    id: "threads.thread",
    verbose: false,
    closeAction: "thread.close",
    debug: false,
    keepAlive: true,
    logging: false,
    quitOnException: true, 
    console: {},
    santizeStacktrace: false
}

/**
 * The buffer for incoming data.
 */
var buffer = "";

var spzArr = require("./spzArray.js");
var my = {
    actions: false
}

module.exports.actions = my.actions;
module.exports.options = options;

/**
 * Set up the child thread.
 * @param {Object} _options The options to set up the thread with.
 * @property {string} id The name of the thread.
 * @property {boolean} verbose Whether to log verbose messages.
 * @property {string} closeAction The action to fire when the thread is closed.
 * @property {boolean} debug If activated, no messages will be sent to the thread manager.
 * @property {boolean} keepAlive The thread will stay active awaiting further requests until closed.
 * @property {boolean} logging If true, the thread will log messages to the thread manager. It will also overide console.
 * @property {boolean} quitOnException If true, the thread will quit when an exception is thrown.
 * @property {object} console The jckConsole options. @see {@link module:@jumpcutking/console~startup} for details.
 */
function init(_options = {}) {

    log_verbose("init", `Initializing thread...`, {
        script: process.argv[1],
        options: _options
    });

    // options.id = id;

    if ("debug" in _options) {
        options.debug = _options.debug;
    }

    if ("verbose" in _options) {
        options.verbose = _options.verbose;
    }

    if ("closeAction" in _options) {
        options.closeAction = _options.closeAction;
    }

    if ("keepAlive" in _options) {
        options.keepAlive = _options.keepAlive;
    }

    if ("logging" in _options) {
        options.logging = _options.logging;
    }

    if ("quitOnException" in _options) {
        options.quitOnException = _options.quitOnException;
    }

    if ("console" in _options) {
        options.console = _options.console;
    }

    my.actions = new spzArr(`thread.actions`);

    //if Debug mode is activated, report it as an error.
    if (options.debug) {
        console.error(`DEBUG MODE: The new thread has debug mode activated. The thread will operate silently to the thread manager.`, {
            script: process.argv[1]
        });
    }

    /**
     * Receives messages from the thread manager (host) process.
     */
    process.stdin.on('data', (data) => {
        buffer += data;
        const messages = buffer.split('\x04');
        buffer = messages.pop();
    
        for (const message of messages) {
            if (message === '') {
                continue;
            }
            handleMessage(message);
        }
    });

    /**
     * Closes the thread.
     * Fires the action "thread.close"
     * The from property will identify the process was closed by STDIN (process.exit/quit)
     *      as opposed to calling the action directly - which should yield same result.
     */
    process.stdin.on('end', function () {
        log_verbose("process.ending", `Parent requested end. Firing: ${options.closeAction}`, null);
        handleMessage(`{
            "$": {
                "id": "${options.closeAction}",
                "threadId": "${options.id}"
            },
                "from": "stdin"
        }`);
    });

    addAction(options.closeAction, Close);
    addAction("thread.startup", Startup);

    if (options.keepAlive) {
        //keep the process alive
        setInterval(() => {}, 1000);
    }

    //overide logging functions
    if (options.logging) {
        log_verbose("init", "Logging is enabled.", null);

        if (!(options.debug)) {
            OverideConsole();
        } else {

            jckConsole.startup({
                reportToConsole: true,
                generateStacktrace: false,
                storeLogs: false
            });

            console.log("Debug mode is activated so the orveriding console will be limited to prevent a RangeError of Maximum call stack size exceeded.");

        }

    }

    /**
     * The thread object will output log messages if verbose is turned on.
     */
    process.on('uncaughtException', (err) => {

        //Do I have a promise awaiting resolve?


        //convert error to json
        err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));

        log("process.uncaught", "An uncaught exception occurred.", err);

        if (options.quitOnException) {
            process.exit(2);
        }

        // console.error('Asynchronous error caught.', err);
    });


    if (options.debug) {
        DebugStartUp();
    }

}  module.exports.init = init;

async function DebugStartUp() {

    var jsonMessage = {
        "$": {
            "id": "thread.startup",
            "threadId": "test.thread.123"
        }
    };

    handleMessage(JSON.stringify(jsonMessage));

}

var OverideConsoleOptions = {
    hasRun: false,
    console: {}
};

function OverideConsole() {
    console.log("Overiding console.");

    if (OverideConsoleOptions.hasRun) {
        throw new Error("OverideConsole has already been called.");
    }

    //require("./console.js");
    // cnz.init((type, args, _log) => {
    //     // process.write("HI!");
    //     log("Console" , type, args);    
    //     _log(args);
    // });

    var consoleOptions = {
        reportToConsole: false,
        generateStacktrace: false,
        storeLogs: false
    };

    if ("console" in options) {
        //overide defaults or add new properties
        consoleOptions = Object.assign(consoleOptions, options.console);
    }

    jckConsole.startup(consoleOptions);

    jckConsole.on("entry", function (type, message, args, stack) {
        if (stack == null) {
            log("Console", type, [message, ...args]);
        } else {
            log("Console", type, [message, ...args, {stack: stack}]);
        }
    });

    // console.log("Console Options", consoleOptions);

    // console.info("Test Info");
    // console.warn("Test Warn");
    // console.error("Test Error");
    // console.log("Test log");

    OverideConsoleOptions.hasRun = true;

} module.exports.OverideConsole = OverideConsole;

/**
 * Get's information about the thread from the thread manager.
 * @param {*} data The object sent from the thread manager. Including the threadID (.threadId).
 */
function Startup(data) {
    log_verbose("Startup", `Thread: ${options.id} is starting up.`, data);
    options.id = data.threadId;

    //send a message to the thread manager that the thread is ready.
    request("thread.ready", {
        status: "ready"
    });

}

/**
 *  Closes the thread gracefully. 
*/
function Close() {
    process.exit(0);
}

/**
 * Handles a message object from the Thread Manager.
 * @param {*} message The message object from the thread manager.
 * @property {object} message.$ The global object for the message.
 * @property {string} message.$.id The id of the message.
 * @property {object} message.$.promise The promise object. (If it's a promise.)
 * @returns {object} {resolve, reject} The resolve and reject functions for the promise.
 * @property {object} resolve When a message is resolved, this object will be passed to the thread manager.
 * @property {object} resolve.$ The global object for the message.
 * @property {string} resolve.$.id The id of the message. "promise.resolve"
 * @property {object} resolve.$.promise The promise object.
 * @property {string} resolve.$.actionId The id of the action that was resolved.
 * @property {object} resolve.$.threadId The id of the thread that resolved the promise.
 * @property {object} reject When a message is rejected, this object will be passed to the thread manager.
 * @property {object} reject.$ The global object for the message.
 * @property {string} reject.$.id The id of the message. "promise.reject"
 * @property {object} reject.$.promise The promise object.
 * @property {string} reject.$.actionId The id of the action that was rejected.
 * @property {object} reject.$.threadId The id of the thread that rejected the promise.
 * @property {object} reject.stack The stack trace of the error. (if an error object was passed in) Uses module: @jumpcutking/console~stacktrace object.
 * @see {@link module:@jumpcutking/console~parseStackTrace} for complete details
 * @property {object} reject.message The message of the error. (if an error object was passed in)      
 */
async function handleMessage(message) {
    // console.log(`The Child received the message: ${message}`);

    //Check if the message is a string, if so, parse it.
    if (typeof message === "string") {
        message = JSON.parse(message);
    }

    //check to see if the message contains a $.promise object

    if ("promise" in message.$) {
        //I'm a promise so create a resolve and reject function

        /**
         * Resolves a deffered promise.
         * Properties will be appended to the data object, like that of it's message object.
         * @param {*} data The data to resolve the promise with.
         * @property {object} data.$ The global object for the message.
         * @property {string} data.$.id The id of the message. "promise.resolve"
         * @property {object} data.$.promise The promise object.
         * @property {string} data.$.actionId The id of the action that was resolved.
         * @property {object} data.$.threadId The id of the thread that resolved the promise.
         */
        message.$.promise.resolve = function (data) {

            //if the data is not an object it will be wraped in a data property.
            if (typeof data !== "object") {
                data = {
                    data: data
                };
            }

            //add the promise object to the data object
            data.$ = {
                promise: message.$.promise,
                actionId: message.$.id//,
                // id: "promise.resolve"
            };

            request("promise.resolve", data);

        };

        /**
         * Rejects a deffered promise.
         * Properties will be appended to the data object, like that of it's message object.
         * @param {*} data The data to reject the promise with. 
         * @property {object} data.$ The global object for the message.
         * @property {string} data.$.id The id of the message. "promise.reject"
         * @property {object} data.$.promise The promise object.
         * @property {string} data.$.actionId The id of the action that was rejected.
         * @property {object} data.$.threadId The id of the thread that rejected the promise.
         * @property {object} data.stack The stack trace of the error. (if err is an error)
         * @property {object} data.message The message of the error. (if err is an error)
         */
        message.$.promise.reject = function (err, data = null) {

                err = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));


                //use @jumpcutking/console~stacktrace object to share stack trace
                if ("stack" in err) {
                    err.stack = jckConsole.parseStackTrace(err.stack, 1);
                }

                //add the promise object to the data object
                err.$ = {
                    promise: message.$.promise,//,
                    actionId: message.$.id
                    //id: "promise.reject"
                };

                //if the data is not null and not an object it will be wraped in a data property.
                if (!data == null) {

                    if (typeof data !== "object") {
                        data = {
                            data: data
                        };
                    }

                    err.data = data;
                }

                request("promise.reject", err);
        
        };
    }

    //let's call the action

    try {

        // var message = JSON.parse(message);
        var handler = my.actions.search(message.$.id);
        // console.log("Search results...", {
        //     handler: handler,
        //     searchResult: my.actions.search(message.$.id),
        //     search: message.$.id
        // });

        if (handler) {

            var repo = {};
            //for each hander.items - call the handler
            for (var i = 0; i < handler.items.length; i++) {
                repo = await handler.items[i].handler(message);
            }

            //if the message is a promise, resolve it.
            if ("promise" in message.$) {
                message.$.promise.resolve(repo);
            } else {
                //if response is not undefined through an error
                if (typeof repo !== "undefined") {
                    log("onData.responseFromAction", `The requested listener expected a promise to be requested and returned a result. An action that is not a promise should not return a result. A request type without a promise must send a result with an action ID should be requested from the manager.`, {message})
                }
            }    

        } else {
            
            //if the message is a promise reject it
            if ("promise" in message.$) {

                var err = new Error(`The action ${message.$.id} is not registered.`);
                message.$.promise.reject(err);

            } else {

                log("onData.actionNotRegistered", `Requested action: ${message.$.id} is not registered to the thread: ${options.id}.`, {message});

            }
        }

    } catch (error) {

        //if the message is a promise reject it
        if ("promise" in message.$) {
            message.$.promise.reject(error);
        }

        // log_verbose("onData.error", `Thread: ${options.id} ${error.message}.`, {
        //     error: error,
        //     message: message
        // });

        var stacktrace = jckConsole.parseStackTrace(error.stack, 1);
        error = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        error.stack = stacktrace;

        console.warn(`${error.message} [on thread ${options.id}]`, {
            error: error,
            message: message
        });

        log_verbose("onData.error", `Thread: ${options.id} ${error.message}.`, {
            error: error,
            message: message
        });

    }

} module.exports.handleMessage = handleMessage;

var procPath = process.cwd();

/**
 * Request a message from the parent process.
 * Any non-object or array will be wrapped in a data property. Message.data
 * @param {string} id The id of the action to request.
 * @param {*} message The data to send to the parent process. Will defualt to an empty object.
 */
function request(id, message = {}) {

    // if message is null or undefined, set it to an empty object.
    if (!message) {
        message = {};
    }

    //if it's an array, wrap it in a data property.
    if (Array.isArray(message)) {
        message = {
            data: message
        };
    
        //if message is not an object, wrap it in a data property.
    
    } else if (typeof message !== "object") {
        message = {
            data: message
        };
    }
   
    //recursively search for any objects that are type error and convert them to strings.
    message = JSON.parse(JSON.stringify(message, function (key, value) {
        if (value instanceof Error) {
            var stack = jckConsole.parseStackTrace(value.stack);
            var error = {};
            Object.getOwnPropertyNames(value).forEach(function (key) {
                error[key] = value[key];
            });

            // error.cwd = procPath;
            //santize the stack trace

            if (options.santizeStacktrace) {
                for (var i = 0; i < stack.length; i++) {
                    try {
                        if ("file" in stack[i]) {
                            stack[i].file = stack[i].file.replace(procPath, "~");
                        }
                    } catch (error) {
                        
                    }

                }
            }

            error.stack = stack;
            return error;
        }
        return value;
    }));

    //ensure all properties of the message are now detatched using Object.GetOwnPropertyNames
    // message = JSON.parse(JSON.stringify(message, Object.getOwnPropertyNames(message)));
  
    if ("$" in message) {
        message.$.id = id;
        message.$.threadId = options.id;
    } else {
        message.$ = {
            id: id,
            threadId: options.id
        };
    }

    /**
     * If debug is true, then the message will not be sent to the thread manager.
     */
    if (options.debug == true) {
        console.log("DEBUG MODE: Message would be sent to thread manager.", message);
        return;
    }

    message = `\x04${JSON.stringify(message)}\x04`;
    process.stdout.write(message);

}
module.exports.request = request;
module.exports.send = request; // for consistency

/**
 * Adds a new action to the thread.
 * @param {string} id The id of the action to listen for from the parent process.
 * @param {*} handler The function to call when the action is requested.
 */
function addAction(id, handler) {
    log_verbose("addAction", `Adding action: ${id}`, {
        id: id,
        handler: handler
    });
    return my.actions.add({
        id: id,
        handler: handler
    }, true);
}
module.exports.addAction = addAction;
module.exports.add = addAction;

/**
 * Report a log entry to the parent thread. Use for debugging.
 *      Consider this your replacement for console.log.
 * @param {*} action The action that occurred.
 * @param {*} message The human readable message of the event.
 * @param {*} objects Any optional objects to send with the log entry.
 */
function log(action, message, objects = {}) {
    request("log", {
        // thread: options.id,
        action: action,
        message: message,
        objects: objects
    });
}
module.exports.log = log;

/**
 * The thread object will output log messages if verbose is turned on.
 * @param {*} action The ID of the actiom.
 * @param {*} message The message to report.
 * @param {*} objects The objects associated with the log entry.
 */
function log_verbose(action, message, objects = {}) {
   if (options.verbose) {
        log(action, message, objects);
   }
}

/**
 * List all the threads and listerners.
 * @returns {Object} {threads: [], listerners: []}
 */
function list() {
    return {
        actions: my.actions.list()
    }
}
module.exports.list = list;

/**
 * Removes an action from the thread.
 * @param {*} id The id of the action to remove.
 * @param {*} index The index of the action to remove.
 */
function removeAt(id, index) {
    my.actions.removeAt(id, index);
} module.exports.removeAt = removeAt;


// /**
//  * Should the thread output extra log messages?
//  * @param {*} verbose 
//  */
// function SetVerbose(verbose) {
//     options.verbose = verbose;
// } module.exports.SetVerbose = SetVerbose;


//create a async/await version of setTimeout
/**
 * A async/await version of setTimeout.
 * @param {*} ms The number of milliseconds to wait.
 * @returns {Promise} A promise that will resolve after the specified number of milliseconds.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} module.exports.sleep = sleep;