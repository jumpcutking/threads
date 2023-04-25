//import the module
var { threads } = require("../index.js");
var id = "threadManager";

console.log(`Starting Threads Test, the thread manager is identified as ${id}`);

//Turn off verbose mode - or you'll get flodded with messages
threads.SetVerbose(false);

//intialize the threads manager
threads.init(`${id}.threads`);

//add a thread
threads.add("test.thread","./thread.js", {
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
    //Certian threads can be disabled from global actions (which actually disables all actions)
    //with the exception of the threads.threads.search(id).send() method.
    disableActions: false
});

//Add an action to the thread
threads.addAction("parent-count", async (data) => {
    console.log(`Parent thread count: ${data.count}`, data);
});

console.log("The Thread Manager", threads.list());

console.log("Sending hello world");

//send a message to the thread
threads.send("helloworld", {
    message: "Hello World"
 });

//start the count by requesting the function from the thread.
console.log("Starting count");

//requesting the function from the thread.
threads.send("mythread.count", {
    startAt: 10
 });
 
/**
 * The console sould out put something like this.
 * 
 * If you have any issues please report them to the github repo.

Starting Threads Test, the thread manager is identified as threadManager
Threads List:  { threads: [ 'test.thread' ], actions: [ 'log', 'parent-count' ] }
Sending hello world
Starting count
test.thread:[onData.actionNotRegistered] Requested action: parent-hello is not registered. {
  thread: 'test.thread',
  action: 'onData.actionNotRegistered',
  message: 'Requested action: parent-hello is not registered.',
  objects: {
    data: { hello: 'parent', '$': [Object] },
    thread: { id: 'test.thread', local: './thread.js', options: [Object] }
  }
}
mythread:[mythread] Received the count request. {
  thread: 'mythread',
  action: 'mythread',
  message: 'Received the count request.',
  objects: { startAt: 10, '$': { id: 'mythread.count' } },
  '$': { id: 'log' }
}
Parent thread count: 11 { count: 11, '$': { id: 'parent-count' } }
Parent thread count: 12 { count: 12, '$': { id: 'parent-count' } }
Parent thread count: 13 { count: 13, '$': { id: 'parent-count' } }
Parent thread count: 14 { count: 14, '$': { id: 'parent-count' } }
Parent thread count: 15 { count: 15, '$': { id: 'parent-count' } }
Parent thread count: 16 { count: 16, '$': { id: 'parent-count' } }
Parent thread count: 17 { count: 17, '$': { id: 'parent-count' } }
Parent thread count: 18 { count: 18, '$': { id: 'parent-count' } }
Parent thread count: 19 { count: 19, '$': { id: 'parent-count' } }
Parent thread count: 20 { count: 20, '$': { id: 'parent-count' } }
Parent thread count: 21 { count: 21, '$': { id: 'parent-count' } }
Parent thread count: 22 { count: 22, '$': { id: 'parent-count' } }
Parent thread count: 23 { count: 23, '$': { id: 'parent-count' } }
Parent thread count: 24 { count: 24, '$': { id: 'parent-count' } }
Parent thread count: 25 { count: 25, '$': { id: 'parent-count' } }
Parent thread count: 26 { count: 26, '$': { id: 'parent-count' } }
Parent thread count: 27 { count: 27, '$': { id: 'parent-count' } }
Parent thread count: 28 { count: 28, '$': { id: 'parent-count' } }
Parent thread count: 29 { count: 29, '$': { id: 'parent-count' } }
test.thread:[process.exit] The thread: test.thread exited with code: 0. {
  thread: 'test.thread',
  action: 'process.exit',
  message: 'The thread: test.thread exited with code: 0.'
}

*/