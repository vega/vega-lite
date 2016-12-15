import {assert} from 'chai';

import * as log from '../src/log';

const testLogger = new log.LocalLogger();

before('Setup global local logger', () => {
  log.set(testLogger);
});

afterEach('Each test should not output warning. (They should be consumed by each test to test different warnings.)', () => {
  const logger = log.get() as log.LocalLogger;
  assert(logger !== log.getMain(), 'Logger should not be the normal main logger.');
  assert(logger === testLogger, 'Logger should be the test logger.');
  assert.deepEqual(logger.warns, [], 'Logger warnings should be empty.');
});
