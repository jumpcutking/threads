/**
 * Thread manager for spawned node processes.
 * 
 * This component may not be reversed engineered for hacking or abuse
 * of The EGT Universe, The Universe, or third-party apps.
 * 
 * Justin K Kazmierczak
 * 
 * May be subject to The Universe Terms of Service.
 * 
 * @module @jumpcutking/threads/src/defferedPromise
 * @auther @jumpcutking
 */

/**
 * Returns a promise that can be resolved outside of the scope of the promise.
 * @returns {object} A Deferred Promise.
 * @property {Promise} promise The promise.
 * @property {function} resolve The resolve function. Call this function on success.
 * @property {function} reject The reject function. Call this function on error.
 */
function CreateDeferredPromise() {
    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
} module.exports.create = CreateDeferredPromise;

/**
 * Tests the deferred promise.
 * (await) Testing the order events
 */
async function Test() {
    function TestPromise() {
        const deferred = CreateDeferredPromise();
        setTimeout(() => {
            deferred.resolve("Hello World!");
        }, 1000);
        return deferred.promise;
    }

    console.log("Testing Deferred Promise... (await)");
    const result = await TestPromise();
    console.log("Promise (await) Resolved!", result);

    console.log("Testing Deferred Promise... (no await)");
    TestPromise().then((result) => {
        console.log("Promise (no await) Resolved!", result);
    });
    console.log("Promise (no await) Resolving...")

} //Test();