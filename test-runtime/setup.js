import {mkdir, writeFile} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';
import {launch} from 'puppeteer';
import {setup as setupDevServer} from 'jest-dev-server';
import chalk from 'chalk';

const {green} = chalk;

const DIR = join(tmpdir(), 'jest_puppeteer_global_setup');

export default async function () {
  globalThis.servers = await setupDevServer({
    command: `node ./node_modules/.bin/serve -l 8000`,
    launchTimeout: 50000,
    port: 8000
  });

  console.log(green('Setup Puppeteer'));

  const browser = await launch();
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  globalThis.__BROWSER_GLOBAL__ = browser;

  // use the file system to expose the wsEndpoint for TestEnvironments
  await mkdir(DIR, {recursive: true});
  await writeFile(join(DIR, 'wsEndpoint'), browser.wsEndpoint());
}
