# threads
Threads is a multiple-thread management tool handling a pool of threads and communication between all connected threads for node.js. Threads is a powerful solution to going beyond web workers. Threads share the same modules and have access to the same scripts but don't require forked processes. Threads also communicate through encoded JSON.

Originally built as part of The Universe App Tools, I've released the source to help the community solve the node threading problem: supporting Node.JS function with multiple process threads and communicating between all processes. 

## What's New
Beginning with version 1.1.2, I've introduced listeners. They act like events dispatching attached functions similar to other modules. Identical to how actions are attached, you can create a portion of your code to listen to all events requested (send to children) by adding a requests listener (addRequestsListener). You can do the same thing with received requests (from the children) (addReceivedListener).

## Warning
It's a different approach than worker threads; it's designed for a sophisticated app like a socket server or an electron app. Unfortunately, as of now, it can't be used in a browser.

## License
The license is close to MIT, with a few important modifications. Check the license file for more information. It may be subject to The Universe Terms of Service. https://egtuniverse.com/legal/terms

# Thread Manager
The thread manager is a short module designed to enable messages to be sent or received from both the threads and the main process (running the thread manager.) It's a unique and helpful messaging system that can be expanded. For example, sending a message by its ID to all threads or a specific thread is simple.

## Install
Hopefully, you will be able to install the node module using NPM.

    npm install @jumpcutking/threads --save

## Getting Started
The thread manager uses an init function to prevent creating objects in memory until they are needed. Also, if you encounter any issues - you can turn on verbose mode. It's on by default at this early stage, so feel free to turn it off - or you'll get flooded with messages.

    var { threads } = require("@jumpcutking/threads");
    
    //Turn off verbose mode - or you'll get flooded with messages
    threads.SetVerbose(false);
    
    //initialize the threads manager
    //choose an ID that will be easy to remember as you watch the logs
    threads.init(`my.threads`);

## Adding a thread to the manager
Threads are spawned based on the location of the current script. Supply only a node file for this thread. Other process types have not been tested; with some modification, they might work as well.

    //add a thread thread.add("test.thread","./thread.js", {
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

## Actions
Actions are activated on any message sent from the thread to its children, and the children use the object of their own action (per child) to handle requests from the thread manager. Unregistered actions will report issues to the console.

Actions aren't limited to promises but the way they are called; they can be both async/await promises (chains may not work) and normal event-halting functions.

    //Add an action to the thread
    threads.addAction("parent-count", async (data) => {
        console.log(`Parent thread count: ${data.count}`, data);
    });

## Check the Manager
You can quickly output all the registered processes and actions to check the manager.

    console.log("The Thread Manager: ", threads.list());

## Messages and Requests
Message objects are sent to threads, and children are handled internally. However, suppose you're trying to add support for threads in your application and spawn a different kind of process (which you can't do natively yet) or perhaps integrate with other parts of your program. In that case, you'll need to know how messages are formatted.

Message's objects will always have a meta object. Each request will override this object, but received messages will not be overridden and are expected to send messages in the following format.

    {
        $:{
            id: "myactionid"
        },
        (...)
    }

Your actions will be spawned based on the id of the action.

## Attach listeners
You can now attach functions to be fired as events. They are referred to in code as listeners.

Identical to how actions are attached, you can create a portion of your code to listen to all events requested (send to children) by adding a requests listener (addRequestsListener). You can do the same thing with received requests (from the children) (addReceivedListener).

    sync function ListenForRequests(message) {
      //I've received a message from the thread manager.
      console.log("Listener Got a Request", message);
    };
    
    async function ListenForMessages(message) {
      //I've received a message from the thread manager.
      console.log("Listener Got a Message (children)", message);
    };
    
    //attach the listenerts to to the thread manager
    //Requests are made from the main thread to other children
    threads.addRequestsListener(ListenForRequests);
    
    //Received messages are sent from the children to the thread manager
    threads.addReceivedListener(ListenForMessages);
    
    // Another way you could write this.
    // threads.addReceivedListener((message) => {
    //   //I've received a message from the thread manager.
    //   console.log("Listener Got a Message (children)", message);
    // });


# Children Threads
The thread manager comes with a child thread management object. This will receive messages from the parent object, run actions, and send requests to the parent.

An example thread is included below and can also be found in tests/thread.js

    //import the module
    var { thread } = require("@jumpcutking/threads");

    //init the thread
    thread.init("mythread");
    thread.SetVerbose(false);

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

    //close after 3 seconds
    setTimeout(() => {
        console.log("Closing thread.");
        process.exit(0);
    }, 20000);


## Keep a Child Alive
For a Node.js Process (a thread) to not close before you have sent it a message or request, you'll need to use a simple hack.

    setInterval(() => {}, 1000);

# Tests
I've created a thread manager test that showcases all of the features. To run it, call it in a terminal.

    cd tests
    node threads.js