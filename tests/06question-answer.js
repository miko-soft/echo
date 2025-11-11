const { EventEmitter } = require('events');
const Echo = require('../index.js');

const eventEmitter = new EventEmitter();
// eventEmitter.on('echo-event', echoMsg => console.log('EVT::', echoMsg));

const echo = new Echo(true, 10, eventEmitter, 5000); // wait 5 seconds for answer
// echo.short = false;

const question = 'Do you want to continue (yes/no)?';


const f1 = async () => {
  const answer = await echo.question(question).catch(err => { });
  if (answer === 'yes') {
    await echo.log('ANSWERED yes: Continuing operation...');
  } else if (answer === 'no') {
    await echo.log(' ANSWERED no: Aborting operation...');
  }
};


const f2 = async () => {
  // send answer
  await new Promise(r => setTimeout(r, 3000)); // ----> increase to 6000 to test timeout <----
  eventEmitter.emit('echo-answer', question, 'yes');

  // this shouldn't work as the question has already been answered
  await new Promise(r => setTimeout(r, 3400));
  eventEmitter.emit('echo-answer', question, 'no');
};


f1();
f2();
