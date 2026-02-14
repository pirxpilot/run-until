import test from 'node:test';
import runUntil from '../lib/run-until.js';

test('should run a single task', (t, done) => {
  function task(params, fn) {
    setTimeout(() => {
      fn(null, params.v);
    }, 1);
  }

  runUntil([task], { v: 5 }, (err, v) => {
    t.assert.ifError(err);
    t.assert.equal(v, 5);
    done();
  });
});

test('should runs all tasks until the first one', (t, done) => {
  let seq = '';

  function task(opts, params, fn) {
    seq += opts.s;
    t.assert.equal(params.x, 5);
    setTimeout(() => {
      fn(opts.error, opts.v);
    }, 1);
  }

  runUntil(
    [
      task.bind(null, { s: 'a' }),
      task.bind(null, { s: 'b', error: 'not OK' }),
      task.bind(null, { s: 'c', error: 'not OK', v: 2 }),
      task.bind(null, { s: 'd', v: 3 }),
      task.bind(null, { s: 'e', v: 4 })
    ],
    { x: 5 },
    (err, v) => {
      t.assert.ifError(err);
      t.assert.equal(seq, 'abcd');
      t.assert.equal(v, 3);
      done();
    }
  );
});

test('should run all tasks if none returns any value', (t, done) => {
  let seq = '';

  function task(s, _params, fn) {
    seq += s;
    setTimeout(fn, 1);
  }

  runUntil([task.bind(null, 'a'), task.bind(null, 'b'), task.bind(null, 'c')], {}, (err, v) => {
    t.assert.ifError(err);
    t.assert.equal(seq, 'abc');
    t.assert.equal(v, undefined);
    done();
  });
});
