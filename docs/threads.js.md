# threads.js
<a name="module_@jumpcutking/threads/src/threads"></a>

## @jumpcutking/threads/src/threads
Thread manager for spawned node processes.

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.

**Auther**: @jumpcutking  

* [@jumpcutking/threads/src/threads](#module_@jumpcutking/threads/src/threads)
    * _static_
        * [.threads](#module_@jumpcutking/threads/src/threads.threads)
        * [.actions](#module_@jumpcutking/threads/src/threads.actions)
    * _inner_
        * [~util](#module_@jumpcutking/threads/src/threads..util)
        * [~jckConsole](#module_@jumpcutking/threads/src/threads..jckConsole)
        * [~colorOf](#module_@jumpcutking/threads/src/threads..colorOf)
        * [~defferedPrimise](#module_@jumpcutking/threads/src/threads..defferedPrimise)
        * [~options](#module_@jumpcutking/threads/src/threads..options)
        * [~spzArr](#module_@jumpcutking/threads/src/threads..spzArr)
        * [~my](#module_@jumpcutking/threads/src/threads..my)
        * [~init(id, _options)](#module_@jumpcutking/threads/src/threads..init)
        * [~FindThread(id)](#module_@jumpcutking/threads/src/threads..FindThread) ⇒ <code>\*</code>
        * ~~[~addRequestsListener(listener)](#module_@jumpcutking/threads/src/threads..addRequestsListener)~~
        * ~~[~addReceivedListener(listener)](#module_@jumpcutking/threads/src/threads..addReceivedListener)~~
        * [~on(type, listener)](#module_@jumpcutking/threads/src/threads..on)
        * [~add(id, local, options)](#module_@jumpcutking/threads/src/threads..add) ⇒ <code>boolean</code>
            * [~thread](#module_@jumpcutking/threads/src/threads..add..thread)
                * [.send(data)](#module_@jumpcutking/threads/src/threads..add..thread.send)
        * [~addAction(id, handler)](#module_@jumpcutking/threads/src/threads..addAction) ⇒ <code>Boolean</code>
        * [~removeActionAt(id, index)](#module_@jumpcutking/threads/src/threads..removeActionAt)
        * [~list()](#module_@jumpcutking/threads/src/threads..list) ⇒ <code>Object</code>
        * [~generateSafeError(err)](#module_@jumpcutking/threads/src/threads..generateSafeError)
        * [~AsyncRequest(actionID, message, threadID, timeout)](#module_@jumpcutking/threads/src/threads..AsyncRequest) ⇒ <code>Promise</code> \| <code>object</code>
        * [~Send(actionID, message, threadID, shallThrow)](#module_@jumpcutking/threads/src/threads..Send)
        * ~~[~SendMessageToRequestListeners(message)](#module_@jumpcutking/threads/src/threads..SendMessageToRequestListeners)~~
        * ~~[~SendMessageToReceivedListeners(message)](#module_@jumpcutking/threads/src/threads..SendMessageToReceivedListeners)~~
        * [~fire(type, message)](#module_@jumpcutking/threads/src/threads..fire)
        * [~handleMessage(thread, message)](#module_@jumpcutking/threads/src/threads..handleMessage)
        * [~detialsOfThread(thread)](#module_@jumpcutking/threads/src/threads..detialsOfThread) ⇒ <code>Object</code>
        * [~receivedLog(message)](#module_@jumpcutking/threads/src/threads..receivedLog)
        * [~sharePrettyLog(msg)](#module_@jumpcutking/threads/src/threads..sharePrettyLog)
        * [~SimpleLog(message, object)](#module_@jumpcutking/threads/src/threads..SimpleLog)
        * [~close(id)](#module_@jumpcutking/threads/src/threads..close)
        * [~kill(id)](#module_@jumpcutking/threads/src/threads..kill)
        * [~GetLastUncaughtException()](#module_@jumpcutking/threads/src/threads..GetLastUncaughtException) ⇒ <code>object</code>

<a name="module_@jumpcutking/threads/src/threads.threads"></a>

### @jumpcutking/threads/src/threads.threads
The registered threads by ID.

**Kind**: static property of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
<a name="module_@jumpcutking/threads/src/threads.actions"></a>

### @jumpcutking/threads/src/threads.actions
The registered actions that will be performed on the mian thread by ID.

**Kind**: static property of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
<a name="module_@jumpcutking/threads/src/threads..util"></a>

### @jumpcutking/threads/src/threads~util
Using util to deep dive into objects.

**Kind**: inner property of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
<a name="module_@jumpcutking/threads/src/threads..jckConsole"></a>

### @jumpcutking/threads/src/threads~jckConsole
To facilitate logging stacktraces.

**Kind**: inner property of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
<a name="module_@jumpcutking/threads/src/threads..colorOf"></a>

### @jumpcutking/threads/src/threads~colorOf
Using colors to colorize console output.

**Kind**: inner property of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**See**: [https://www.npmjs.com/package/colors](https://www.npmjs.com/package/colors) For more information.  
<a name="module_@jumpcutking/threads/src/threads..defferedPrimise"></a>

### @jumpcutking/threads/src/threads~defferedPrimise
Connects to deffered promises.

**Kind**: inner property of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
<a name="module_@jumpcutking/threads/src/threads..options"></a>

### @jumpcutking/threads/src/threads~options
Options for the thread manager.

**Kind**: inner property of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id for the thread manager. |
| verbose | <code>boolean</code> | Whether to output verbose logs. |
| closeID | <code>string</code> | The id to close the thread. |
| logging | <code>boolean</code> | Whether to output any logs from console.log from the child thread. Logging must be enabled at the child thread. |

<a name="module_@jumpcutking/threads/src/threads..spzArr"></a>

### @jumpcutking/threads/src/threads~spzArr
A special wrapper for simple accounting of threads and actions.

**Kind**: inner property of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
<a name="module_@jumpcutking/threads/src/threads..my"></a>

### @jumpcutking/threads/src/threads~my
Internal object for the thread manager.

**Kind**: inner property of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| threads | <code>spzArr</code> | The registered threads by ID. |
| actions | <code>spzArr</code> | The registered actions that will be performed on the mian thread by ID. |
| listener | <code>Object</code> | The listener objects. |
| listener.requests | <code>Array</code> | The listener functions for requests. |
| listener.received | <code>Array</code> | The listener functions for received messages. |
| listener.noPromiseFound | <code>Array</code> | The listener functions for no promise found. |
| listener.uncaught | <code>Array</code> | The listener functions for uncaught exceptions. |

<a name="module_@jumpcutking/threads/src/threads..init"></a>

### @jumpcutking/threads/src/threads~init(id, _options)
Create and initialize a thread manager.
Warning: This thread manager is designed for one manager per application. 
         Threads attach to the same manager. Only call this once!

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Throws**:

- <code>Error</code> If the thread manager has already been initialized.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> | <code>&quot;threads&quot;</code> | The id of the thread manager. |
| _options | <code>\*</code> |  | The options to set up the thread manager with. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| _options.verbose | <code>boolean</code> | Whether to output verbose logs. |
| _options.closeID | <code>string</code> | The id to close the thread. |
| _options.logging | <code>boolean</code> | Whether to output any logs from console.log from the child thread. Logging must be enabled at the child thread. |
| _options.reportStderr | <code>boolean</code> | Will errors from the process error channel be reported directly? Disable this to prevent duplicate error messages (exceptions, and console.warn|error will parrot to the thread manager on stderr resulting in duplicate messages). |
| _options.showFrom | <code>boolean</code> | This will show where a console log was orignally logged from - works on threads. |

<a name="module_@jumpcutking/threads/src/threads..FindThread"></a>

### @jumpcutking/threads/src/threads~FindThread(id) ⇒ <code>\*</code>
Finds a thread by its id.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Returns**: <code>\*</code> - The thread object.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The id of the thread to find. |

<a name="module_@jumpcutking/threads/src/threads..addRequestsListener"></a>

### ~~@jumpcutking/threads/src/threads~addRequestsListener(listener)~~
***Deprecated***

Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>\*</code> | The event/callback to fire. |

<a name="module_@jumpcutking/threads/src/threads..addReceivedListener"></a>

### ~~@jumpcutking/threads/src/threads~addReceivedListener(listener)~~
***Deprecated***

Adds a listener to the thread manager, which will listen to all event requests sent by the thread manager.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>\*</code> | The event/callback to fire. |

<a name="module_@jumpcutking/threads/src/threads..on"></a>

### @jumpcutking/threads/src/threads~on(type, listener)
Adds an event listener to the thread manager.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of listener to add. - requests: The listener will be called when a request is sent to the thread manager. - received: The listener will be called when a message is received from the thread manager. - noPromiseFound: The listener will be called when a promise is not found. - uncaught: The listener will be called when an uncaught exception is thrown. |
| listener | <code>\*</code> | The event/callback to fire. |

<a name="module_@jumpcutking/threads/src/threads..add"></a>

### @jumpcutking/threads/src/threads~add(id, local, options) ⇒ <code>boolean</code>
Adds a thead to the manager.
Messages sent from the child thread that are not formatted correctly can be read by attaching an onData handler.
The thread manager will create the following default actions
 - thread.startup The thread has started up and is ready to receive messages.
 - thread.close The thread is closing.
 - promise.resolve The promise has been resolved.
 - promise.reject The promise has been rejected.
Options:     All options are optional.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Returns**: <code>boolean</code> - True if the thread was added or false if the thread had an issue.  
**Throws**:

- <code>Error</code> If the thread manager has not been initialized.
- <code>Error</code> If the thread id is not unique.
- <code>Error</code> If the thread could not be added.


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | the id of the thread. Must be unique. |
| local | <code>\*</code> | the script to spawn |
| options | <code>\*</code> | the options for the thread. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| options.onData | <code>function</code> | The function to call when data is received from the thread. |
| options.onError | <code>function</code> | The function to call when an error is received from the thread. |
| options.onExit | <code>function</code> | The function to call when the thread exits. |
| options.onSend | <code>function</code> | The function to call when a message is sent to the thread. |
| options.onStartup | <code>function</code> | The function to call when the thread starts up. |
| options.disableActions | <code>boolean</code> | Whether to disable actions for the thread. |
| options.spawn | <code>Object</code> | The options for spawning the thread. |
| options.spawn.command | <code>string</code> | The command to spawn the thread with. Default: node, but can be any command. |
| options.spawn.args | <code>string</code> \| <code>array</code> | The arguments to pass to the command. The local script is always the first argument. |


* [~add(id, local, options)](#module_@jumpcutking/threads/src/threads..add) ⇒ <code>boolean</code>
    * [~thread](#module_@jumpcutking/threads/src/threads..add..thread)
        * [.send(data)](#module_@jumpcutking/threads/src/threads..add..thread.send)

<a name="module_@jumpcutking/threads/src/threads..add..thread"></a>

#### add~thread
The default thread object.

**Kind**: inner property of [<code>add</code>](#module_@jumpcutking/threads/src/threads..add)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the thread. |
| local | <code>\*</code> | The script to spawn. |
| options | <code>\*</code> | The options for the thread. |
| process | <code>\*</code> | The process object. |
| send | <code>\*</code> | The send function. |
| buffer | <code>string</code> | The buffer for the thread. |

<a name="module_@jumpcutking/threads/src/threads..add..thread.send"></a>

##### thread.send(data)
Add's a thread specific send event.

**Kind**: static method of [<code>thread</code>](#module_@jumpcutking/threads/src/threads..add..thread)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | The data to send to the thread. |

<a name="module_@jumpcutking/threads/src/threads..addAction"></a>

### @jumpcutking/threads/src/threads~addAction(id, handler) ⇒ <code>Boolean</code>
Adds an action to the thread manager.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Returns**: <code>Boolean</code> - True if the action was added, false if it was not.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the action. |
| handler | <code>\*</code> | The function to call when the action is requested. |

<a name="module_@jumpcutking/threads/src/threads..removeActionAt"></a>

### @jumpcutking/threads/src/threads~removeActionAt(id, index)
Removes an action from the thread manager.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The id of the action to remove. |
| index | <code>\*</code> | The index of the action to remove. |

<a name="module_@jumpcutking/threads/src/threads..list"></a>

### @jumpcutking/threads/src/threads~list() ⇒ <code>Object</code>
List all the threads and listerners.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Returns**: <code>Object</code> - {threads: [], listerners: []}  
<a name="module_@jumpcutking/threads/src/threads..generateSafeError"></a>

### @jumpcutking/threads/src/threads~generateSafeError(err)
Generates a safe and passable error message.
Moved to @jumpcutking/console

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>\*</code> | The error to generate a safe error message for. |

<a name="module_@jumpcutking/threads/src/threads..AsyncRequest"></a>

### @jumpcutking/threads/src/threads~AsyncRequest(actionID, message, threadID, timeout) ⇒ <code>Promise</code> \| <code>object</code>
Async Awaits for a promise.resolve or promise.reject from a thread.
You can now await forever, by setting the timeout to 0. This IS NOT RECOMMENDED.
This function MUST be called using the new async/await syntax.
A chain will fail without .catch() if the promise is rejected.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Returns**: <code>Promise</code> - The promise object.<code>object</code> - The data returned from the thread.  
**Throws**:

- <code>Error</code> If the promise has been rejected (an error is reported by the thread or the manager) such as a timeout or unregistered function.

**See**: [module:@jumpcutking/threads/thread/handleMessage](module:@jumpcutking/threads/thread/handleMessage) For more information on the returned obejects.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| actionID | <code>\*</code> |  | The id of the action to be called. |
| message | <code>\*</code> |  | The message to be sent. The message global $. Will have a .primise object added |
| threadID | <code>\*</code> |  | The id of the thread to send the message to. If id is blank, the message will be sent to all threads. |
| timeout | <code>\*</code> | <code>30</code> | The number of seconds to wait for a response before timing out. 0 will disable the timeout - await forever and ever. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message.$ | <code>pbject</code> | FUNCITON PROVIDED. The global message object. |
| message.$.id | <code>string</code> | FUNCITON PROVIDED. The id of the action to be called. |
| message.$.promise.id | <code>string</code> | FUNCITON PROVIDED. The id of the promise. |
| message.$.promise.resolve | <code>object</code> | FUNCITON PROVIDED. The thread will generate a resolve function that can be called manually. Also note, promises auto resolve. |
| message.$.promise.reject | <code>object</code> | FUNCITON PROVIDED. The thread will generate a reject function that can be called manually. Also note, promises auto reject on exception or issue. |
| Promise.Reject.return | <code>object</code> | Typically the promise, when rejected, will return an Error json object, but it can be any data. |
| Promise.Reject.return.stack | <code>object</code> | If an error was thrown, the stack will be provided. |
| Promise.Reject.return.message | <code>object</code> | If an error was thrown, the message will be provided. |
| Promise.Reject.return.$ | <code>object</code> | The global object, a copy of the object the function will provide including a promise object. |
| Promise.Resolve.return | <code>object</code> | Typically the promise, when resolved, will return the data requested. |
| Promise.Resolve.return.$ | <code>object</code> | The global object, a copy of the object the function will provide including a promise object. |
| Promise.Resolve.return.$.on | <code>object</code> | The timestamp information of the thread promise |
| Promise.Resolve.return.$.on.started | <code>number</code> | The timestamp of when the promise was started. |
| Promise.Resolve.return.$.on.ended | <code>number</code> | The timestamp of when the promise was ended. |
| Promise.Resolve.return.$.on.elapsed | <code>number</code> | The number of milliseconds the promise took to complete. |
| $.id | <code>object</code> | The id of the action. promise.resolve or promise.reject |
| $.promise | <code>object</code> | The promise object. |
| $.promise.id | <code>object</code> | The id of the promise. |

<a name="module_@jumpcutking/threads/src/threads..Send"></a>

### @jumpcutking/threads/src/threads~Send(actionID, message, threadID, shallThrow)
Send message to a thread.
If threadID is not provided, the message will be sent to all threads.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| actionID | <code>\*</code> |  | The id of the action to be called. |
| message | <code>\*</code> |  | The message to be sent. The message will have the global action ID added to it. |
| threadID | <code>\*</code> |  | The id of the thread to send the message to. If id is blank, the message will be sent to all threads. |
| shallThrow | <code>\*</code> | <code>false</code> | Whether to throw an error if the thread is not found. (used in AsyncRequest(s)) |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message.$.id | <code>string</code> | The id of the action to be called. |
| message.$.promise.id | <code>string</code> | The id of the promise. (When a promise exists); |

<a name="module_@jumpcutking/threads/src/threads..SendMessageToRequestListeners"></a>

### ~~@jumpcutking/threads/src/threads~SendMessageToRequestListeners(message)~~
***Deprecated***

Sends the request message that is about to be sent to all threads to any request listeners.
They should be async or functions. 
All errors will be caught and logged.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Throws**:

- <code>Error</code> If the listener type is not supported.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The standard message object. $.id is the action id. |

<a name="module_@jumpcutking/threads/src/threads..SendMessageToReceivedListeners"></a>

### ~~@jumpcutking/threads/src/threads~SendMessageToReceivedListeners(message)~~
***Deprecated***

Sends a mesage to all listener functions aded to my.listener.received - they should be async or functions.
All errors will be caught and logged.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Throws**:

- <code>Error</code> If the listener type is not supported.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The standard message object. $.id is the action id. if $.id = thread.id + "process.exit" - a process has exited. |

<a name="module_@jumpcutking/threads/src/threads..fire"></a>

### @jumpcutking/threads/src/threads~fire(type, message)
Fires an event to the attached listeners.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Throws**:

- <code>Error</code> If the listener type is not supported.


| Param | Type | Description |
| --- | --- | --- |
| type | <code>\*</code> | The type of listener to fire. - requests: The listener will be called when a request is sent to the thread manager. - received: The listener will be called when a message is received from the thread manager. - noPromiseFound: The listener will be called when a promise is not found. - uncaught: The listener will be called when an uncaught exception is thrown. |
| message | <code>\*</code> | The message object to send to the listener. |

<a name="module_@jumpcutking/threads/src/threads..handleMessage"></a>

### @jumpcutking/threads/src/threads~handleMessage(thread, message)
Handles messages received from the child thread.
All thread level errors are reported using ReceivedLog(). 
In the future, they should probably be thrown to enable better error handling.
However, they would be unhandled and uncaught errors and may crash the main process.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| thread | <code>\*</code> | The thread object that the message was received from. |
| message | <code>\*</code> | The data received from the thread. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message.$.id | <code>string</code> | The id of the action to be called. Here are a list of id's that have been reserved:  - thread.startup The thread has started up and is ready to receive messages.  - thread.close The thread is closing.  - promise.resolve The promise has been resolved.  - promise.reject The promise has been rejected. |
| message.$.promise.id | <code>string</code> | The id of the promise. (When a promise exists it will resolce to a promise.resolve or promise.reject) |

<a name="module_@jumpcutking/threads/src/threads..detialsOfThread"></a>

### @jumpcutking/threads/src/threads~detialsOfThread(thread) ⇒ <code>Object</code>
Get's the details of a thread. (safe)

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Returns**: <code>Object</code> - A clone of the thread obect without the process.  

| Param | Type | Description |
| --- | --- | --- |
| thread | <code>\*</code> | The thread itself. |

<a name="module_@jumpcutking/threads/src/threads..receivedLog"></a>

### @jumpcutking/threads/src/threads~receivedLog(message)
Reports messages from child threads using console.log to the console.
{logging:true} must be enabled for both the child and parent thread.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**See**: [https://github.com/jumpcutking/console](https://github.com/jumpcutking/console) for more information.  

| Param | Type |
| --- | --- |
| message | <code>\*</code> | 

<a name="module_@jumpcutking/threads/src/threads..sharePrettyLog"></a>

### @jumpcutking/threads/src/threads~sharePrettyLog(msg)
Shares a Pretty Log message from the child thread.
To activiate use init(,{logging: true}) on the child thread and the parent thread.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>\*</code> | The message object containing the console.f(...args) from the child. |

<a name="module_@jumpcutking/threads/src/threads..SimpleLog"></a>

### @jumpcutking/threads/src/threads~SimpleLog(message, object)
A simple log function that can be turned on and off.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The message to log. |
| object | <code>\*</code> | The object to report if possible. |

<a name="module_@jumpcutking/threads/src/threads..close"></a>

### @jumpcutking/threads/src/threads~close(id)
Requesta thread to close "thread.close" action on a thread by it's ID.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The ID of the thread. |

<a name="module_@jumpcutking/threads/src/threads..kill"></a>

### @jumpcutking/threads/src/threads~kill(id)
Force quit (kill) a thread by it's ID.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The ID of the thread. |

<a name="module_@jumpcutking/threads/src/threads..GetLastUncaughtException"></a>

### @jumpcutking/threads/src/threads~GetLastUncaughtException() ⇒ <code>object</code>
Get the last uncaught exception.
Promises that reject may not report properly, therefore, this function is provided.

**Kind**: inner method of [<code>@jumpcutking/threads/src/threads</code>](#module_@jumpcutking/threads/src/threads)  
**Returns**: <code>object</code> - The last uncaught exception.  

