# threads
Threads is a multiple-thread management tool supporting async/await promises or event dispatching to handle a pool of separate processes "threads" and communication between all connected threads for node.js. Threads is a powerful solution to going beyond web workers. Threads share the same modules and have access to the same scripts but don't require forked processes. Threads also communicate through encoded JSON.

Originally built as part of The Universe App Tools, I've released the source to help the community solve the node threading problem: supporting Node.JS function with multiple process threads and communicating between all processes.

## Known Bugs
Multiple "uncaught" messages may be reported to the console when an uncaught exception occurs. This bug also affects multi-level threading processes where more than one thread manager is in play (such as building Universe App Tools from the local webserver). 

## What's New
### v1.7.1
Another round of Bug fixes.

### v1.7.0
Threads now reports promises, functions, and undefined elements back to the thread manager using a descriptive JSON object. It's for identification and debugging purposes only. You can't call functions passed between threads for multiple reasons. I'll choose security for now. In the future, I could update lines to use functions passed into objects using deferred promises, but you should use registered actions to prevent hackers from abusing scripts. The generateSafeError function is now universal to all areas of the code and relies on @jumpcutking/console's version.

You'll note a new "JSON.stringify.override" module in the source code. The new module offers a quick and universal function for converting JSON and identifying non-stringifyable objects. You'll need to use this consistently when communicating through threads. Threads will do it automatically for you, but using this for debugging, database storage, and the like is not bad. At the very least, it helps keep track of failed variables because you forgot to wait for a promise to resolve.

A helpful change to @jumpcutking/console will help stack traces be clickable. I added a "s" string variable that enables code editors with integrated terminals (such as Visual Studio Code) to retain clickable stack traces. Feel free to delete this variable from databases and where needed.

### v1.6.0
Threads now report where a log entry was created in your script and share that information with the console. This update relies on a breaking change to jckConsole callbacks, adding the parameter "from" to several components. 

Threads now delete their entries after the manager closes or kills them.

This update also includes many bug fixes and changes to help improve Thread's performance.

