const Echo = require('../index.js');

(async () => {
  const echo = new Echo(true, 1000, undefined, undefined, 'userX'); // short console output

  await echo.log('App started');
  await echo.warn('Low memory warning');
  await echo.objekt({ service: 'DEX8', status: 'running' });
  await echo.error(new Error('Something went wrong'));

  // all echoes are stored here
  console.log('\nALL ECHOES:\n', echo.allEchoes);
})();
