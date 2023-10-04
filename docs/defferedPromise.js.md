# defferedPromise.js
<a name="module_@jumpcutking/threads/src/defferedPromise"></a>

## @jumpcutking/threads/src/defferedPromise
Thread manager for spawned node processes.

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.

**Auther**: @jumpcutking  

* [@jumpcutking/threads/src/defferedPromise](#module_@jumpcutking/threads/src/defferedPromise)
    * [~CreateDeferredPromise()](#module_@jumpcutking/threads/src/defferedPromise..CreateDeferredPromise) ⇒ <code>object</code>
    * [~Test()](#module_@jumpcutking/threads/src/defferedPromise..Test)

<a name="module_@jumpcutking/threads/src/defferedPromise..CreateDeferredPromise"></a>

### @jumpcutking/threads/src/defferedPromise~CreateDeferredPromise() ⇒ <code>object</code>
Returns a promise that can be resolved outside of the scope of the promise.

**Kind**: inner method of [<code>@jumpcutking/threads/src/defferedPromise</code>](#module_@jumpcutking/threads/src/defferedPromise)  
**Returns**: <code>object</code> - A Deferred Promise.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| promise | <code>Promise</code> | The promise. |
| resolve | <code>function</code> | The resolve function. Call this function on success. |
| reject | <code>function</code> | The reject function. Call this function on error. |

<a name="module_@jumpcutking/threads/src/defferedPromise..Test"></a>

### @jumpcutking/threads/src/defferedPromise~Test()
Tests the deferred promise.
(await) Testing the order events

**Kind**: inner method of [<code>@jumpcutking/threads/src/defferedPromise</code>](#module_@jumpcutking/threads/src/defferedPromise)  

