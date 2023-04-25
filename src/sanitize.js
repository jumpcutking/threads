/**
 * Santization helps report common errors with a parameters.
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 **/

var report = true;

/**
 * Validates that a value is of specified type.
 * You may also test for an array
 * @param {*} must 
 */
function s(must, value) {
    if (must === "array") {
        if (Array.isArray(value)) {
            if (report) {console.log("I am a safe array");}
            return true;
        } else {
            if (report) {console.log("I'm not a safe array");}
            return false;
        }
    } else if (typeof value === must) {
       // console.log(`I'm ${typeof value}`);
        return true;
    } else {
        //console.log(`I'm not ${must} instead I am ${typeof value}`);
        return false;
    }
}

/**
 * Verifies an object is not null and undefined.
 * @param {*} value 
 */
function n(value) {
    
    var okay = false;
    if (typeof value === undefined) {
        if (report) {console.log("my type is compared to undefined");}
    } else if(value == null) {
        if (report) {console.log("I am null")}
    } else {
        okay = true;
    }

    return okay;
}

/**
 * Validates a value based on the typeof suppied.
 * Performs a "not null|undefined" test.
 * @param {*} must 
 * @param {*} value 
 */
function main(must, value) {
    var okay = false;
    okay = n(value); //am I null

    if (okay) {
        okay = s(must, value);
    }

    return okay
}

/**
 * Validates a value to a string, and conforms it to lowercase, and trims
 * @param {*} value 
 */
function l(value, _trim = true) {
    var okay = false;
    okay = main("string", value);

    //console.log("ok is", okay);

    if (okay) {
        //trim item
        if (_trim) {
            return value.trim().toLowerCase();
        } else {
            return value.toLowerCase();
        }

    } else {
        throw new Error("The provided string is invalid.");
    }
}

module.exports = main;
module.exports.s = s;
module.exports.n = n;
module.exports.l = l;
// module.exports.log = TestSantizationWithLogger;