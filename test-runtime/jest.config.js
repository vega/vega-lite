/** @type {import('jest').Config} */
export default {
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './puppeteer_environment.js',
  moduleNameMapper: {
    '(.+)\\.js': '$1'
  }
};
