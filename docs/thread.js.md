# thread.js
<a name="module_@jumpcutking/threads/src/thread"></a>

## @jumpcutking/threads/src/thread
Thread module for the child process.

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.

**Auther**: @jumpcutking  

* [@jumpcutking/threads/src/thread](#module_@jumpcutking/threads/src/thread)
    * [~jckConsole](#module_@jumpcutking/threads/src/thread..jckConsole)
    * [~options](#module_@jumpcutking/threads/src/thread..options)
    * [~buffer](#module_@jumpcutking/threads/src/thread..buffer)
    * [~init(_options)](#module_@jumpcutking/threads/src/thread..init)
    * [~Startup(data)](#module_@jumpcutking/threads/src/thread..Startup)
    * [~Close()](#module_@jumpcutking/threads/src/thread..Close)
    * [~handleMessage(message)](#module_@jumpcutking/threads/src/thread..handleMessage) ⇒ <code>object</code>
    * [~generateSafeError(err)](#module_@jumpcutking/threads/src/thread..generateSafeError)
    * [~request(id, message)](#module_@jumpcutking/threads/src/thread..request)
    * [~addAction(id, handler)](#module_@jumpcutking/threads/src/thread..addAction)
    * [~log(action, message, objects)](#module_@jumpcutking/threads/src/thread..log)
    * [~log_verbose(action, message, objects)](#module_@jumpcutking/threads/src/thread..log_verbose)
    * [~list()](#module_@jumpcutking/threads/src/thread..list) ⇒ <code>Object</code>
    * [~removeAt(id, index)](#module_@jumpcutking/threads/src/thread..removeAt)
    * [~sleep(ms)](#module_@jumpcutking/threads/src/thread..sleep) ⇒ <code>Promise</code>

<a name="module_@jumpcutking/threads/src/thread..jckConsole"></a>

### @jumpcutking/threads/src/thread~jckConsole
The @jumpcutking/console contrustor, for creating and working with the console.

**Kind**: inner property of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  
**See**: https://www.github.com/jumpcutking/console  
<a name="module_@jumpcutking/threads/src/thread..options"></a>

### @jumpcutking/threads/src/thread~options
The options that you can set in the module.
id: the name of the thread
verbose: whether to log verbose messages
closeAction: the action to fire when the thread is closed
debug: if activated, no messages will be sent to the thread manager.
keepAlive: the thread will stay active awaiting further requests until closed.
logging: if true, the thread will log messages to the thread manager. It will also overide console.
quitOnException: if true, the thread will quit when an exception is thrown.

**Kind**: inner property of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  
<a name="module_@jumpcutking/threads/src/thread..buffer"></a>

### @jumpcutking/threads/src/thread~buffer
The buffer for incoming data.

**Kind**: inner property of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  
<a name="module_@jumpcutking/threads/src/thread..init"></a>

### @jumpcutking/threads/src/thread~init(_options)
Set up the child thread.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  

| Param | Type | Description |
| --- | --- | --- |
| _options | <code>Object</code> | The options to set up the thread with. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The name of the thread. |
| verbose | <code>boolean</code> | Whether to log verbose messages. |
| closeAction | <code>string</code> | The action to fire when the thread is closed. |
| debug | <code>boolean</code> | If activated, no messages will be sent to the thread manager. |
| keepAlive | <code>boolean</code> | The thread will stay active awaiting further requests until closed. |
| logging | <code>boolean</code> | If true, the thread will log messages to the thread manager. It will also overide console. |
| quitOnException | <code>boolean</code> | If true, the thread will quit when an exception is thrown. |
| console | <code>object</code> | The jckConsole options. @see [module:@jumpcutking/console~startup](module:@jumpcutking/console~startup) for details. |

<a name="module_@jumpcutking/threads/src/thread..Startup"></a>

### @jumpcutking/threads/src/thread~Startup(data)
Get's information about the thread from the thread manager.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | The object sent from the thread manager. Including the threadID (.threadId). |

<a name="module_@jumpcutking/threads/src/thread..Close"></a>

### @jumpcutking/threads/src/thread~Close()
Closes the thread gracefully.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  
<a name="module_@jumpcutking/threads/src/thread..handleMessage"></a>

### @jumpcutking/threads/src/thread~handleMessage(message) ⇒ <code>object</code>
Handles a message object from the Thread Manager.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  
**Returns**: <code>object</code> - {resolve, reject} The resolve and reject functions for the promise.  
**See**: [module:@jumpcutking/console~parseStackTrace](module:@jumpcutking/console~parseStackTrace) for complete details  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The message object from the thread manager. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| message.$ | <code>object</code> | The global object for the message. |
| message.$.id | <code>string</code> | The id of the message. |
| message.$.promise | <code>object</code> | The promise object. (If it's a promise.) |
| resolve | <code>object</code> | When a message is resolved, this object will be passed to the thread manager. |
| resolve.$ | <code>object</code> | The global object for the message. |
| resolve.$.id | <code>string</code> | The id of the message. "promise.resolve" |
| resolve.$.promise | <code>object</code> | The promise object. |
| resolve.$.actionId | <code>string</code> | The id of the action that was resolved. |
| resolve.$.threadId | <code>object</code> | The id of the thread that resolved the promise. |
| reject | <code>object</code> | When a message is rejected, this object will be passed to the thread manager. |
| reject.$ | <code>object</code> | The global object for the message. |
| reject.$.id | <code>string</code> | The id of the message. "promise.reject" |
| reject.$.promise | <code>object</code> | The promise object. |
| reject.$.actionId | <code>string</code> | The id of the action that was rejected. |
| reject.$.threadId | <code>object</code> | The id of the thread that rejected the promise. |
| reject.stack | <code>object</code> | The stack trace of the error. (if an error object was passed in) Uses module: @jumpcutking/console~stacktrace object. |
| reject.message | <code>object</code> | The message of the error. (if an error object was passed in) |

<a name="module_@jumpcutking/threads/src/thread..generateSafeError"></a>

### @jumpcutking/threads/src/thread~generateSafeError(err)
Generates a safe and passable error message

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>\*</code> | The error to generate a safe error message for. |

<a name="module_@jumpcutking/threads/src/thread..request"></a>

### @jumpcutking/threads/src/thread~request(id, message)
Request a message from the parent process.
Any non-object or array will be wrapped in a data property. Message.data

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the action to request. |
| message | <code>\*</code> | The data to send to the parent process. Will defualt to an empty object. |

<a name="module_@jumpcutking/threads/src/thread..addAction"></a>

### @jumpcutking/threads/src/thread~addAction(id, handler)
Adds a new action to the thread.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The id of the action to listen for from the parent process. |
| handler | <code>\*</code> | The function to call when the action is requested. |

<a name="module_@jumpcutking/threads/src/thread..log"></a>

### @jumpcutking/threads/src/thread~log(action, message, objects)
Report a log entry to the parent thread. Use for debugging.
     Consider this your replacement for console.log.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>\*</code> | The action that occurred. |
| message | <code>\*</code> | The human readable message of the event. |
| objects | <code>\*</code> | Any optional objects to send with the log entry. |

<a name="module_@jumpcutking/threads/src/thread..log_verbose"></a>

### @jumpcutking/threads/src/thread~log\_verbose(action, message, objects)
The thread object will output log messages if verbose is turned on.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>\*</code> | The ID of the actiom. |
| message | <code>\*</code> | The message to report. |
| objects | <code>\*</code> | The objects associated with the log entry. |

<a name="module_@jumpcutking/threads/src/thread..list"></a>

### @jumpcutking/threads/src/thread~list() ⇒ <code>Object</code>
List all the threads and listerners.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  
**Returns**: <code>Object</code> - {threads: [], listerners: []}  
<a name="module_@jumpcutking/threads/src/thread..removeAt"></a>

### @jumpcutking/threads/src/thread~removeAt(id, index)
Removes an action from the thread.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The id of the action to remove. |
| index | <code>\*</code> | The index of the action to remove. |

<a name="module_@jumpcutking/threads/src/thread..sleep"></a>

### @jumpcutking/threads/src/thread~sleep(ms) ⇒ <code>Promise</code>
A async/await version of setTimeout.

**Kind**: inner method of [<code>@jumpcutking/threads/src/thread</code>](#module_@jumpcutking/threads/src/thread)  
**Returns**: <code>Promise</code> - A promise that will resolve after the specified number of milliseconds.  

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>\*</code> | The number of milliseconds to wait. |


