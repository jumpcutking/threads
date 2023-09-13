# threads
Threads is a multiple-thread management tool handling a pool of threads and communication between all connected threads for node.js. Threads is a powerful solution to going beyond web workers. Threads share the same modules and have access to the same scripts but don't require forked processes. Threads also communicate through encoded JSON.

Originally built as part of The Universe App Tools, I've released the source to help the community solve the node threading problem: supporting Node.JS function with multiple process threads and communicating between all processes.

## What's New
Threads.close(id) will now close a specific thread by its id.

Thread children can now have console.log overridden to report logs directly to the parent thread.

Logs are now a little prettier, and reading the information from the console is easier.

Verbose mode is now activated on init().

Enabling logging {logging: true} on a child thread will override the console.

You can now request actions without data. This is great to close a thread or toggle a variable.

Hush has been replaced with logging. Activate {logging: true} on both the Thread manager and the child.

I've enhanced the error handling object to report when an action failed. Previously, you would have gotten the catch-all error when reporting JSON parsing errors. Generally, you'll never get a JSON parsing error from within the thread.js scripting modules. However, you may want to check the logic of additional processes that support threads.js.

To prevent an out-of-sequence order, attempting to add a thread without initiating the thread manager will cause an error. Call threads.init() before calling threads.add.

## Program Level Documentation
You can find it in [DOCS.md](https://github.com/jumpcutking/threads/blob/main/DOCS.md), you can recreate the docs using createDocs.js in the project's root. 

You can run the documentation builder using NPM Docs.
```
NPM docs
```

## License
The license is close to MIT, with a few essential modifications. Check the license file for more information. It was developed for use as part of The Universe. While it is offered freely in the traditional MIT license style, it's important to note that using Threads to circumvent or compromise the security of the Universe or developers using The Universe is a clear violation of [The Universe Terms of Service https://egtuniverse.com/legal/terms](https://egtuniverse.com/legal/terms). 

# Thread Manager
The thread manager is a short module designed to enable messages to be sent or received from both the threads and the parent process (running the thread manager.) It's a unique and helpful messaging system that is easily expanded. For example, sending a message by its ID to all threads or a specific thread is simple.

## Install
Use NPM to install and "--save" the module to your project's package.json file.

```Shell
npm install @jumpcutking/threads --save
```
# Getting Started: Thread Manager
The thread manager uses an init function to prevent creating objects in memory until they are needed. Also, if you encounter any issues - you can turn on verbose mode. It's on by default at this early stage, so feel free to turn it off - or you'll get flooded with messages.

```Javascript
var { threads } = require("@jumpcutking/threads");

//initialize the threads manager
//choose an ID that will be easy to remember as you watch the logs
threads.init(`my.threads`, {
    verbose: false, // silence unknown messages
    logging: true // activate collecting logs from parent threads
});
```

## Adding a thread to the manager
Threads are spawned based on the location of the current script. Supply only a node file for this thread. Other process types have not been tested; with some modification, they might work as well.

```Javascript
//add a thread
thread.add("test.thread","./thread.js", {
    onSend: function(data) {
        //Anytime data is sent to a child, we can access the data here.
        // console.log("Sent data to thread", data);
    },
    onData: function(data) {
        //Anytime data is received from a child, we can access the data here.
        // console.log("Got data from thread", data);
    },
    onExit: function(code) {
        //Anytime a process quits, let's report it.
        // console.log("Thread is exiting", code);
    },
    onError: function(data) {
        //Anytime an error occurs, we can see it.
        // console.log("The thread sent an error", data);
    },
    //Certain threads can be disabled from global actions (which disables all actions)
    //except for the threads.threads.search(id).send() method.
    disableActions: false
});
```

## Spawn a process outside of Node
You can spawn any process with the Thread Manager; however, the process will need to support the manager. It will need to receive a thread.startup action, and handle actions sent to it in the process stream. Node will be the default.

## Actions (Received Messages)
Actions are activated on any message sent from the thread to its children, and the children use the object of their action (per Child) to handle requests from the thread manager. Unregistered actions will report issues to the console. You'll get a warning when a message has been requested with no action attached.

Actions aren't limited to promises but how they are called; they can be both async/await promises (chains are untested) and normal event-halting functions.

```Javascript
//Add an action to the thread
threads.addAction("parent-count", async (data) => {
    console.log(`Parent thread count: ${data.count}`, data);
});
```

## Send a Request to all Threads
A request is sent to all threads by default or by setting a wildcard (*) as the thread ID in the threads.send function.

```Javascript
//send a message to the thread
threads.send("hello world", {
    message: "Hello World"
});

//you can now send requests without data
threads.send("prepare-to-toggle");
```

### Direct Requests (Direct Messaging a Thread)
A request can be dispatched to a thread ID registered to the Thread Manager. To do so, add a thread ID to the third parameter.

```Javascript
threads.send("direct-message", {
    message: "This is a direct message!"
}, "test.thread");
```

## Check the Manager
You can quickly output all the registered processes and actions to check the manager. The thread module will return just the registered actions.

```Javascript
console.log("The Thread Manager: ", threads.list());
```

## Requests, Actions, and Messages
Message objects are sent to threads, and children are handled internally. However, suppose you're trying to add support for threads in your application and spawn a different process (which you can do by sending spawn.command: (command) when adding a thread) or perhaps integrate with other parts of your program. In that case, you'll need to know how messages are formatted.

Message objects will always have a meta object. Each request will override this object, but received messages will not be overridden and are expected to send messages in the following format.

```Javascript
    {
        $:{
            id: "myactionid"
        },
        (...) //the data to be shared.
    }
```


An action will be fired based on the id of that action.

The $ variable will act as an overridden special id with the information provided by the thread manager. Avoid using this property when sending data through the thread manager or a thread.

## Attach listeners
You can now attach functions to be fired as events. They are referred to in code as listeners.

Identical to how actions are attached, you can create a portion of your code to listen to all events requested (send to children) by adding a requests listener (addRequestsListener). You can do the same thing with received requests (from the children) (addReceivedListener).

```Javascript
sync function ListenForRequests(message) {
    //I've received a message from the thread manager.
    console.log("Listener Got a Request", message);
};

async function ListenForMessages(message) {
    //I've received a message from the thread manager.
    console.log("Listener Got a Message (children)", message);
};

//Attach the listeners to the thread manager
//Requests are made from the main thread to other children
threads.addRequestsListener(ListenForRequests);

//Received messages are sent from the children to the thread manager
threads.addReceivedListener(ListenForMessages);

// Another way you could write this.
// threads.addReceivedListener((message) => {
//   //I've received a message from the thread manager.
//   console.log("Listener Got a Message (children)", message);
// });
```

## Close a Thread
A thread can be closed by its id. The process will be asked to exit "process.kill(0)".

The thread will report it has been closed using the action "process.exit".

# Logging
Both the Child and The Parent support a common log system. A child thread with the option {logging: true} activated (on itself) will report console.info(), console.log(), console.warn(), and console.debug(). The console will be overridden and yet still report issues during debug mode.

The parent thread or thread manager will control whether or not both the log messages from the child and the internal debugging messages from @jumpcutking/Threads itself.

The options {verbose: true, logging: true} on the parent thread manager init help toggle the amount of logging. Verbose activates detailed logs about the internal workings of the Thread Manager; this can be very helpful when creating a process to work with threads that are not written in a supported program language. Logging will activate the specific action that a child's thread will report or deactivate so that only the parent thread's specific console is revealed.

# Children Threads
The thread manager comes with a child thread management object. This will receive messages from the parent object, run actions, and send requests to the parent. The manager creates the thread's ID (as provided to you during thread add/creation).

```Javascript
    //import the module from your child
    var { thread } = require("@jumpcutking/threads");

    //init the thread
    thread.init();
```

## Debugging a Thread without the Thread Manager
A child thread can be run independently from the thread manager by activating debug mode and running the script itself. Add {debug: true} to start debug mode in the options property. You can "test" messages from the thread manager by calling the thread.handleMessage function.

```Javascript
//import the module
var { thread } = require("../index.js");

//init the thread
thread.init({
    verbose: false, // silence thread specific log messages
    debug: false, // activate debug mode
    keepAlive: true, // Keep the thread alive for futher actions
    logging: true // Activate log overide through console.log();...
});

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
```

## Getting

An example thread is included below and can also be found in tests/thread.js

```Javascript
//import the module
var { thread } = require("@jumpcutking/threads");

//init the thread
thread.init({
    keepAlive: true
});

//add the action "hello world."
//These actions don't need to be async, but it's good practice to make them async.
thread.add("hello world", async (data) => {

    //send a request to the parent thread
    thread.request("parent-hello", {
        hello: "parent"
    });

});

/**
 * This is if the parent requests the thread to close.
 */
thread.add("thead.close", async (data) => {
    console.log("Received the thread.close message", data);
    process.exit(0);
});
```

## Children Actions (Received Messages)
Just like in the Thread Manager, a child thread receives a message request, and an action is fired. You'll get a warning when a message has been requested with no action attached. To do that, use the thread.add() function.

```Javascript
thread.add("hello world", async (data) => {
    //send a request to the parent thread
    thread.request("parent-hello", {
        hello: "parent"
    });
});
```

## Child Thread Request (Send a Message to the Thread Manager)
A child can make a request to the parent thread (or rather the Thread Manager) by requesting an action to be fired by it's ID.

```Javascript
//send a request to the parent thread
thread.request("parent-hello", {
    hello: "parent"
});
```

## Requests, Actions, and Messages
Message objects sent by the thread will include an additional property in the $ variable, "threadId".
```Javascript
{
    $:{
        id: "myactionid"
        threaded: "my thread" //only threads will provide this property
    },
    (...)
}
```

Your actions will be spawned based on the id of the action.

## Keep a Child Alive
For a Node.js Process (a thread) to not close before you have sent it a message or request. Simply provide a {keepAlive: true} in the options variable of the thread init function.

# Tests
I've created a thread manager test that showcases all of the features. To run it, call it in a terminal.

```Shell
npm test
```