# @mikosoft/echo
> 📢 A **Node.js logging library** that prints richly formatted, time-stamped messages to the **console** and simultaneously broadcasts them via an **Event Emitter**.

This dual-logging approach makes it ideal for applications that need both standard console output and an external stream of log events for monitoring or IPC (Inter-Process Communication).

The standard message object emitted on the event emitter has the format:
```javascript
{
  msg: string|object,
  method: 'log'|'warn'|'error'|'objekt'|'image'|'question',
  time: string // ISO 8601 timestamp, e.g., '2025-11-11T09:26:01.000Z'
}
````

-----

## 💾 Installation

```bash
$ npm install --save @mikosoft/echo
```

-----

## 💡 Example

This example demonstrates how to set up the `Echo` class with an `EventEmitter` listener and how to use the basic logging and the interactive `question` method.

```js
/*** NodeJS script ***/
const { EventEmitter } = require('events');
const Echo = require('@mikosoft/echo');

// 1. Setup the Event Emitter
const eventEmitter = new EventEmitter();

// Listen for all emitted messages
eventEmitter.on('echo-event', echoMsg => {
  console.log('EVT::', echoMsg.method.toUpperCase(), '->', echoMsg.msg);
});

// A function to answer questions
const answerer = async () => {
    // Wait a moment before answering
    await new Promise(r => setTimeout(r, 500)); 
    
    // Simulate receiving a user's answer ('yes')
    eventEmitter.emit('echo-answer', 'Are you sure you want to continue? (yes/no)', 'yes');
};

const f1 = async () => {
  // Pass the EventEmitter and set a 10ms delay between logs
  const echo = new Echo(true, 10, eventEmitter, 5000); // 5s timeout for questions

  // Basic logging
  await echo.log('Hello, Echo!', 'This is a test with number:', 123, { a: 22 }, true);
  await echo.warn('Caution:', 'The following object might be large.');
  await echo.objekt({ name: 'DEX8', version: 1.0, short: true, settings: { delay: 10 } });

  // Error logging
  await echo.error(new Error('A critical internal error occurred!'));

  // --- Interactive Question ---
  // Start the answering process in the background
  answerer(); 
  
  try {
    const answer = await echo.question('Are you sure you want to continue? (yes/no)');
    await echo.log('✅ Received answer:', answer);
  } catch (err) {
    await echo.error(`❌ Question timed out: ${err.message}`);
  }
};

f1().catch(console.error);
```

-----

## ⚙️ API Reference

### `constructor(short = true, delay = 100, eventEmitter, answerTimeout = 30000)`

Initializes the Echo instance with configuration parameters.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`short`** | `boolean` | `true` | If `true`, prints a **brief, formatted message** to the console. If `false`, prints the **full `echoMsg` object** (prettified JSON) to the console. |
| **`delay`** | `number` | `100` | The delay in milliseconds to pause between two consecutive async `echo` calls. Useful for preventing log overload in tight loops. |
| **`eventEmitter`** | `EventEmitter` | `undefined` | A Node.js `EventEmitter` instance used to broadcast logs via the `'echo-event'` and receive answers via the `'echo-answer'` events. |
| **`answerTimeout`** | `number` | `30000` | The timeout in milliseconds for the `question()` method to wait for a response before throwing an error. |

-----

### Logging Methods

These methods are all `async` and introduce the configured `delay` after execution.

#### `async log(...args:any) :void`

Sends general informational messages. Arguments are converted to strings and joined by a space.

  - **Color:** Bright green (console).
  - **Usage:** `await echo.log('One', 'two', 3, {a: 88})`

#### `async warn(...args:any) :void`

Sends warning messages. Arguments are converted to strings and joined by a space.

  - **Color:** Yellow (console).
  - **Usage:** `await echo.warn('Warning:', 'bad request', 404)`

#### `async error(err:Error|string) :void`

Sends an error. The error is converted to a JS object `{message, stack}` for event emission.

  - **Color:** Bright red (console).
  - **Usage:** `await echo.error(new Error('Scraper error'))`

#### `async objekt(obj:object) :void`

Sends a JavaScript object. The object is printed as a **prettified JSON string** to the console.

  - **Color:** Bright blue (console).
  - **Usage:** `await echo.objekt({a:'str', b:55})`

#### `async image(img_b64:string) :void`

Sends an image represented as a Base64 string.

  - **Color:** Gray (console).
  - **Usage:** `await echo.image('v1w4fnDx9N5fD4t2ft93Y/88IaZLbaPB8+3O1ef+/+jfXqzzf...')`

-----

### Interactive Method

#### `async question(question:string) :Promise<any>`

Sends a question to the console and event emitter, and then **pauses** execution, waiting for a response on the `eventEmitter`.

  - **Mechanism:** Listens for the `'echo-answer'` event. The event listener must emit the event with the original question string as the first argument, and the answer as the second.
  - **Timeout:** If no answer is received within `this.answerTimeout` milliseconds, the promise is rejected, and an error is logged.
  - **Color:** Green (console).
  - **Emission:** The emitted `echoMsg` will have `method: 'question'`.

<!-- end list -->

```javascript
// Ask the question:
const answer = await echo.question('Are you sure? (yes/no)');

// External module must answer like this:
eventEmitter.emit('echo-answer', 'Are you sure? (yes/no)', 'yes');
```

-----

### 📄 License

The software is licensed under [MIT](https://www.google.com/search?q=LICENSE).

```
```