### v1.5.7
Using the option reportStderr: true will now report process errors using the jckConsole stack trace. Remember, any stack trace that is a string, not an object, is textual information. Because stderr is an inconsistent stream, you may get a string instead of an object in the stack trace array. See more here: [@jumpcutking/console~GenerateStacktrace(stacktrace, _levelToRemove)](https://github.com/jumpcutking/console/blob/main/docs/index.js.md#jumpcutkingconsolegeneratestacktracestacktrace-_leveltoremove--object).

### v1.5.5
This is a breaking changes update. Threads has been updated to rely more and more on jckConsole.parseStackTrace(). If you detect and treat errors like "error" objects, you'll find the .stack() is now an array of stack objects. All "error" objects have their object properties presented to the thread manager. See more here: [@jumpcutking/console](https://github.com/jumpcutking/console).

### v1.5.3
Fixed an issue with threads.kill(); not working properly.

### v1.5.2
Further fixes in error handling.

### v1.5.1
Fixed a bug where non-object data or array data would be passed to the thread manager without the global $ property. This causes the message to be rejected by the thread manager. Now, non-object and array data will be wrapped in an object with the data property (message.data).

### v1.5.0
Threads now supports promises through the technique known as deferred promises. I've tested it using async/await using the function threads.awaitResponse();, chains haven't been fully tested but using .catch() should perform as expected.

Event listeners (outside of actions) can now be added using the standard event listening function .on(type, callback); they are fired using .fire(type, message).

Documentation has moved to individual files in the docs folder. You can recreate the docs using createDocs.js in the project's root. They should be located here: [https://github.com/jumpcutking/threads/tree/main/docs](https://github.com/jumpcutking/threads/tree/main/docs). 

Replaced src/console with @jumpcutking/console. This will allow for better control over the console and how it reports messages.

Added jckConsole options to individual threads. You can generate stack traces for each console item, store logs individually, and more. See the documentation for more information. [@jumpcutking/console](https://github.com/jumpcutking/console).

```Javascript
var jckConsole = require("@jumpcutking/console");
jckConsole.startup({
    reportToConsole: true,
    generateStacktrace: false,
    storeLogs: false
});
```

### v1.4.2
Changes were overridden by v1.5.0. See v1.5.0 for more information.

### v1.4.1
Added options.reportStderr to the Thread Manager, which will now default to false. This prevents parroting (duplicate messages) of uncaught exceptions, console.error|warn, and other error messages. You will want to activate report errors if you're using a non-traditional process, such as something other than Node (like an AV Encoder). 

Added support for custom command arguments; this helps add "--trace-warnings" and other command line arguments. Either pass a string to have it automatically split on "space" or take granular control (say for file names) by passing an array of strings that will not be modified.

### v1.4.0
Threads now support adding multiple events to actions (event listeners) on both the parent and child threads. This can be done naturally by adding new events to the same ID. Threads.addAction and Thread.add will return the ID of the current event to make it easy to remove that event when needed. Use the new function Threads.removeActionAt(id, index) and Thread.removeAt(id, index) to remove the event listener by its index. 

## Program Level Documentation
You can find it in [DOCS](https://github.com/jumpcutking/threads/tree/main/docs), you can recreate the docs using createDocs.js in the project's root. 

You can run the documentation builder using NPM Docs.
```
NPM run docs
```

## MIT License
Threads was developed for use as part of The Universe. While it is offered freely in the traditional MIT license style, except that I've added a notice not to use threads to compromise or abuse The Universe. [The Universe Terms of Service https://egtuniverse.com/legal/terms](https://egtuniverse.com/legal/terms). 

# Thread Manager
The thread manager is a short module designed to enable messages to be sent or received from both the threads and the parent process (running the thread manager.) It's a unique and helpful messaging system that can easily be expanded. For example, sending a message by its ID to all threads or a specific thread is simple.

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

Check out the documentation for more information on the options object.

## Spawn a process outside of Node
You can spawn any process with the Thread Manager; however, the process will need to support the manager. It will need to receive a thread.startup action, and handle actions sent to it in the process stream. Node will be the default.

## Actions (Received Messages) - Event Listeners
Actions work similarly to event listeners they are activated on any message sent from the thread to its children, and the children use the object of their action (per Child) to handle requests from the thread manager. Unregistered actions will report issues to the console. You'll get a warning when a message has been requested with no action attached.

Actions aren't limited to promises but how they are called; they can be both async/await promises (chains are untested) and normal event-halting functions.

```Javascript
//Add an action to the thread
threads.addAction("parent-count", async (data) => {
    console.log(`Parent thread count: ${data.count}`, data);
});
```

## Startup action.
After a thread has been spawned, it will be initialized with its thread ID. To start actions immediately after the thread has been started, use the action "thread.startup" in the child thread.

```Javascript
thread.add("thread.startup", async (data) => {
    console.log("The thread has started!");

    //do the first run stuff here
});
```

## Create Multiple Events on Actions
You can add additional event listeners to an action by the same method. addAction will also return the index of the newly created event listener.

## Remove Event Listeners and Actions
An event listener can be removed by its known index using the Threads.removeActionAt(id, index). You can use Threads.remove(id) to remove the entire action and all associated listeners.

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

## Direct Requests (Direct Messaging a Thread)
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

Message objects will always have a meta object. Each request will override this object, but received messages will not be overridden, and messages will be expected to be sent in the following format.

```Javascript
    {
        $:{
            id: "myactionid"
        },
        (...) //the data to be shared.
    }
```

An action (event) will be fired based on the id of that action.

The $ variable will act as an overridden special ID with the information provided by the thread manager. Avoid using this property when sending data through the thread manager or a thread.

## Attach listeners
You can now attach functions to be fired as events. They are referred to in code as listeners.

Identical to how actions are attached, you can create a portion of your code to listen to all events requested (send to children) by adding a requests listener (addRequestsListener). You can do the same thing with received requests (from the children) (addReceivedListener).

** Don't use the quitOnException thread option on threads with promises; otherwise, your promise will not resolve when an exception occurs because the thread has closed. **

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
//threads.addRequestsListener(ListenForRequests);
threads.on("request", ListenForRequests);

//Received messages are sent from the children to the thread manager
//threads.addReceivedListener(ListenForMessages);
threads.on("received", ListenForMessages);

// Another way you could write this.
// threads.addReceivedListener((message) => {
//   //I've received a message from the thread manager.
//   console.log("Listener Got a Message (children)", message);
// });
```

## Close a Thread
A thread can be closed by its id. The process will be asked to exit "process.kill(1)".

The thread will report it has been closed using the action "process.exit".

# Logging
Both the Child and The Parent support the common console.log system through [@jumpcutking/console](https://github.com/jumpcutking/console). The thread will have its console object overridden to facilitate communication between the parent and the child. 

A child thread with the option {logging: true} activated (on itself) will report console.info(), console.log(), console.warn(), and console.debug(). The console will be overridden and yet still report issues during debug mode.

The parent thread or thread manager will control whether or not both the log messages from the child and the internal debugging messages from @jumpcutking/Threads itself. You can use [@jumpcutking/console](https://github.com/jumpcutking/console) in the parent thread to facilitate common use of the new console object. Check out the documentation for more information at [@jumpcutking/console](https://github.com/jumpcutking/console).

```Javascript
var jckConsole = require("@jumpcutking/console");
jckConsole.startup({
    reportToConsole: true,
    generateStacktrace: false,
    storeLogs: false
});
```

The options {verbose: true, logging: true} on the parent thread manager init help toggle the amount of logging. Verbose activates detailed logs about the internal workings of the Thread Manager; this can be very helpful when creating a process to work with threads that are not written in a supported program language. Logging will activate the specific action that a child's thread will report or deactivate so that only the parent thread's specific console is revealed.

# Children Threads
The thread manager comes with a child thread management object. This will receive messages from the parent object, run actions, and send requests to the parent. The manager creates the thread's ID (as provided to you during thread add/creation).

```Javascript
    //import the module from your child
    var { thread } = require("@jumpcutking/threads");

    //init the thread
    thread.init();
```

A child thread will receive any uncaught exception and report it to the parent. A child thread will stay alive to receive further commands. You can change this behavior using the initialization options "keepAlive" and "quitOnException."

## Debugging a Thread without the Thread Manager
A child thread can be run independently from the thread manager by activating debug mode and running the script itself. Add {debug: true} to start debug mode in the options property. You can "test" messages from the thread manager by calling the thread.handleMessage function.

```Javascript
//import the module
var { thread } = require("../index.js");

//init the thread
thread.init({
    verbose: false, // silence thread specific log messages
    debug: false, // activate debug mode
    keepAlive: true, // Keep the thread alive for further actions
    logging: true, // Activate log overide through console.log();...
    quitOnException: false // should an uncaught exception require the thread to close
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
.init({
    keepAlive: true
});

//add the action "Hello world."
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

## Create Multiple Events on Actions
You can add additional events to an action by the same method. Thread.add will also return the index of the newly created event listener.

## Remove Event Listeners and Actions
An event listener can be removed by its known index using the Thread.removeAt(id, index). You can use Thread.remove(id) to remove the entire action and all associated listeners.

## Child Thread Request (Send a Message to the Thread Manager)
A child can make a request to the parent thread (or rather the Thread Manager) by requesting an action to be fired by its ID.

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
        threadId: "my thread" //only threads will provide this property
    },
    (...)
}
```

Your actions will be spawned based on the id of the action.

## Keep a Child Alive
For a Node.js Process (a thread) to not close before you have sent it a message or request. Simply provide a {keepAlive: true} in the options variable of the thread init function.

# Promises and Async/Await in Threads

Threads support promises through async/await, chains haven't been fully tested but it is safe to assume a .catch() will perform as expected. You can use the threads.awaitResponse function to send a request to a thread and wait for a response. The thread.awaitResponse function will return a promise that will be resolved when the thread responds or rejected if the thread does not respond within the timeout.

```javascript
//send a request to the parent thread
var r = await threads.async("mythread.awaitResponse", {
    hello: "universe"
});
```

## Promise Resolution (response on Async/Await)

A thread action that supports async/await should ALWAYS return a result. The thread can simple use return and the thread manager will handle the rest. The thread manager will return the following response object.

```javascript

```


## Promise Rejection (exception on Async/Await)

When a promise is rejected, an exception (or rejection) will be triggered. You will receive the following rejection object. The stack trace returned from a promise rejection IS NOT a standard string. It is an object that contains the stack trace information parsed by [@jumpcutking/console~parseStackTrace()](https://github.com/jumpcutking/console/blob/main/docs/index.js.md#module_@jumpcutking/console..parseStackTrace).

It should be noted that in rare instances the stack trace may be a string.

```javascript
var response = {
  stack: [
    {
      call: 'Object.handler',
      file: '~/threads/tests/thread.js',
      line: 93,
      column: 11
    },
    {
      call: 'handleMessage',
      file: '~/threads/src/thread.js',
      line: 369,
      column: 47
    },
    {
      call: 'Socket.<anonymous>',
      file: '~/threads/src/thread.js',
      line: 118,
      column: 13
    },
    { call: 'Socket.emit', file: 'node:events', line: 527, column: 28 },
    {
      call: 'addChunk',
      file: 'node:internal/streams/readable',
      line: 324,
      column: 12
    },
    {
      call: 'readableAddChunk',
      file: 'node:internal/streams/readable',
      line: 297,
      column: 9
    },
    {
      call: 'Readable.push',
      file: 'node:internal/streams/readable',
      line: 234,
      column: 10
    },
    {
      call: 'Pipe.onStreamRead',
      file: 'node:internal/stream_base_commons',
      line: 190,
      column: 23
    }
  ],
  message: 'Test Error',
  '$': {
    promise: { id: 'mythread.awaitResponse.*.1696394052537' },
    actionId: 'mythread.awaitResponse',
    id: 'promise.reject',
    threadId: 'test.thread.123'
  }
}
```

## Promise Execution Timeout

Promises are assigned a default timeout of 30 seconds. When you request an awaitResponse, you can provide a timeout in seconds. If the promise is not resolved within the timeout, the promise will be rejected with the following error object.

```javascript
var reject = {
  stack: [
    'Error: Promise timed out after the allowed 30 seconds.',
    {
      call: 'Timeout._onTimeout',
      file: '~/threads/src/threads.js',
      line: 629,
      column: 24
    },
    {
      call: 'listOnTimeout',
      file: 'node:internal/timers',
      line: 564,
      column: 17
    },
    {
      call: 'process.processTimers',
      file: 'node:internal/timers',
      line: 507,
      column: 7
    }
  ],
  message: 'Promise timed out after the allowed 30 seconds.',
  '$': {
    id: 'promise.reject',
    promise: { id: 'mythread.awaitResponse.*.1696400282676' },
    actionId: 'mythread.awaitResponse',
    threadId: '*'
  }
}
```

## Uncaught Promise and Other Exceptions

In the event an exception occurs that can not be caught (as some promises tend to do), the thread manager will report the exception to the console. It will not through an error. You can use the GetLastException() function to retrieve the last uncaught exception that was thrown.

## A Deferred Promise Becomes Detached

When an action "times out" it only resolves the promise of the action in the thread manager side. The action in the thread will continue to run. This is to prevent the thread from being locked up by a promise that never resolves.

When a thread attempts to resolve a promise that is no longer registered, you'll get a ondata.promise.error.noPromiseFound message to the console. You can also attach a listener to the thread manager to handle this event using .on("noPromiseFound", callback). The returned message from the thread will be contianed in the result .objects.message property.

```javascript
test.thread.123:onData.promise.error.noPromiseFound The promise is no longer registered, it may have timed out. {
  thread: 'test.thread.123',
  action: 'onData.promise.error.noPromiseFound',
  message: 'The promise is no longer registered, it may have timed out.',
  objects: {
    thread: {
      id: 'test.thread.123',
      local: './thread.js',
      options: {
        spawn: { command: 'node', args: [ '--trace-warnings' ] },
        onStartup: [AsyncFunction: StartTest]
      }
    },
    message: {
      message: 'Hello universe!',
      '$': {
        promise: { id: 'mythread.awaitResponse.*.1696400922622' },
        actionId: 'mythread.awaitResponse',
        id: 'promise.resolve',
        threadId: 'test.thread.123'
      }
    }
  },
  '$': { threadId: 'test.thread.123' }
}
```

# Tests
I've created a thread manager test that showcases all of the features. To run it, call it in a terminal.

```Shell
npm test
```