# console.js
Used to replace Node's build in console, with one we can attach
a listerner to. This enables children to send messages to the
parent thread using console.log's known syntax.

During debug mode, a child thread will report to the console
as normal otherwise the console on the child thread will be
silenced.

Justin K Kazmierczak

## Members

<dl>
<dt><a href="#Console">Console</a></dt>
<dd><p>The console contrustor, for creating and working with the console.</p>
</dd>
<dt><a href="#myConsole">myConsole</a></dt>
<dd><p>A child thread&#39;s new console object, used to log messages to the console.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#zconsole">zconsole()</a> ⇒ <code>Object</code></dt>
<dd></dd>
<dt><a href="#logDelegate">logDelegate(type, args, logger)</a></dt>
<dd><p>Sets up the overiding log function.</p>
</dd>
<dt><a href="#init">init(_logDelegate)</a></dt>
<dd><p>Initializes the console to report to the parent thread.</p>
<p>During debug mode, a child thread will report to the console
as normal otherwise the console on the child thread will be
silenced.</p>
</dd>
</dl>

<a name="Console"></a>

## Console
The console contrustor, for creating and working with the console.

**Kind**: global variable  
<a name="myConsole"></a>

## myConsole
A child thread's new console object, used to log messages to the console.

**Kind**: global variable  
<a name="zconsole"></a>

## zconsole() ⇒ <code>Object</code>
**Kind**: global function  
**Returns**: <code>Object</code> - The new console object.  
**Jumpcutking/threads**: - Child Console Object
This replaces the normal node:console object for easy reporting to the 
managing parent thread.  
<a name="logDelegate"></a>

## logDelegate(type, args, logger)
Sets up the overiding log function.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>\*</code> |  |
| args | <code>\*</code> |  |
| logger | <code>\*</code> | If you'd like the output to go to the console, use this function. Modify args as needed. |

<a name="init"></a>

## init(_logDelegate)
Initializes the console to report to the parent thread.

During debug mode, a child thread will report to the console
as normal otherwise the console on the child thread will be
silenced.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| _logDelegate | <code>\*</code> | The function to call when a log is made. The thread creates one and passes it here. |


# sanitize.js
Santization helps report common errors with parameters.

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.

## Members

<dl>
<dt><a href="#report">report</a></dt>
<dd><p>Whether to report errors.
It&#39;s like verbose mode... it&#39;s not needed here.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#s">s(must, value)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Validates that a value is of specified type.
You may also test for an array</p>
</dd>
<dt><a href="#n">n(value)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verifies an object is not null and undefined.</p>
</dd>
<dt><a href="#main">main(must, value)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Validates a value based on the typeof suppied.
Performs a &quot;not null|undefined&quot; test.</p>
</dd>
<dt><a href="#l">l(value, _trim)</a> ⇒ <code>Boolean</code></dt>
<dd></dd>
</dl>

<a name="report"></a>

## report
Whether to report errors.
It's like verbose mode... it's not needed here.

**Kind**: global variable  
<a name="s"></a>

## s(must, value) ⇒ <code>Boolean</code>
Validates that a value is of specified type.
You may also test for an array

**Kind**: global function  
**Returns**: <code>Boolean</code> - Returns the result of the test.  

| Param | Type | Description |
| --- | --- | --- |
| must | <code>\*</code> | The value type to test for. (TypeOf) |
| value | <code>\*</code> | The value to test. |

<a name="n"></a>

## n(value) ⇒ <code>Boolean</code>
Verifies an object is not null and undefined.

**Kind**: global function  
**Returns**: <code>Boolean</code> - Returns the result of the test.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to test. |

<a name="main"></a>

## main(must, value) ⇒ <code>Boolean</code>
Validates a value based on the typeof suppied.
Performs a "not null|undefined" test.

**Kind**: global function  
**Returns**: <code>Boolean</code> - Returns the result of the test.  

