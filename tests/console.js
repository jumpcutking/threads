console.log("Normal Console");
var csz = require("../src/console.js");
var count = 0;
csz.init((type, args, log) => {
    //console.log("Overide Console", type, args);
    count += 1;
    log(`${count}`, args);
});
console.log("Overide Console");
console.log("Count", count);
console.log("Count", count);
console.log("Count", count);