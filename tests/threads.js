//intialize the threads manager
var id = "TestThreadManager";

//Let's use Thread's beautiful console features for consistent messages from the logger.
// var threadConsole = require("../src/console");
// threadConsole.init(null, {
//   usePrettyLog: true
// });


var jckConsole = require("@jumpcutking/console");
jckConsole.startup({
    reportToConsole: true,
    generateStacktrace: false,
    storeLogs: false
});


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
    },
    onStartup: StartTest
  });


 /** test a requestAwait */
async function TestAwait() {

  console.log("Testing Deferred Promise... (await)");
  
  try {
    
    //get the response from the thread
    var r = await threads.async("mythread.awaitResponse", {
      hello: "universe"
    });

    console.log("Promise (await) Resolved!", r);

  } catch (error) {

    // console.warn(threads.getLastUncaughtException());

    console.error("Promise (await) Rejected!", error);
    
  }

} 

/** the thread manager has reported the thread is ready to go! */
async function StartTest() {

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

  TestAwait();
}



// async function ListenForRequests(message) {
//   //I've received a message from the thread manager.
//   console.log("From Test: Listener Got a Request", message);
// };

// async function ListenForMessages(message) {
//   //I've received a message from the thread manager.
//   console.log("From Test: Listener Got a Message (children)", message);
// };

// //attach the listenerts to to the thread manager
// //Requests are made from the main thread to other children
// threads.addRequestsListener(ListenForRequests);

// //Received messages are sent from the children to the thread manager
// threads.addReceivedListener(ListenForMessages);

// threads.on("received", (message) => {
//   console.log("***From Test: Listener Got a Message (children)", message);
// });