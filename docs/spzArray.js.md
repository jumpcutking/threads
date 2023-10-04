# spzArray.js
<a name="module_@jumpcutking/threads/src/spzArray"></a>

## @jumpcutking/threads/src/spzArray
Enables objects to be regestered to an array.

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.


* [@jumpcutking/threads/src/spzArray](#module_@jumpcutking/threads/src/spzArray)
    * [~options](#module_@jumpcutking/threads/src/spzArray..options)
    * [~create(id)](#module_@jumpcutking/threads/src/spzArray..create) ⇒ <code>Object</code>
    * [~list()](#module_@jumpcutking/threads/src/spzArray..list) ⇒ <code>Array</code>
    * [~search(id)](#module_@jumpcutking/threads/src/spzArray..search) ⇒ <code>Boolean</code>
    * [~remove(id)](#module_@jumpcutking/threads/src/spzArray..remove) ⇒ <code>Boolean</code>
    * [~removeAt(id, indexOf)](#module_@jumpcutking/threads/src/spzArray..removeAt)
    * [~NormalizeID(id)](#module_@jumpcutking/threads/src/spzArray..NormalizeID) ⇒ <code>String</code>
    * [~add(item, allowMultiple)](#module_@jumpcutking/threads/src/spzArray..add) ⇒ <code>Number</code>
    * [~SimpleLog(message, object)](#module_@jumpcutking/threads/src/spzArray..SimpleLog)

<a name="module_@jumpcutking/threads/src/spzArray..options"></a>

### @jumpcutking/threads/src/spzArray~options
The options that you can set in the module.
verbose: whether to log verbose messages, default: false

**Kind**: inner property of [<code>@jumpcutking/threads/src/spzArray</code>](#module_@jumpcutking/threads/src/spzArray)  
<a name="module_@jumpcutking/threads/src/spzArray..create"></a>

### @jumpcutking/threads/src/spzArray~create(id) ⇒ <code>Object</code>
Creates a registry that has events (registry.events) it may call.
It will call validation before adding (and checking namespace);
It will call onAdd after adding a new item.

**Kind**: inner method of [<code>@jumpcutking/threads/src/spzArray</code>](#module_@jumpcutking/threads/src/spzArray)  
**Returns**: <code>Object</code> - A registry.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> | <code>registry</code> | The id of the registry. |

<a name="module_@jumpcutking/threads/src/spzArray..list"></a>

### @jumpcutking/threads/src/spzArray~list() ⇒ <code>Array</code>
Return all the id's as an array that are currently in the registry.

**Kind**: inner method of [<code>@jumpcutking/threads/src/spzArray</code>](#module_@jumpcutking/threads/src/spzArray)  
**Returns**: <code>Array</code> - A list of all id's in the registry.  
<a name="module_@jumpcutking/threads/src/spzArray..search"></a>

### @jumpcutking/threads/src/spzArray~search(id) ⇒ <code>Boolean</code>
Searches for an item in the current registry by it's id.

**Kind**: inner method of [<code>@jumpcutking/threads/src/spzArray</code>](#module_@jumpcutking/threads/src/spzArray)  
**Returns**: <code>Boolean</code> - the item or false  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The id of the item to search for. |

<a name="module_@jumpcutking/threads/src/spzArray..remove"></a>

### @jumpcutking/threads/src/spzArray~remove(id) ⇒ <code>Boolean</code>
Removes the entire item from the registry (and all sub items).

**Kind**: inner method of [<code>@jumpcutking/threads/src/spzArray</code>](#module_@jumpcutking/threads/src/spzArray)  
**Returns**: <code>Boolean</code> - the item or false  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="module_@jumpcutking/threads/src/spzArray..removeAt"></a>

### @jumpcutking/threads/src/spzArray~removeAt(id, indexOf)
Removes an item from the registry, at the specific index.
If we have removed the last item in the array, we will remove the entire item.
If the index is not found, you will receive an exception.

**Kind**: inner method of [<code>@jumpcutking/threads/src/spzArray</code>](#module_@jumpcutking/threads/src/spzArray)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | The id of the items. |
| indexOf | <code>\*</code> | the index of the individual item to remove. |

<a name="module_@jumpcutking/threads/src/spzArray..NormalizeID"></a>

### @jumpcutking/threads/src/spzArray~NormalizeID(id) ⇒ <code>String</code>
It is recommended to trim ids. You could also lowercase for easy acessing/searching.

**Kind**: inner method of [<code>@jumpcutking/threads/src/spzArray</code>](#module_@jumpcutking/threads/src/spzArray)  
**Returns**: <code>String</code> - the normalized id  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The id to normalize. |

<a name="module_@jumpcutking/threads/src/spzArray..add"></a>

### @jumpcutking/threads/src/spzArray~add(item, allowMultiple) ⇒ <code>Number</code>
**Kind**: inner method of [<code>@jumpcutking/threads/src/spzArray</code>](#module_@jumpcutking/threads/src/spzArray)  
**Returns**: <code>Number</code> - The index of the item in the registry. NO LONGER Returns True. Use this to remove a listerner at a later time.  
**Throws**:

- <code>Error</code> If the object to add to the registry is not valid. (No ID as String).
Adds an item with an id to the registry.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>\*</code> |  | The item to add to the registry. |
| allowMultiple | <code>Boolean</code> | <code>false</code> | Whether to allow multiple items with the same id. |

<a name="module_@jumpcutking/threads/src/spzArray..SimpleLog"></a>

### @jumpcutking/threads/src/spzArray~SimpleLog(message, object)
A simple log function that can be turned on and off.

**Kind**: inner method of [<code>@jumpcutking/threads/src/spzArray</code>](#module_@jumpcutking/threads/src/spzArray)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>\*</code> | The message to log. |
| object | <code>\*</code> | The object to report if possible. |


