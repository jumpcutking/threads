//import the module
var { thread } = require("../index.js");

// //init the thread
thread.init({
    verbose: false,
    debug: false,
    keepAlive: true,
    logging: true
});

//activate debug mode thread
// thread.init({
//     verbose: true,
//     debug: true,
//     keepAlive: true,
//     logging: true
// });


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
    console.info("Received the count request.", data);
    // thread.log(thread.options.id, "Received the count request.", data);
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

/**
 * Parent hello action!
 */
thread.add("parent-hello", async (data) => {
    console.log("Received the parent-hello message", data);
    ThankYou(data);
});

thread.add("direct-message", async (data) => {
    console.log("Received the direct-message message", data);
    ThankYou(data);
});


/**
 * Function sends a unified response to the thread manager.
 * @param {*} data 
 */
function ThankYou(data) {
    thread.request("thank-you", {
        recieved: data,
        myid: thread.options.id
    })
}

console.log("Thread is ready.", thread.list());

/** Test Thread Requests */

if (thread.options.debug) {

    thread.handleMessage({
        $:{
            id: "parent-hello"
        },
        hello: "world"
    });

    thread.handleMessage({
        $:{
            id: "direct-message"
        },
        hello: "world"
    });
}

thread.add("prepare-to-toggle", async (data) => {
    //we won't be getting any data on this request - but we will get basic information about the request.
    // console.log("Received the prepare-to-toggle message", data);
    thread.request("toggle");
});

//close after 3 seconds
setTimeout(() => {
    console.log("Closing thread.");
    process.exit(0);
}, 20000);