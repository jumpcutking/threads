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

var options = {
    id: "threads.thread",
    verbose: false,
    closeAction: "thread.close"
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
// module.exports.options = options;

/**
 * Set up the child thread.
 * @param {*} id The ID of the child thread.
 */
function init(id = "thread") {
    options.id = id;

    my.actions = new spzArr(`${id}.actions`);

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
                "id": "${options.closeAction}"
            },
                "from": "stdin"
        }`);
    });

    addAction("thread.close", Close);

}  
module.exports.init = init;

/** Requested close. */
function Close() {
    process.exit(0);
}

/**
 * Adds an action to the thread.
 * @param {*} id The id of the action.
 * @param {*} handler The function to call when the action is requested.
 * @returns 
 */
function addAction(id, handler) {

    return my.actions.add({
        id: id,
        handler: handler
    });
}
module.exports.addAction = addAction;

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
        if (handler) {
             handler(message);
        } else {
            log("onData.actionNotRegistered", `Requested action: ${message.$.id} is not registered.`, message)
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
 * @param {*} id The id of the action to request.
 * @param {*} message The data to send to the parent process.
 */
function request(id, message) {
  
    if ("$" in message) {
        message.$.id = id;
    } else {
        message.$ = {
            id: id
        };
    }

    message = `\x04${JSON.stringify(message)}\x04`;
    process.stdout.write(message);

}
module.exports.request = request;

/**
 * Adds a new action to the thread.
 * @param {*} id The id of the action to listen for from the parent process.
 * @param {*} handler The function to call when the action is requested.
 * @returns 
 */
function addAction(id, handler) {
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
 * Should the thread output extra log messages?
 * @param {*} verbose 
 */
function SetVerbose(verbose) {
    options.verbose = verbose;
} module.exports.SetVerbose = SetVerbose;