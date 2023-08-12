const { EventEmitter } = require('events');
const Echo = require('../index.js');

const eventEmitter = new EventEmitter();
eventEmitter.on('echo-event', echoMsg => console.log('EVT::', echoMsg));

const echo = new Echo(true, 10, eventEmitter);
// echo.short = false;

const f1 = async () => {
  const err = new Error('First intentional error !');
  await echo.error(err);
};
f1();


const f2 = async () => {
  const err = 'Some error message';
  await echo.error(err);
};
f2();
