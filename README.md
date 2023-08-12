# @mikosoft/echo
> Print nice messages to console and push it via event emitter.

The echo message has object format:
```
{
  msg: string|object,
  method: 'log'|'objekt'|'error'|'image',
  time: string
}
```


## Installation
```bash
$ npm install --save @mikosoft/echo
```


## Example

```js
/*** NodeJS script ***/
const { EventEmitter } = require('events');
const Echo = require('@mikosoft/echo');

const eventEmitter = new EventEmitter();
eventEmitter.on('echo-event', echoMsg => console.log('EVT::', echoMsg));

const echo = new Echo(true, 10, eventEmitter);
// echo.short = false;

const f1 = async () => {
  await echo.log('One', 'two', 3, { a: 22 }, true);
};

f1().catch(console.log);
```



## API

#### constructor(short = true, delay = 100, eventEmitter)
- short - print long or short message
- delay - delay between two consecutive echoes (useful in loops)
- eventEmitter - external event emitter


#### log(...args:any) :void
Send comma separated strings to console log and event emitter.
Use multiple parameters like in console.log, for example: *await echo.log('one', 'two', 12, {a: 88})*
Bright green color.

#### warn(...args:any) :void
Send comma separated warnings to console log and event emitter.
Use multiple parameters like in console.log, for example: *await echo.warn('Warning:', 'bad request', 404)*
Bright yellow color.

#### error(err:Error|string) :void
Send error to console log and event emitter. The error is converted to JS object *{message, stack}*.
The *err* parameter can be string (error message) or error object.
Usage: *await echo.error(new Error('Scraper error'))*
Bright red color.

#### objekt(obj:object) :void
Convert object to nice fomatted string and send it to console log and event emitter.
Usage: *await echo.objekt({a:'str', b:55})*
Bright blue color.

#### image(img_b64:string) :void
Send image in the base64 format to console log and event emitter.
Usage: *await echo.image('v1w4fnDx9N5fD4t2ft93Y/88IaZLbaPB8+3O1ef+/+jfXqzzf...')*
Gray color.




### License
The software licensed under [MIT](LICENSE).
