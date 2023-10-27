/**
 * Thread module for the child process.
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 * 
 * @module @jumpcutking/threads/src/JSON.stringify.overide
 * @auther @jumpcutking
 */

/**
 * Converts an object to a JSON string.
 * Safely reveals promises, functions, and the like through a new NoneJson Object.
 * @property {string} NoneJson.$ Thread's global identifier. It will be set to "nonejson".
 * @property {string} NoneJson.type The type of object that is not supported by JSON. (promise, function, undefined)
 * @param {*} obj The object to convert to a JSON string.
 * @returns {string} The JSON string.
 */
function JSONstringify(obj) {
    return JSON.stringify(obj, (key, value) => {
        if (value instanceof Promise) {
          // Handle symbols by converting them to custom objects
          return NoneJsonObj("promise");
        } else if (typeof value === "function") {
          // Handle functions by converting them to custom objects
            return NoneJsonObj("function");
          // next check if it's undefined
        } else if (typeof value === "undefined") {
            // Handle undefined by converting them to custom objects
            return NoneJsonObj("undefined");
        }

        //add other object unsupported types here

        return value;
      }, 4);
} module.exports = JSONstringify;


/**
 * Creates a NoneJson object.
 * @param {*} type The type of object that is not supported by JSON. (promise, function, undefined, etc...)
 * @returns {object} The NoneJson object.
 * @property {string} NoneJson.$ Thread's global identifier. It will be set to "nonejson".
 * @property {string} NoneJson.type The type of object that is not supported by JSON. (promise, function, undefined)
 */
function NoneJsonObj(type) {
    return { "$": "nonejson", "type": type };
}