| Param | Type | Description |
| --- | --- | --- |
| must | <code>\*</code> | The value type to test for. (TypeOf) |
| value | <code>\*</code> | The value to test. |

<a name="l"></a>

## l(value, _trim) ⇒ <code>Boolean</code>
**Kind**: global function  
**Returns**: <code>Boolean</code> - Returns the updated value.  
**Throws**:

- <code>Error</code> Throws an error if the value is not a string.
Validates a value to a string, and conforms it to lowercase, and trims.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | the value to test |
| _trim | <code>\*</code> | <code>true</code> | whether to trim the string |


# spzArray.js
Enables objects to be regestered to an array.

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.

## Members

<dl>
<dt><a href="#options">options</a></dt>
<dd><p>The options that you can set in the module.
verbose: whether to log verbose messages, default: false</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#create">create(id)</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a registry that has events (registry.events) it may call.
It will call validation before adding (and checking namespace);
It will call onAdd after adding a new item.</p>
</dd>
<dt><a href="#list">list()</a> ⇒ <code>Array</code></dt>
<dd><p>Return all the id&#39;s as an array that are currently in the registry.</p>
</dd>
<dt><a href="#search">search(id)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Searches for an item in the current registry by it&#39;s id.</p>
</dd>
<dt><a href="#remove">remove(id)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Removes the entire item from the registry (and all sub items).</p>
</dd>
<dt><a href="#removeAt">removeAt(id, indexOf)</a></dt>
<dd><p>Removes an item from the registry, at the specific index.
If we have removed the last item in the array, we will remove the entire item.
If the index is not found, you will receive an exception.</p>
</dd>
<dt><a href="#NormalizeID">NormalizeID(id)</a> ⇒ <code>String</code></dt>
<dd><p>It is recommended to trim ids. You could also lowercase for easy acessing/searching.</p>
</dd>
<dt><a href="#add">add(item, allowMultiple)</a> ⇒ <code>Number</code></dt>
<dd></dd>
<dt><a href="#SimpleLog">SimpleLog(message, object)</a></dt>
<dd><p>A simple log function that can be turned on and off.</p>
</dd>
</dl>

<a name="options"></a>

## options
The options that you can set in the module.
verbose: whether to log verbose messages, default: false

**Kind**: global variable  
<a name="create"></a>

## create(id) ⇒ <code>Object</code>
Creates a registry that has events (registry.events) it may call.
It will call validation before adding (and checking namespace);
It will call onAdd after adding a new item.

**Kind**: global function  
**Returns**: <code>Object</code> - A registry.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> | <code>registry</code> | The id of the registry. |

<a name="list"></a>

## list() ⇒ <code>Array</code>
Return all the id's as an array that are currently in the registry.

**Kind**: global function  
**Returns**: <code>Array</code> - A list of all id's in the registry.  
<a name="search"></a>

## search(id) ⇒ <code>Boolean</code>
Searches for an item in the current registry by it's id.

**Kind**: global function  
**Returns**: <code>Boolean</code> - the item or false  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The id of the item to search for. |

<a name="remove"></a>

## remove(id) ⇒ <code>Boolean</code>
Removes the entire item from the registry (and all sub items).

**Kind**: global function  
**Returns**: <code>Boolean</code> - the item or false  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="removeAt"></a>

## removeAt(id, indexOf)
Removes an item from the registry, at the specific index.
If we have removed the last item in the array, we will remove the entire item.
If the index is not found, you will receive an exception.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The id of the items. |
| indexOf | <code>\*</code> | the index of the individual item to remove. |

<a name="NormalizeID"></a>

## NormalizeID(id) ⇒ <code>String</code>
It is recommended to trim ids. You could also lowercase for easy acessing/searching.

**Kind**: global function  
**Returns**: <code>String</code> - the normalized id  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The id to normalize. |

<a name="add"></a>

