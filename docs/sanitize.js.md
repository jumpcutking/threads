# sanitize.js
<a name="module_@jumpcutking/threads/src/sanitize"></a>

## @jumpcutking/threads/src/sanitize
Santization helps report common errors with parameters.

This component may not be reversed engineered for hacking or abuse
of The EGT Universe, The Universe, or third-party apps.

Justin K Kazmierczak

May be subject to The Universe Terms of Service.

**Auther**: @jumpcutking  

* [@jumpcutking/threads/src/sanitize](#module_@jumpcutking/threads/src/sanitize)
    * [~report](#module_@jumpcutking/threads/src/sanitize..report)
    * [~s(must, value)](#module_@jumpcutking/threads/src/sanitize..s) ⇒ <code>Boolean</code>
    * [~n(value)](#module_@jumpcutking/threads/src/sanitize..n) ⇒ <code>Boolean</code>
    * [~main(must, value)](#module_@jumpcutking/threads/src/sanitize..main) ⇒ <code>Boolean</code>
    * [~l(value, _trim)](#module_@jumpcutking/threads/src/sanitize..l) ⇒ <code>Boolean</code>

<a name="module_@jumpcutking/threads/src/sanitize..report"></a>

### @jumpcutking/threads/src/sanitize~report
Whether to report errors.
It's like verbose mode... it's not needed here.

**Kind**: inner property of [<code>@jumpcutking/threads/src/sanitize</code>](#module_@jumpcutking/threads/src/sanitize)  
<a name="module_@jumpcutking/threads/src/sanitize..s"></a>

### @jumpcutking/threads/src/sanitize~s(must, value) ⇒ <code>Boolean</code>
Validates that a value is of specified type.
You may also test for an array

**Kind**: inner method of [<code>@jumpcutking/threads/src/sanitize</code>](#module_@jumpcutking/threads/src/sanitize)  
**Returns**: <code>Boolean</code> - Returns the result of the test.  

| Param | Type | Description |
| --- | --- | --- |
| must | <code>\*</code> | The value type to test for. (TypeOf) |
| value | <code>\*</code> | The value to test. |

<a name="module_@jumpcutking/threads/src/sanitize..n"></a>

### @jumpcutking/threads/src/sanitize~n(value) ⇒ <code>Boolean</code>
Verifies an object is not null and undefined.

**Kind**: inner method of [<code>@jumpcutking/threads/src/sanitize</code>](#module_@jumpcutking/threads/src/sanitize)  
**Returns**: <code>Boolean</code> - Returns the result of the test.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to test. |

<a name="module_@jumpcutking/threads/src/sanitize..main"></a>

### @jumpcutking/threads/src/sanitize~main(must, value) ⇒ <code>Boolean</code>
Validates a value based on the typeof suppied.
Performs a "not null|undefined" test.

**Kind**: inner method of [<code>@jumpcutking/threads/src/sanitize</code>](#module_@jumpcutking/threads/src/sanitize)  
**Returns**: <code>Boolean</code> - Returns the result of the test.  

| Param | Type | Description |
| --- | --- | --- |
| must | <code>\*</code> | The value type to test for. (TypeOf) |
| value | <code>\*</code> | The value to test. |

<a name="module_@jumpcutking/threads/src/sanitize..l"></a>

### @jumpcutking/threads/src/sanitize~l(value, _trim) ⇒ <code>Boolean</code>
**Kind**: inner method of [<code>@jumpcutking/threads/src/sanitize</code>](#module_@jumpcutking/threads/src/sanitize)  
**Returns**: <code>Boolean</code> - Returns the updated value.  
**Throws**:

- <code>Error</code> Throws an error if the value is not a string.
Validates a value to a string, and conforms it to lowercase, and trims.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | the value to test |
| _trim | <code>\*</code> | <code>true</code> | whether to trim the string |


