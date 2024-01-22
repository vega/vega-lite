const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const {teardown: teardownDevServer} = require('jest-dev-server');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
  await teardownDevServer(globalThis.servers);

  // close the browser instance
  await globalThis.__BROWSER_GLOBAL__.close();

  // clean-up the wsEndpoint file
  await fs.rm(DIR, {recursive: true, force: true});
};
