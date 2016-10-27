var psTree = require('ps-tree'); // see: http://git.io/jBHZ

/**
 * terminate is an ultra-simple way to kill all the node processes
 * by providing a process.pid. It finds all child processes and shuts
 * them down too, so you don't have to worry about lingering processes.
 * @param {number} pid - the Process ID you want to terminate
 * @param {function} callback (optional) - if you want to know once the
 * procesess have been terminated, supply a callback.
 *   @param {Error} error - will be null if no error occured
 */
module.exports = function terminate(pid, callback) {
  if(!pid) {
    throw new Error("No pid supplied to Terminate!")
  }
  psTree(pid, function (err, children) {
    return module.exports._psTreeCallback(err, children, callback);
  });
};
/**
 * I don't think it's possible to get psTree to error in the test environment,
 * so I made this a separate function so I could mock that situation for testing.
 */
module.exports._psTreeCallback = function _psTreeCallback(err, children, callback) {
  if (err) {
    return callback(err);
  }
  children.forEach(function (child) {
    try {
      process.kill(parseInt(child.PID));
    } catch (error) {
      // ignore
    }
  });
  if (typeof callback === 'function') {
    callback(null);
  } else { // do nothing
    console.log(children.length + " Processes Terminated!");
  }
};
