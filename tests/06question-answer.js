const { EventEmitter } = require('events');
const Echo = require('../index.js');

const eventEmitter = new EventEmitter();

const WHO = 'user1';
const echo = new Echo(true, 10, eventEmitter, 5000, WHO); // wait 5 seconds for answer

const question = 'Do you want to continue (yes/no)?';

// function f1: ask question and process answer
const f1 = async () => {
  try {
    const answer = await echo.question(question);

    if (answer === 'yes') {
      await echo.log('ANSWERED yes: Continuing operation...');
    } else if (answer === 'no') {
      await echo.log('ANSWERED no: Aborting operation...');
    }
  } catch (err) {
    await echo.warn(err.message);
  }
};


// function f2: send answers
const f2 = async () => {
  // send answer
  await new Promise(r => setTimeout(r, 3000));
  eventEmitter.emit('echo-answer', WHO, question, 'yes');

  // this should NOT work (already answered)
  await new Promise(r => setTimeout(r, 3400));
  eventEmitter.emit('echo-answer', WHO, question, 'no');
};


f1();
f2();
