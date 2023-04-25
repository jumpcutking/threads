//import the module
var { thread } = require("../index.js");

//init the thread
var id = "mythread";
thread.init(id);
thread.SetVerbose(false);

//showcase how a console.log would work from the child thread.
console.log("I'm a thread.");

//add the actoin "hello world"
//These actions don't need to be async, but it's good practice to make them async.
thread.add("helloworld", async (data) => {

    //send a request to the parent thread
    thread.request("parent-hello", {
        hello: "parent"
    });

});

//This test will start the count at the parent provided number and count up every second.
var count = 0;
thread.add("mythread.count", async (data) => {
    thread.log(id, "Received the count request.", data);
    count = data.startAt;

    setInterval(() => {
        //increment the count, log the count, sent the request
        count++;

        //Silenced the log so you see less messages.
        // thread.log(id, "Sending count", count);
        thread.request("parent-count", {
            count: count
        });

    }, 1000);

});

/**
 * This is if the parent request the thread to close.
 */
thread.add("thead.close", async (data) => {
    console.log("Received the thread.close message", data);
    process.exit(0);
});

//close after 3 seconds
setTimeout(() => {
    console.log("Closing thread.");
    process.exit(0);
}, 20000);
