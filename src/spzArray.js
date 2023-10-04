/**
 * Enables objects to be regestered to an array.
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 * 
 * @module @jumpcutking/threads/src/spzArray
 **/

//My personal log.
// var log = require("./logger")();
// var objectify = require("../functions/objectify").function;
// const { kStringMaxLength } = require("buffer");
// const { findSourceMap } = require("module");
// const { level_info } = require("./logger");
var santize = require("./sanitize.js"); 

/**
 * The options that you can set in the module.
 * verbose: whether to log verbose messages, default: false
 */
var options = {
  verbose: false
}

 /**
  * Creates a registry that has events (registry.events) it may call.
  * It will call validation before adding (and checking namespace);
  * It will call onAdd after adding a new item.
  * @param {String} id The id of the registry.
  * @returns {Object} A registry.
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
      remove: remove,
      removeAt: removeAt
  };
}

/**
 * Return all the id's as an array that are currently in the registry.
 * @returns {Array} A list of all id's in the registry.
 */
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
 * @returns {Boolean} the item or false
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

    //if the item is undefined get rid of it
    if (typeof this.registry[i] == "undefined") {
      this.registry.splice(i,1);
      continue;
    }

    if ("id" in this.registry[i]) {
      if (this.registry[i].id == id)  {
        return this.registry[i];
      }
    }
  }

  if (!found) {
    SimpleLog(`Could not find id: ${id}.`);
    return false;
  }
}

/**
 * Removes the entire item from the registry (and all sub items).
 * @param {String} id 
 * @returns {Boolean} the item or false
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
      //delete this.registry[i];
      this.registry.splice(i,1);
      return true;
    }
  }

  return false;

}

/**
 * Removes an item from the registry, at the specific index.
 * If we have removed the last item in the array, we will remove the entire item.
 * If the index is not found, you will receive an exception.
 * @param {*} id The id of the items.
 * @param {*} indexOf the index of the individual item to remove.
 */
function removeAt(id, indexOfListener) {

  if (!(santize("string", id))) {
    SimpleLog(`The ID must be a string.`, {
      id: id
    })
    return false;
  }

  id = NormalizeID(id);

  var foundItem = this.search(id, false);
  if (foundItem !== false) {
    //can I add multiple items with the same id?
    if (foundItem.items.length > indexOfListener) {
      //remove the item
      foundItem.items.splice(indexOfListener, 1);

      //if there are no more items, remove the entire item.
      if (foundItem.items.length == 0) {
        this.remove(id);
      }

      return true;
    } else {
      throw new Error("The item's index is not found in the registry.");
    }
  } else {
    throw new Error("The item's id is not found in the registry.");
  }

} //module.exports.removeAt = removeAt;

/**
 * It is recommended to trim ids. You could also lowercase for easy acessing/searching.
 * @param {String} id The id to normalize. 
 * @returns {String} the normalized id
 */
function NormalizeID(id) {
  // console.log("Normalizing ID: " + id);
  return id.trim();
}

/**
 * @throws {Error} If the object to add to the registry is not valid. (No ID as String).
 * Adds an item with an id to the registry.
 * @param {*} item The item to add to the registry.
 * @param {Boolean} allowMultiple Whether to allow multiple items with the same id.
 * @returns {Number} The index of the item in the registry. NO LONGER Returns True. Use this to remove a listerner at a later time.
 */
function add(item, allowMultiple = false) {

  if (!(santize("object", item))) {
    throw new Error("The item must be an object.");
  }

  if (!("id" in item)) {
    throw new Error("The item must have an id.");
  }

  if (!(santize("string", item.id))) {
    throw new Error("The item's id must be a string.");
  }

  //ensure your id matches the search protocols - prevent human error
  item.id = NormalizeID(item.id);

  var foundItem = this.search(item.id, false);
  if (foundItem !== false) {
    //can I add multiple items with the same id?
    if (allowMultiple == false) {
      throw new Error("The item's id already exists in the registry.");
    } else {
      //add the item to the founditem.items
      foundItem.items.push(item);
      return foundItem.items.length - 1;
    }
  } else {
    //I didn't find the item, so I can add it to the array.
    this.registry.push({
      id: item.id,
      items: [item]
    });

    return 0;
    
  }

    SimpleLog(`Added item to registry.`, {
      adding: item
    });

    // return true;


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