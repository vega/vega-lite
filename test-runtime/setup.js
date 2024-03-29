const {mkdir, writeFile} = require('fs').promises;
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');
const {setup: setupDevServer} = require('jest-dev-server');
const chalk = require('chalk');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function () {
  globalThis.servers = await setupDevServer({
    command: `node ./node_modules/.bin/serve -l 8000`,
    launchTimeout: 50000,
    port: 8000
  });

  console.log(chalk.green('Setup Puppeteer'));

  const browser = await puppeteer.launch();
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  globalThis.__BROWSER_GLOBAL__ = browser;

  // use the file system to expose the wsEndpoint for TestEnvironments
  await mkdir(DIR, {recursive: true});
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
