/**
 * Thread Manager for children processes
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 **/

/**
 * The options that you can set in the module.
 * id: the name of the thread
 * verbose: whether to log verbose messages
 * closeAction: the action to fire when the thread is closed
 * debug: if activated, no messages will be sent to the thread manager.
 * keepAlive: the thread will stay active awaiting further requests until closed.
 * logging: if true, the thread will log messages to the thread manager. It will also overide console.
 */
var options = {
    id: "threads.thread",
    verbose: false,
    closeAction: "thread.close",
    debug: false,
    keepAlive: true,
    logging: false
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

    addAction("thread.close", Close);
    addAction("thread.startup", Startup);

    if (options.keepAlive) {
        //keep the process alive
        setInterval(() => {}, 1000);
    }

    //overide logging functions
    if (options.logging) {
        log_verbose("init", "Logging is enabled.", null);

        OverideConsole();

    }

}  module.exports.init = init;

var OverideConsoleOptions = {
    hasRun: false,
    console: {}
};

function OverideConsole() {
    console.log("Overiding console.");

    if (OverideConsoleOptions.hasRun) {
        throw new Error("OverideConsole has already been called.");
    }

    var cnz = require("./console.js");
    cnz.init((type, args, _log) => {
        // process.write("HI!");
        log("Console" , type, args);    
        _log(args);
    });

    OverideConsoleOptions.hasRun = true;

} module.exports.OverideConsole = OverideConsole;

/**
 * Get's information about the thread from the thread manager.
 * @param {*} data The object sent from the thread manager. Including the threadID (.threadId).
 */
function Startup(data) {
    console.log("Startup", data);
    options.id = data.threadId;
}

/**
 *  Closes the thread gracefully. 
*/
function Close() {
    process.exit(0);
}

/**
 * Handles a message object from the Thread Manager.
 * @param {*} message 
 */
function handleMessage(message) {
    // console.log(`The Child received the message: ${message}`);
    try {

        //Check if the message is a string, if so, parse it.
        if (typeof message === "string") {
            message = JSON.parse(message);
        }

        // var message = JSON.parse(message);
        var handler = my.actions.search(message.$.id)?.handler;
        // console.log("Search results...", {
        //     handler: handler,
        //     searchResult: my.actions.search(message.$.id),
        //     search: message.$.id
        // });

        if (handler) {
             handler(message);
        } else {
            log("onData.actionNotRegistered", `Requested action: ${message.$.id} is not registered to the thread: ${options.id}.`, {message})
        }
    } catch (error) {
        log_verbose("onData.error", `Thread: ${options.id} Could not parse JSON.`, {
            error: error,
            message: message
        });
    }
}
module.exports.handleMessage = handleMessage;

/**
 * Request a message from the parent process.
 * @param {string} id The id of the action to request.
 * @param {*} message The data to send to the parent process. Will defualt to an empty object.
 */
function request(id, message = {}) {

    // if message is null or undefined, set it to an empty object.
    if (!message) {
        message = {};
    }
  
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
    });
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
        thread: options.id,
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


// /**
//  * Should the thread output extra log messages?
//  * @param {*} verbose 
//  */
// function SetVerbose(verbose) {
//     options.verbose = verbose;
// } module.exports.SetVerbose = SetVerbose;


/**
 * The thread object will output log messages if verbose is turned on.
 */
process.on('uncaughtException', (err) => {

    //convert error to json
    err = JSON.stringify(err, Object.getOwnPropertyNames(err));

    log("process.uncaught", "An uncaught exception occurred.", err);
    // console.error('Asynchronous error caught.', err);
});