## add(item, allowMultiple) ⇒ <code>Number</code>
**Kind**: global function  
**Returns**: <code>Number</code> - The index of the item in the registry. NO LONGER Returns True. Use this to remove a listerner at a later time.  
**Throws**:

- <code>Error</code> If the object to add to the registry is not valid. (No ID as String).
Adds an item with an id to the registry.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>\*</code> |  | The item to add to the registry. |
| allowMultiple | <code>Boolean</code> | <code>false</code> | Whether to allow multiple items with the same id. |

<a name="SimpleLog"></a>

## SimpleLog(message, object)
A simple log function that can be turned on and off.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The message to log. |
| object | <code>\*</code> | The object to report if possible. |


# thread.js
Thread Manager for children processes

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.

## Members

<dl>
<dt><a href="#options">options</a></dt>
<dd><p>The options that you can set in the module.
id: the name of the thread
verbose: whether to log verbose messages
closeAction: the action to fire when the thread is closed
debug: if activated, no messages will be sent to the thread manager.
keepAlive: the thread will stay active awaiting further requests until closed.
logging: if true, the thread will log messages to the thread manager. It will also overide console.
quitOnException: if true, the thread will quit when an exception is thrown.</p>
</dd>
<dt><a href="#buffer">buffer</a></dt>
<dd><p>The buffer for incoming data.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#init">init(_options)</a></dt>
<dd><p>Set up the child thread.</p>
</dd>
<dt><a href="#Startup">Startup(data)</a></dt>
<dd><p>Get&#39;s information about the thread from the thread manager.</p>
</dd>
<dt><a href="#Close">Close()</a></dt>
<dd><p>Closes the thread gracefully.</p>
</dd>
<dt><a href="#handleMessage">handleMessage(message)</a></dt>
<dd><p>Handles a message object from the Thread Manager.</p>
</dd>
<dt><a href="#request">request(id, message)</a></dt>
<dd><p>Request a message from the parent process.</p>
</dd>
<dt><a href="#addAction">addAction(id, handler)</a></dt>
<dd><p>Adds a new action to the thread.</p>
</dd>
<dt><a href="#log">log(action, message, objects)</a></dt>
<dd><p>Report a log entry to the parent thread. Use for debugging.
     Consider this your replacement for console.log.</p>
</dd>
<dt><a href="#log_verbose">log_verbose(action, message, objects)</a></dt>
<dd><p>The thread object will output log messages if verbose is turned on.</p>
</dd>
<dt><a href="#list">list()</a> ⇒ <code>Object</code></dt>
<dd><p>List all the threads and listerners.</p>
</dd>
<dt><a href="#removeAt">removeAt(id, index)</a></dt>
<dd><p>Removes an action from the thread.</p>
</dd>
</dl>

<a name="options"></a>

## options
The options that you can set in the module.
id: the name of the thread
verbose: whether to log verbose messages
closeAction: the action to fire when the thread is closed
debug: if activated, no messages will be sent to the thread manager.
keepAlive: the thread will stay active awaiting further requests until closed.
logging: if true, the thread will log messages to the thread manager. It will also overide console.
quitOnException: if true, the thread will quit when an exception is thrown.

**Kind**: global variable  
<a name="buffer"></a>

## buffer
The buffer for incoming data.

**Kind**: global variable  
<a name="init"></a>

## init(_options)
Set up the child thread.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| _options | <code>Object</code> | The options to set up the thread with. - id: the name of the thread - verbose: whether to log verbose messages - closeAction: the action to fire when the thread is closed - debug: if activated, no messages will be sent to the thread manager. - keepAlive: the thread will stay active awaiting further requests until closed. - logging: if true, the thread will log messages to the thread manager. It will also overide console. - quitOnException: if true, the thread will quit when an exception is thrown. |

<a name="Startup"></a>

## Startup(data)
Get's information about the thread from the thread manager.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | The object sent from the thread manager. Including the threadID (.threadId). |

