//import the module
var { threads } = require("../index.js");
var id = "threadManager";

console.log(`Starting Threads Test, the thread manager is identified as ${id}`);

//Turn off verbose mode - or you'll get flodded with messages
// threads.SetVerbose(true);

//intialize the threads manager
threads.init(`${id}.threads`, {
    verbose: false,
    logging: true
});

//Let's create an function for handling messages received and sent to the threads.
//This is the power of the thread manager.
//You could attach this to various other potions of your code.

/*
async function ListenForRequests(message) {
  //I've received a message from the thread manager.
  console.log("From Test: Listener Got a Request", message);
};

async function ListenForMessages(message) {
  //I've received a message from the thread manager.
  console.log("From Test: Listener Got a Message (children)", message);
};

//attach the listenerts to to the thread manager
//Requests are made from the main thread to other children
threads.addRequestsListener(ListenForRequests);

//Received messages are sent from the children to the thread manager
threads.addReceivedListener(ListenForMessages);
*/

// Another way you could write this.
// threads.addReceivedListener((message) => {
//   //I've received a message from the thread manager.
//   console.log("Listener Got a Message (children)", message);
// });

//These functions allow more than one function to be attached to the thread manager.
//They don't replace onSend, onData, onExit - but they do enable more attached events

//add a thread
threads.add("test.thread.123","./thread.js", {
    /* 
    onSend: function(data) {
        //Anytime data is sent to a child, we can acess the data here.
        // console.log("Sent data to thread", data);
    },
    onData: function(data) {
        //Anytime data is received from a child, we can acess the data here.
        // console.log("Got data from thread", data);
    },
    onExit: function(code) {
        //Anytime a process quits, let's report it.
        // console.log("Thread is exiting", code);
    },
    onError: function(data) {
        //Anytime an error occurs, we an see it.
        // console.log("The thread sent an error", data);
    },
    */
    //Certian threads can be disabled from global actions (which actually disables all actions)
    //with the exception of the threads.threads.search(id).send() method.
    disableActions: false
});

//Add an action to the thread
threads.addAction("parent-count", async (data) => {
    console.log(`From Test: Parent thread count: ${data.count}`, data);
});

console.log("From Test: The Thread Manager", threads.list());

console.log("From Test: Sending hello world");

//send a message to the thread
threads.send("helloworld", {
    message: "Hello World"
 });

 threads.send("direct-message", {
    message: "This is a direct message!"
 }, "test.thread.123");

threads.addAction("thank-you", async (data) => {
    console.log("From Test: A child thread has received a message.", data);
});

threads.addAction("parent-hello", async (data) => {
  console.log("From Test: The thread says hello!", data);
});

var toggle = true;
threads.addAction("toggle", async (data) => {
  //no data will be sent on this request - but we will get a $ message object with thread information.
  toggle = !toggle;
  console.log("From Test: The thread has asked to toggle!", {
    toggle: toggle
  });
});

//start the count by requesting the function from the thread.
//Shows the registered actions and the running threads.
console.log("Starting count");

//Let's toggle the test toggle twice!
threads.send("prepare-to-toggle");
threads.send("prepare-to-toggle");

//requesting the function from the thread.
threads.send("mythread.count", {
    startAt: 10
 });

//  //test to see if the thread will close
//  //The thread will be asked to quit and may continue to process items.
//  threads.close("test.thread.123");

//  //force quite a thread - terminate without processing remaining items
//  threads.forceQuit("test.thread.123");
 
/**
 * The console will output the following:
 * 
 * If you have any issues please report them to the github repo.


> @jumpcutking/threads@1.2.5 test
> node tests/test.js

Starting Threads Test, the thread manager is identified as threadManager
From Test: The Thread Manager { threads: [ 'test.thread.123' ], actions: [ 'log', 'parent-count' ] }
From Test: Sending hello world
Starting count
From Test: The thread says hello! {
  hello: 'parent',
  '$': { id: 'parent-hello', threadId: 'test.thread.123' }
}
From Test: A child thread has received a message. {
  recieved: {
    message: 'This is a direct message!',
    '$': { id: 'direct-message' }
  },
  myid: 'test.thread.123',
  '$': { id: 'thank-you', threadId: 'test.thread.123' }
}
From Test: The thread has asked to toggle! { toggle: false }
From Test: The thread has asked to toggle! { toggle: true }
test.thread.123:[test.thread.123] Received the count request. {
  thread: 'test.thread.123',
  action: 'test.thread.123',
  message: 'Received the count request.',
  objects: { startAt: 10, '$': { id: 'mythread.count' } },
  '$': { id: 'log', threadId: 'test.thread.123' }
}
From Test: Parent thread count: 11 { count: 11, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 12 { count: 12, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 13 { count: 13, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 14 { count: 14, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 15 { count: 15, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 16 { count: 16, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 17 { count: 17, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 18 { count: 18, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 19 { count: 19, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 20 { count: 20, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 21 { count: 21, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 22 { count: 22, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 23 { count: 23, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 24 { count: 24, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 25 { count: 25, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 26 { count: 26, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 27 { count: 27, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 28 { count: 28, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
From Test: Parent thread count: 29 { count: 29, '$': { id: 'parent-count', threadId: 'test.thread.123' } }
test.thread.123:[process.exit] The thread: test.thread.123 exited with code: 0. {
  thread: 'test.thread.123',
  action: 'process.exit',
  message: 'The thread: test.thread.123 exited with code: 0.'
}
*/