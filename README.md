# threads
Threads is a multiple-thread management tool handling a pool of threads and communication between all connected threads for node.js. Threads is a powerful solution to going beyond web workers. Threads share the same modules, have acess to the same scripts, but don't require forked processes. Threads also communicate through encoded JSON.

Orginally built as part of The Universe App Tools and other applications I'm working on, I've decided to release the source to help the community solve the greater problem: helping Node.JS function with sustainable thread management comparable to other environments. It's not perfect but it's a good start. This is server side threads NOT worker-threads. It's a difficult approach, for better or worse.

## License
The license is close to MIT with a few important modifications. Check the license file for more information. May be subjct to The Universe Terms of Service. https://egtuniverse.com/legal/terms

# Thread Manager
The thread manager is a very simple module designed to enabling messages to be sent or recieved from both the threads and the main process (running the thread manager.) It's a unique and helpful messaging system that can be expanded. Sending a message by it's ID to all or specific thread is simple.

## Install
Hopefully, you will be able to install the node module using NPM.

    npm install @jumpcutking/threads --save

## Getting Started
The thread manager uses a init function to prevent creating objects in memory until they are needed. Also, if you encounter any issues - you can turn on verbose mode. It's on by default at this early stage, so feel free to turn it off - or you'll get flodded with messages.

	var { threads } = require("@jumpcutking/threads");
	
	//Turn off verbose mode - or you'll get flodded with messages
	threads.SetVerbose(false);
	
	//intialize the threads manager
	//choose an ID that will be easy to remeber as you watch the logs
	threads.init(`my.threads`);

## Adding a thread to the manager
Threads are spawned based on the location of the current script. Supply only a node file for this thread. Other process types have not been tested, with some modification they might work as well.

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

## Actions
Actions are activated on any message sent from the thread to it's children and the children use their own actions object (per child) to handle requests from the thread manager. Unregistered actions will report issues to the console.

Actions aren't limited to promises but the way they are called they can be both async/await promises (chains may not work) and normal event haulting functions.

	//Add an action to the thread
	threads.addAction("parent-count", async (data) => {
    	console.log(`Parent thread count: ${data.count}`, data);
	});

## Check the Manager
To quickly check the manager, you can output all the registered processes and actions.

	console.log("The Thread Manager: ", threads.list());

# Children Threads
The thread manager comes with a child thread management object. This will receive messages from the parent object, run actions, and send requests to the parent.

An example thread is included below, and can also be found in tests/thread.js

	//import the module
	var { thread } = require("@jumpcutking/threads");

	//init the thread
	thread.init("mythread");
	thread.SetVerbose(false);

	//add the actoin "hello world"
	//These actions don't need to be async, but it's good practice to make them async.
	thread.add("helloworld", async (data) => {

		//send a request to the parent thread
		thread.request("parent-hello", {
			hello: "parent"
		});

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

## Keep a Child Alive
In order for a Node.js Process (a thread) to not close before you have sent it a message or request, you'll need to use a simple hack.

	setInterval(() => {}, 1000);

