//intialize the threads manager
var id = "TestThreadManager";
console.log(`Starting the test, the thread manager is identified as ${id}`);

var { threads } = require("../index.js");
threads.init(`${id}.threads`, {
    verbose: false,
    logging: true
});

//add a thread
threads.add("test.thread.123","./thread.js", {
    spawn: {
        command: "node",
        args: "--trace-warnings"
    }
});

var toggle = true;
threads.addAction("toggle", async (data) => {
  //no data will be sent on this request - but we will get a
  //  $ message object with thread information.
  toggle = !toggle;
  console.log("From Test: The thread has asked to toggle!", {
    toggle: toggle
  });
});

//Test multiple actions
var ExtraToggleIndex = false;
ExtraToggleIndex = threads.addAction("toggle", async (data) => {
  //no data will be sent on this request - but we will get a
  //  $ message object with thread information.
  console.log("It looks like I'm trying to toggle, so I'm a second event/action fired.", data);
  threads.removeActionAt("toggle", ExtraToggleIndex);
});

//Add an action, that a child thread can call.
threads.addAction("parent-count", async (data) => {
  console.log(`From Test: Parent thread count: ${data.count}`, data);
});

//Let's toggle the test toggle twice!
threads.send("prepare-to-toggle");
// threads.send("prepare-to-toggle");

threads.addAction("ask-me-to-toggle", async (data) => {
  console.log("From Test: The thread has asked me to toggle!");
  threads.send("prepare-to-toggle");
});

//Start the cound
console.log("Starting count");
threads.send("mythread.count", {
    startAt: 10
 });