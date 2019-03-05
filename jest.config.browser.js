const base = require('./jest.config.js');

module.exports = {
  ...base,
  preset: 'jest-puppeteer'
};
