const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

var runUntil = require('../');

describe('run-until', function () {

  it('should run a single task', function (_, done) {

    function task(params, fn) {
      setTimeout(function() {
        fn(null, params.v);
      }, 1);
    }

    runUntil([ task ], { v: 5 }, function(err, v) {
      assert.equal(v, 5);
      done(err);
    });
  });


  it('should runs all tasks until the first one', function (_, done) {
    var seq = '';

    function task(opts, params, fn) {
      seq += opts.s;
      assert(params.x, 5);
      setTimeout(function() {
        fn(opts.error, opts.v);
      }, 1);
    }

    runUntil([
        task.bind(null, { s: 'a' }),
        task.bind(null, { s: 'b', error: 'not OK' }),
        task.bind(null, { s: 'c', error: 'not OK' , v: 2 }),
        task.bind(null, { s: 'd', v: 3 }),
        task.bind(null, { s: 'e', v: 4 })
      ], { x: 5 }, function(err, v) {
        assert.equal(seq, 'abcd');
        assert.equal(v, 3);
        done(err);
    });
  });

  it('should run all tasks if none returns any value', function (_, done) {
    var seq = '';

    function task(s, params, fn) {
      seq += s;
      setTimeout(fn, 1);
    }

    runUntil([
        task.bind(null, 'a'),
        task.bind(null, 'b'),
        task.bind(null, 'c')
      ], {}, function(err, v) {
        assert.equal(seq, 'abc');
        assert.equal(v, undefined);
        done(err);
    });
  });

});
