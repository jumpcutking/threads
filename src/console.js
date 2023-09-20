/**
 * Used to replace Node's build in console, with one we can attach
 * a listerner to. This enables children to send messages to the
 * parent thread using console.log's known syntax.
 * 
 * During debug mode, a child thread will report to the console
 * as normal otherwise the console on the child thread will be
 * silenced.
 * 
 * Justin K Kazmierczak
 */

/**
 * The console contrustor, for creating and working with the console.
 */
var Console = require("node:console").Console;
var colorOf = require("colors");
var util = require("util");

/**
 * A child thread's new console object, used to log messages to the console.
 */
var myConsole = Console({ stdout: process.stdout, stderr: process.stderr }); 
// var myid = "Parent";

/**
 * Sets up the overiding log function.
 * @param {*} type 
 * @param {*} args 
 * @param {*} logger If you'd like the output to go to the console, use this function. Modify args as needed.
 */
var logDelegate = function (type, args, logger) {};

/**
 * @jumpcutking/threads - Child Console Object
 * This replaces the normal node:console object for easy reporting to the 
 * managing parent thread.
 * @returns {Object} The new console object.
 */
var zconsole = () => {
    return {
        log: function (...text) {
            logDelegate("log", text, myConsole.log);
            // myConsole.log(text);
            // Your code
        },
        info: function (...text) {
            logDelegate("info", text, myConsole.info);
            // myConsole.info(text);
            // Your code
        },
        warn: function (...text) {
            logDelegate("warn", text, myConsole.warn);
            // myConsole.warn(text);
            // Your code
        },
        error: function (...text) {
            logDelegate("error", text, myConsole.error); 
            // myConsole.error(text);              
            // Your code
        },
        debug: function (...text) {
            logDelegate("debug", text), myConsole.debug;
            // myConsole.debug(text);
            // Your code
        }
    };
};

/**
 * Initializes the console to report to the parent thread.
 *
 * During debug mode, a child thread will report to the console
 * as normal otherwise the console on the child thread will be
 * silenced.
 * @param {*} _logDelegate The function to call when a log is made. The thread creates one and passes it here. If using pretty log, send null or false.
 * @param {*} options The options to set for the console. 
 *    usePrettyLog: true/false - whether to show beautiful logs (consisit) in the console.
 */
function init(_logDelegate, options = {}) {

    //Should I use the pretty log?
    if ("usePrettyLog" in options) {
        logDelegate = pLog;
    } else {
        logDelegate = _logDelegate;
    }

    //The id of this process to make it easier to read console messages
    if ("parentId" in options) {
        myid = options.parentId;
    }

    // console.log("Console is ready.")
    console = zconsole();
}; module.exports.init = init;

function pLog(type, args, logger) {

    sharePrettyLog({
        message: type,
        objects: args
    }, logger);

} module.exports.pLog = pLog;

/**
 * Shares a Pretty Log message in the terminal
 * @param {*} msg The message object containing the console.f(...args) from the child.
 * @param {*} logHandler The function to call to log the message. Do NOT USE console.log!
 */
function sharePrettyLog(msg, logHandler) {

    // console.log(msg);

    var logHandler = logHandler;
    var color = false;

    switch (msg.message) {
        case "log":
            //this is default
            break;
        case "info":
            color = colorOf.blue;
            // logHandler = console.info; 
            break;
        case "warn":
            color = colorOf.yellow;
            // logHandler = console.warn;
            break;
        case "error":
            color = colorOf.red;
            // logHandler = console.error;
            break;
        case "debug":
            color = colorOf.green;
            // logHandler = console.debug;
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

        //check to see if objects is now an empty array
        if (msg.objects.length == 0) {
            logHandler(`${firstObj}`);
        } else {
            //insert a tab
            // var tab = "\t";
            logHandler(`${firstObj} `
            + colorOf.white(util.inspect(msg.objects, {showHidden: false, depth: null, colors: true})));
        }

    } else {
        logHandler(
        util.inspect(msg.objects, {showHidden: false, depth: null, colors: true}));
    }

} module.exports.sharePrettyLog = sharePrettyLog;