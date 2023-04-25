/**
 * Enables objects to be regestered to an array.
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 **/
//My personal log.
// var log = require("./logger")();
// var objectify = require("../functions/objectify").function;
// const { kStringMaxLength } = require("buffer");
// const { findSourceMap } = require("module");
// const { level_info } = require("./logger");
var santize = require("./sanitize.js"); 

var options = {
  verbose: false
}

 /**
  * Creates a registry that has events (registry.events) it may call.
  * It will call validation before adding (and checking namespace);
  * It will call onAdd after adding a new item.
  * @returns A registry.
  */
function create(id = "registry") {

  return {
      created: Date.now(),
      id: id,
      registry: [],
      search: search,
      find: search,
      add: add,
      list: list,
      remove: remove
  };
}

function list() {
  var arr = [];
  for (var i = 0; i < this.registry.length; i++) {
    arr.push(this.registry[i].id);
  }
  return arr;
}

/**
 * Searches for an item in the current registry by it's id.
 * @param {String} id The id of the item to search for.
 * @returns the item or false
 */
function search(id) {
  var found = false;

  // console.log("searching for namespace: " + namespace);
  if (!(santize("string", id))) {
    SimpleLog(`The ID must be a string.`, {
      id: id
    })
    return false;
  }
  
  id = NormalizeID(id);

  //search for the id
  for (var i = 0; i < this.registry.length; i++) {
    if (this.registry[i].id == id)  {
      return this.registry[i];
    }
  }

  if (!found) {
    SimpleLog(`Could not find id: ${id}.`);
    return false;
  }
}

/**
 * Removes an item from the registry.
 * @param {String} id 
 * @returns the item or false
 */
function remove(id) {
  var found = false;

  if (!(santize("string", id))) {
    SimpleLog(`The ID must be a string.`, {
      id: id
    })
    return false;
  }

  id = NormalizeID(id);

  //search for ud
  for (var i = 0; i < this.registry.length; i++) {
    if (this.registry[i].id == id)  {
      delete this.registry[i];
      return true;
    }
  }

  return false;

}

/**
 * It is recommended to trim ids. You could also lowercase for easy acessing/searching.
 * @param {*} namespace 
 * @returns 
 */
function NormalizeID(id) {
  return id.trim();
}

/**
 * Adds an item with an id to the registry.
 * @param {*} item 
 */
function add(item) {

  if (!(santize("object", item))) {
    SimpleLog(`The item must be an object.`, {
      adding: item
    })
    return false;
  }

  if (!("id" in item)) {
    SimpleLog(`The item must have an id.`, {
      adding: item
    });
    return false;
  }

  //ensure your id matches the search protocols - prevent human error
  item.id = NormalizeID(item.id);

  if (this.registry.length < 1) {
    //I have no items in my registry, so I'm safe.
  } else {
    if (this.search(item.id,false) !== false) {
      SimpleLog(`The registry already has an object registered by the id ${item.id}.`, {
        adding: item,
        found: this.search(item.id)
      });
      return false;
    }
  }

  this.registry.push(item);

  SimpleLog(`Added item to registry.`, {
    adding: item
  });

  return true;

} module.exports = create;

/**
 * A simple log function that can be turned on and off.
 * @param {*} message The message to log.
 * @param {*} object The object to report if possible.
 */
function SimpleLog(message, object = {}) {
  if (options.verbose) {
      console.log(message, object);
  }
}