/**
 * JumpCutKing/Threads
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 **/

var threads = require("./src/threads.js");
var thread = require("./src/thread.js");
var santize = require("./src/sanitize.js");

/**
 *  Threads manager.
 */
module.exports = {
    threads: threads,
    thread: thread,
    sanitize: santize
};
