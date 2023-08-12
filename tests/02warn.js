const { EventEmitter } = require('events');
const Echo = require('../index.js');

const eventEmitter = new EventEmitter();
eventEmitter.on('echo-event', echoMsg => console.log('EVT::', echoMsg));

const echo = new Echo(true, 10, eventEmitter);
// echo.short = false;

const f1 = async () => {
  await echo.warn('One', 'two', 3, { a: 22 });
};


const f2 = async () => {
  for (let i = 1; i <= 100; i++) {
    await echo.warn(`FOR ${i}`);
  }
};



f1();
f2();
