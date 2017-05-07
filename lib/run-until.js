module.exports = runUntil;

function runUntil(tasks, params, fn) {

  var abortFn;

  function doTask(task, next) {
    abortFn = task(params, function(err, data) {
      if (!err && data) {
        return fn(null, data);
      }
      next();
    });
  }

  function nextTask(i) {
    doTask(tasks[i], function next() {
      if (++i < tasks.length) {
        return nextTask(i);
      }
      fn();
    });
  }

  nextTask(0);

  return function abort() {
    if (abortFn) { abortFn(); }
  };
}
