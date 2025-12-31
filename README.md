# @mikosoft/echo

> 📢 A lightweight **Node.js logging utility** for console output **and** event-based messaging.

`@mikosoft/echo` prints nicely formatted, time-stamped logs to the console and can **emit the same messages through a Node.js `EventEmitter`**.  
It also keeps an **in-memory history of all logs** via `allEchoes`.

---

## ✨ Features

- Colored console logs (log, warn, error, object, question)
- Optional EventEmitter integration
- Async-safe logging with configurable delay
- Interactive `question()` / `answer` flow
- Automatic log history (`allEchoes`)
- Zero dependencies beyond `chalk` and `moment`

---

## 📦 Installation

```bash
npm install --save @mikosoft/echo

```

## 📘 Echo message format

Every log produces a standardized object:

```javascript
{
  who: string,
  msg: string | object,
  method: 'log' | 'warn' | 'error' | 'objekt' | 'image' | 'question',
  time: string // ISO 8601 timestamp
}

```

## 💡 Basic example

```javascript
const Echo = require('@mikosoft/echo');

(async () => {
  const echo = new Echo(true);

  await echo.log('App started');
  await echo.warn('Low memory');
  await echo.objekt({ service: 'DEX8', status: 'running' });
  await echo.error(new Error('Unexpected failure'));

  console.log('\nALL ECHOES:\n', echo.allEchoes);
})();

```

### allEchoes

`echo.allEchoes` stores every emitted message, in order.

Useful for debugging, audits, exporting logs, and testing.

## 🔁 EventEmitter example (with questions)

```javascript
const { EventEmitter } = require('events');
const Echo = require('@mikosoft/echo');

const emitter = new EventEmitter();
const WHO = 'user1';

const echo = new Echo(true, 10, emitter, 5000, WHO);

// listen to all echo events
emitter.on('echo-event', e => {
  console.log('EVT::', e.method, e.msg);
});

// answer the question
setTimeout(() => {
  emitter.emit('echo-answer', WHO, 'Continue? (yes/no)', 'yes');
}, 1000);

(async () => {
  const answer = await echo.question('Continue? (yes/no)');
  await echo.log('Answer received:', answer);
})();

```

## ⚙️ Constructor

```javascript
new Echo(short, delay, eventEmitter, answerTimeout, who)

```

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| **short** | boolean | true | Short console output |
| **delay** | number | 100 | Delay between logs (ms) |
| **eventEmitter** | EventEmitter | undefined | Emits echo-event |
| **answerTimeout** | number | 30000 | Question timeout (ms) |
| **who** | string | '' | Sender identifier |

---

## 🧾 Logging methods

All methods are async.

### log(...args)

General info (green)

```javascript
await echo.log('Hello', 123, { a: 1 });

```

### warn(...args)

Warnings (yellow)

```javascript
await echo.warn('Deprecated API');

```

### error(err)

Errors (red)

```javascript
await echo.error(new Error('Something failed'));

```

### objekt(obj)

Pretty-printed objects (blue)

```javascript
await echo.objekt({ a: 1, b: 2 });

```

### image(base64)

Base64 image passthrough (gray)

```javascript
await echo.image('iVBORw0KGgoAAAANSUhEUgAA...');

```

---

## ❓ Interactive questions

### question(question) : Promise<any>

Pauses execution until answered via EventEmitter.

```javascript
const answer = await echo.question('Are you sure?');

```

Answer must be emitted like this:

```javascript
eventEmitter.emit('echo-answer', who, 'Are you sure?', 'yes');

```

If no answer arrives within `answerTimeout`, the promise rejects.


## 📄 License
MIT

## Author
[Mikosoft](https://www.mikosoft.info)