<a name="Close"></a>

## Close()
Closes the thread gracefully.

**Kind**: global function  
<a name="handleMessage"></a>

## handleMessage(message)
Handles a message object from the Thread Manager.

**Kind**: global function  

| Param | Type |
| --- | --- |
| message | <code>\*</code> | 

<a name="request"></a>

## request(id, message)
Request a message from the parent process.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the action to request. |
| message | <code>\*</code> | The data to send to the parent process. Will defualt to an empty object. |

<a name="addAction"></a>

## addAction(id, handler)
Adds a new action to the thread.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the action to listen for from the parent process. |
| handler | <code>\*</code> | The function to call when the action is requested. |

<a name="log"></a>

## log(action, message, objects)
Report a log entry to the parent thread. Use for debugging.
     Consider this your replacement for console.log.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>\*</code> | The action that occurred. |
| message | <code>\*</code> | The human readable message of the event. |
| objects | <code>\*</code> | Any optional objects to send with the log entry. |

<a name="log_verbose"></a>

## log\_verbose(action, message, objects)
The thread object will output log messages if verbose is turned on.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>\*</code> | The ID of the actiom. |
| message | <code>\*</code> | The message to report. |
| objects | <code>\*</code> | The objects associated with the log entry. |

<a name="list"></a>

## list() ⇒ <code>Object</code>
List all the threads and listerners.

**Kind**: global function  
**Returns**: <code>Object</code> - {threads: [], listerners: []}  
<a name="removeAt"></a>

## removeAt(id, index)
Removes an action from the thread.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The id of the action to remove. |
| index | <code>\*</code> | The index of the action to remove. |


# threads.js
Thread manager for spawned node processes.

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.

## Members

<dl>
<dt><a href="#options">options</a></dt>
<dd><p>Options for the thread manager.</p>
<ul>
<li>id: The id for the thread manager.</li>
<li>verbose: Whether to output verbose logs.</li>
<li>closeID: The id to close the thread.</li>
<li>logging: Whether to output any logs from console.log from the child thread. Logging must be enabled at the child thread.</li>
</ul>
</dd>
<dt><a href="#my">my</a></dt>
<dd><p>Internal object for the thread manager.</p>
</dd>
<dt><a href="#threads">threads</a></dt>
<dd><p>The registered threads by ID.</p>
</dd>
<dt><a href="#actions">actions</a></dt>
<dd><p>The registered actions that will be performed on the mian thread by ID.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#init">init(id, _options)</a></dt>
<dd><p>Create and initialize a thread manager.
Warning: This thread manager is designed for one manager per application. 
         Threads attach to the same manager. Only call this once!</p>
</dd>
<dt><a href="#addRequestsListener">addRequestsListener(listener)</a></dt>
<dd><p>Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.</p>
</dd>
<dt><a href="#addReceivedListener">addReceivedListener(listener)</a></dt>
<dd><p>Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.</p>
</dd>
<dt><a href="#add">add(id, local, options)</a> ⇒ <code>boolean</code></dt>
<dd><p>Adds a thead to the manager.
Messages sent from the child thread that are not formatted correctly can be read by attaching an onData handler.
Options:     All options are optional.
             onData: function(data) { ... }  Return from the thread.
             onError: function(data) { ... } Return from the thread on an error
             onExit: function(code) { ... }  Return from the thread when it exits.
             onSend: function(message) { ... }  Reports what&#39;s being sent to a thread before it is sent.
             disableActions: true|false      Disable the default action handler.
             spawn: {
                 command: &quot;node&quot;,            The command to spawn the thread with. Default: node, but can be any command.
             }</p>
