[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# run-until

 Run a sequence of async functions until one of them returns something.

## Install

```sh
$ npm install --save run-until
```

## Usage

```js
import runUntil from 'run-until';

// Define async tasks that run until one returns a value
const tasks = [
  // Task 1: Try to fetch from primary server
  (params, callback) => {
    fetch(`${params.primaryUrl}/data`)
      .then(res => res.json())
      .then(data => callback(null, data)) // Return data to stop execution
      .catch(() => callback()); // Continue to next task on error
  },
  
  // Task 2: Try fallback server
  (params, callback) => {
    fetch(`${params.fallbackUrl}/data`)
      .then(res => res.json())
      .then(data => callback(null, data)) // Stop on success
      .catch(() => callback()); // Continue if fails
  },
  
  // Task 3: Use cached data as last resort
  (params, callback) => {
    callback(null, params.cache); // Always returns a value
  }
];

// Run tasks with parameters
runUntil(
  tasks,
  {
    primaryUrl: 'https://api.example.com',
    fallbackUrl: 'https://backup.example.com',
    cache: { fallback: true }
  },
  (err, result) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Data:', result);
    }
  }
);
```

**How it works:**

- Runs tasks sequentially until one returns a value (via `callback(null, value)`)
- Each task receives `params` and a callback function
- Call `callback()` with no arguments or an error to continue to the next task
- Call `callback(null, value)` to stop execution and return the value
- If no task returns a value, the final callback is called with `undefined`

## License

MIT © [Damian Krzeminski](https://code42day.com)

[npm-image]: https://img.shields.io/npm/v/run-until
[npm-url]: https://npmjs.org/package/run-until

[build-url]: https://github.com/pirxpilot/run-until/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/run-until/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/run-until
[deps-url]: https://libraries.io/npm/run-until
