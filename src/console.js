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

/**
 * A child thread's new console object, used to log messages to the console.
 */
var myConsole = Console({ stdout: process.stdout, stderr: process.stderr }); 

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
 * Sets up the overiding log function.
 * @param {*} type 
 * @param {*} args 
 * @param {*} logger If you'd like the output to go to the console, use this function. Modify args as needed.
 */
var logDelegate = function (type, args, logger) {};

/**
 * Initializes the console to report to the parent thread.
 *
 * During debug mode, a child thread will report to the console
 * as normal otherwise the console on the child thread will be
 * silenced.
 * @param {*} _logDelegate The function to call when a log is made. The thread creates one and passes it here.
 */
function init(_logDelegate) {
    logDelegate = _logDelegate;
    console.log("Console is ready.")
    console = zconsole();
}; module.exports.init = init;