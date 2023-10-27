# JSON.stringify.overide.js
<a name="@jumpcutking/threads/src/JSON.stringify.module_overide"></a>

## overide
Thread module for the child process.

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.

**Auther**: @jumpcutking  

* [overide](#@jumpcutking/threads/src/JSON.stringify.module_overide)
    * [~JSONstringify(obj)](#@jumpcutking/threads/src/JSON.stringify.module_overide..JSONstringify) ⇒ <code>string</code>
    * [~NoneJsonObj(type)](#@jumpcutking/threads/src/JSON.stringify.module_overide..NoneJsonObj) ⇒ <code>object</code>

<a name="@jumpcutking/threads/src/JSON.stringify.module_overide..JSONstringify"></a>

### overide~JSONstringify(obj) ⇒ <code>string</code>
Converts an object to a JSON string.
Safely reveals promises, functions, and the like through a new NoneJson Object.

**Kind**: inner method of [<code>overide</code>](#@jumpcutking/threads/src/JSON.stringify.module_overide)  
**Returns**: <code>string</code> - The JSON string.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | The object to convert to a JSON string. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| NoneJson.$ | <code>string</code> | Thread's global identifier. It will be set to "nonejson". |
| NoneJson.type | <code>string</code> | The type of object that is not supported by JSON. (promise, function, undefined) |

<a name="@jumpcutking/threads/src/JSON.stringify.module_overide..NoneJsonObj"></a>

### overide~NoneJsonObj(type) ⇒ <code>object</code>
Creates a NoneJson object.

**Kind**: inner method of [<code>overide</code>](#@jumpcutking/threads/src/JSON.stringify.module_overide)  
**Returns**: <code>object</code> - The NoneJson object.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>\*</code> | The type of object that is not supported by JSON. (promise, function, undefined, etc...) |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| NoneJson.$ | <code>string</code> | Thread's global identifier. It will be set to "nonejson". |
| NoneJson.type | <code>string</code> | The type of object that is not supported by JSON. (promise, function, undefined) |


