// init the thread
var { thread } = require("../index.js");
thread.init({
    verbose: false,
    debug: false,
    keepAlive: true,
    logging: true,
    quitOnException: false
});

//The thread has started up (received information from the parent thread)
thread.add("thread.startup", async (data) => {

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
        count = data.startAt;

        setInterval(() => {
            count++;

            thread.request("parent-count", {
                count: count
            });

        }, 1000);

    });

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

    thread.add("prepare-to-toggle", async (data) => {
        //we won't be getting any data on this request - but we will get basic
        // information about the request.
        thread.request("toggle");
    });

    var secondToggleID = false;
    secondToggleID = thread.add("prepare-to-toggle", async (data) => {
        console.log("Just so a thread can register multiple actions, so I'm a second event/action fired.", data);
        thread.removeAt("prepare-to-toggle", secondToggleID); //remove the action
        thread.request("ask-me-to-toggle");
    });

    //close after 3 seconds
    setTimeout(() => {
        console.log("Closing thread.");
        process.exit(0);
    }, 20000);

    console.log("Thread is ready.", thread.list());

});