</dd>
<dt><a href="#addAction">addAction(id, handler)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Adds an action to the thread manager.</p>
</dd>
<dt><a href="#removeActionAt">removeActionAt(id, index)</a></dt>
<dd><p>Removes an action from the thread manager.</p>
</dd>
<dt><a href="#list">list()</a> ⇒ <code>Object</code></dt>
<dd><p>List all the threads and listerners.</p>
</dd>
<dt><a href="#Send">Send(actionID, message, threadID)</a></dt>
<dd><p>Send message to a thread.
If threadID is not provided, the message will be sent to all threads.</p>
</dd>
<dt><a href="#SendMessageToRequestListeners">SendMessageToRequestListeners(message)</a></dt>
<dd><p>Sends the request message that is about to be sent to all threads to any request listeners.
They should be async or functions. 
All errors will be caught and logged.</p>
</dd>
<dt><a href="#SendMessageToReceivedListeners">SendMessageToReceivedListeners(message)</a></dt>
<dd><p>Sends a mesage to all listener functions aded to my.listener.received - they should be async or functions.
All errors will be caught and logged.</p>
</dd>
<dt><a href="#handleMessage">handleMessage(thread, message)</a></dt>
<dd><p>Handles messages received from the child thread.</p>
</dd>
<dt><a href="#detialsOfThread">detialsOfThread(thread)</a> ⇒ <code>Object</code></dt>
<dd><p>Get&#39;s the details of a thread. (safe)</p>
</dd>
<dt><a href="#receivedLog">receivedLog(message)</a></dt>
<dd><p>Reports messages from child threads using console.log to the console.
{logging:true} must be enabled for both the child and parent thread.</p>
</dd>
<dt><a href="#sharePrettyLog">sharePrettyLog(msg)</a></dt>
<dd><p>Shares a Pretty Log message from the child thread.
To activiate use init(,{logging: true}) on the child thread and the parent thread.</p>
</dd>
<dt><a href="#SimpleLog">SimpleLog(message, object)</a></dt>
<dd><p>A simple log function that can be turned on and off.</p>
</dd>
<dt><a href="#close">close(id)</a></dt>
<dd><p>Requesta thread to close &quot;thread.close&quot; action on a thread by it&#39;s ID.</p>
</dd>
<dt><a href="#kill">kill(id)</a></dt>
<dd><p>Force quit (kill) a thread by it&#39;s ID.</p>
</dd>
</dl>

<a name="options"></a>

## options
Options for the thread manager.
- id: The id for the thread manager.
- verbose: Whether to output verbose logs.
- closeID: The id to close the thread.
- logging: Whether to output any logs from console.log from the child thread. Logging must be enabled at the child thread.

**Kind**: global variable  
<a name="my"></a>

## my
Internal object for the thread manager.

**Kind**: global variable  
<a name="threads"></a>

## threads
The registered threads by ID.

**Kind**: global variable  
<a name="actions"></a>

## actions
The registered actions that will be performed on the mian thread by ID.

**Kind**: global variable  
<a name="init"></a>

## init(id, _options)
Create and initialize a thread manager.
Warning: This thread manager is designed for one manager per application. 
         Threads attach to the same manager. Only call this once!

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> | <code>&quot;threads&quot;</code> | The id of the thread manager. |
| _options | <code>\*</code> |  | The options to set up the thread manager with.   - id: The id for the thread manager.  - verbose: Whether to output verbose logs.  - closeID: The id to close the thread.  - logging: Whether to output any logs from console.log from the child thread. Logging must be enabled at the child thread. |

<a name="addRequestsListener"></a>

## addRequestsListener(listener)
Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.

**Kind**: global function  

| Param | Type |
| --- | --- |
| listener | <code>\*</code> | 

<a name="addReceivedListener"></a>

## addReceivedListener(listener)
Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.

**Kind**: global function  

| Param | Type |
| --- | --- |
| listener | <code>\*</code> | 

<a name="add"></a>

