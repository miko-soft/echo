const chalk = require('chalk');
const moment = require('moment');

/**
 * DEX8 Echo utility
 * -----------------
 * Unified logger for console output and event emitters.
 * Supports logs, warnings, errors, objects, images, and questions.
 *
 * Echo object format:
 * {
 *   who: string,                // optional sender identifier
 *   msg: string | object,       // payload
 *   method: 'log' | 'objekt' | 'error' | 'image' | 'warn' | 'question',
 *   time: ISO string
 * }
 */
class Echo {

  /**
   * @param {boolean} short - Print compact console output
   * @param {number} delay - Delay between consecutive echoes (ms)
   * @param {EventEmitter} eventEmitter - Optional Node.js event emitter
   * @param {number} answerTimeout - Question timeout in ms
   * @param {string} who - Sender identifier (e.g. user ID)
   */
  constructor(short = true, delay = 100, eventEmitter, answerTimeout, who) {
    this.short = short;                 // short = message-only console output
    this.delay = delay;                 // delay between non-question messages
    this.eventEmitter = eventEmitter;   // external event emitter
    this.answerTimeout = answerTimeout || 30000;
    this.who = who || '';
    this.allEchoes = [];                // history of all echoes
  }

  /**
   * Standard console log (like console.log).
   */
  async log(...args) {
    const msg = args.map(arg => this._toString(arg)).join(' ');
    await this._process('log', msg);
  }

  /**
   * Warning message.
   */
  async warn(...args) {
    const msg = args.map(arg => this._toString(arg)).join(' ');
    await this._process('warn', msg);
  }

  /**
   * Error logger.
   * Accepts Error object or string.
   */
  async error(err) {
    const errorObj = typeof err === 'string' ? new Error(err) : err;
    const msg = { message: errorObj.message, stack: errorObj.stack };
    await this._process('error', msg);
  }

  /**
   * Pretty-print object output.
   */
  async objekt(obj) {
    await this._process('objekt', obj);
  }

  /**
   * Base64 image passthrough (no rendering).
   */
  async image(img_b64) {
    await this._process('image', img_b64);
  }

  /**
   * Ask a question and wait for an answer via event emitter.
   */
  async question(questionMsg) {
    await this._process('question', questionMsg);

    return new Promise((resolve, reject) => {
      let isAnswered = false;

      const answerListener = (incomingWho, incomingQuestion, answer) => {
        if (incomingWho === this.who && incomingQuestion === questionMsg) {
          isAnswered = true;
          this.eventEmitter.removeListener('echo-answer', answerListener);
          resolve(answer);
        }
      };

      this.eventEmitter.on('echo-answer', answerListener);

      setTimeout(() => {
        if (!isAnswered) {
          this.eventEmitter.removeListener('echo-answer', answerListener);
          const sanitized = String(questionMsg)
            .replace(/<\/?[^>]+(>|$)/g, '')
            .trim();
          reject(new Error(`No answer for '${sanitized}' within ${this.answerTimeout}ms`));
        }
      }, this.answerTimeout);
    });
  }



  /******** PRIVATE METHODS ********/

  /**
   * Central echo handler.
   * Creates echo object, stores it, logs it, and emits it.
   * @private
   */
  async _process(method, msg) {
    const echoObj = {
      who: this.who,
      msg,
      method,
      time: moment().toISOString()
    };

    this.allEchoes.push(echoObj);
    this._log_console(echoObj);
    this._log_event(echoObj);

    // Avoid flooding logs with rapid messages
    if (method !== 'question') {
      await new Promise(r => setTimeout(r, this.delay));
    }

    return echoObj;
  }

  /**
   * Output formatted message to console.
   */
  _log_console(echoObj) {
    const colors = {
      log: chalk.greenBright,
      warn: chalk.yellow,
      error: chalk.redBright,
      objekt: chalk.blueBright,
      image: chalk.gray,
      question: chalk.green
    };

    const color = colors[echoObj.method] || chalk.white;

    if (this.short) {
      const who = echoObj.who ? `[${echoObj.who}]` : '[unknown]';
      const timeStr = moment(echoObj.time).format('DD.MMM.YYYY HH:mm:ss.SSS');
      let output = echoObj.msg;

      if (echoObj.method === 'objekt') output = JSON.stringify(echoObj.msg, null, 2);
      if (echoObj.method === 'error') output = echoObj.msg.message;
      if (output === '' && echoObj.method === 'log') {
        console.log();
        return;
      }

      console.log(color(who, `(${timeStr})`, output));
    } else {
      console.log(color(JSON.stringify(echoObj, null, 2)));
    }
  }

  /**
   * Emit echo object through event emitter.
   */
  _log_event(echoObj) {
    if (this.eventEmitter) {
      this.eventEmitter.emit('echo-event', echoObj);
    }
  }

  /**
   * Safely convert any value to string.
   */
  _toString(arg) {
    if (typeof arg === 'object' || typeof arg === 'boolean') {
      try {
        return JSON.stringify(arg, null, 0);
      } catch (err) {
        return String(err);
      }
    }
    return String(arg);
  }

}



module.exports = Echo;
