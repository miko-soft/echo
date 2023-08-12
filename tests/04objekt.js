const { EventEmitter } = require('events');
const Echo = require('../index.js');

const eventEmitter = new EventEmitter();
eventEmitter.on('echo-event', echoMsg => console.log('EVT::', echoMsg));

const echo = new Echo(true, 10, eventEmitter);
// echo.short = false;

const f1 = async () => {
  const obj = { a: 'str', b: 55 };
  await echo.objekt(obj);
};


f1();