## add(id, local, options) ⇒ <code>boolean</code>
Adds a thead to the manager.
Messages sent from the child thread that are not formatted correctly can be read by attaching an onData handler.
Options:     All options are optional.
             onData: function(data) { ... }  Return from the thread.
             onError: function(data) { ... } Return from the thread on an error
             onExit: function(code) { ... }  Return from the thread when it exits.
             onSend: function(message) { ... }  Reports what's being sent to a thread before it is sent.
             disableActions: true|false      Disable the default action handler.
             spawn: {
                 command: "node",            The command to spawn the thread with. Default: node, but can be any command.
             }

**Kind**: global function  
**Returns**: <code>boolean</code> - True if the thread was added or false if the thread had an issue.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | the id of the thread. Must be unique. |
| local | <code>\*</code> | the script to spawn |
| options | <code>\*</code> | the options for the thread. |

<a name="addAction"></a>

## addAction(id, handler) ⇒ <code>Boolean</code>
Adds an action to the thread manager.

**Kind**: global function  
**Returns**: <code>Boolean</code> - True if the action was added, false if it was not.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the action. |
| handler | <code>\*</code> | The function to call when the action is requested. |

<a name="removeActionAt"></a>

## removeActionAt(id, index)
Removes an action from the thread manager.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The id of the action to remove. |
| index | <code>\*</code> | The index of the action to remove. |

<a name="list"></a>

## list() ⇒ <code>Object</code>
List all the threads and listerners.

**Kind**: global function  
**Returns**: <code>Object</code> - {threads: [], listerners: []}  
<a name="Send"></a>

## Send(actionID, message, threadID)
Send message to a thread.
If threadID is not provided, the message will be sent to all threads.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| actionID | <code>\*</code> | The id of the action to be called. |
| message | <code>\*</code> | The message to be sent. |
| threadID | <code>\*</code> | The id of the thread to send the message to. If id is blank, the message will be sent to all threads. |

<a name="SendMessageToRequestListeners"></a>

## SendMessageToRequestListeners(message)
Sends the request message that is about to be sent to all threads to any request listeners.
They should be async or functions. 
All errors will be caught and logged.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The standard message object. $.id is the action id. |

<a name="SendMessageToReceivedListeners"></a>

## SendMessageToReceivedListeners(message)
Sends a mesage to all listener functions aded to my.listener.received - they should be async or functions.
All errors will be caught and logged.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The standard message object. $.id is the action id. if $.id = thread.id + "process.exit" - a process has exited. |

<a name="handleMessage"></a>

## handleMessage(thread, message)
Handles messages received from the child thread.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| thread | <code>\*</code> | The thread object that the message was received from. |
| message | <code>\*</code> | The data received from the thread. |

<a name="detialsOfThread"></a>

## detialsOfThread(thread) ⇒ <code>Object</code>
Get's the details of a thread. (safe)

**Kind**: global function  
**Returns**: <code>Object</code> - A clone of the thread obect without the process.  

| Param | Type | Description |
| --- | --- | --- |
| thread | <code>\*</code> | The thread itself. |

<a name="receivedLog"></a>

## receivedLog(message)
Reports messages from child threads using console.log to the console.
{logging:true} must be enabled for both the child and parent thread.

**Kind**: global function  

| Param | Type |
| --- | --- |
| message | <code>\*</code> | 

<a name="sharePrettyLog"></a>

## sharePrettyLog(msg)
Shares a Pretty Log message from the child thread.
To activiate use init(,{logging: true}) on the child thread and the parent thread.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>\*</code> | The message object containing the console.f(...args) from the child. |

<a name="SimpleLog"></a>

## SimpleLog(message, object)
A simple log function that can be turned on and off.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The message to log. |
| object | <code>\*</code> | The object to report if possible. |

<a name="close"></a>

## close(id)
Requesta thread to close "thread.close" action on a thread by it's ID.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The ID of the thread. |

<a name="kill"></a>

## kill(id)
Force quit (kill) a thread by it's ID.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The ID of the thread. |


