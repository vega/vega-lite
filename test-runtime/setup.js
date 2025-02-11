import {mkdir, writeFile} from 'fs/promises';
import os from 'os';
import path from 'path';
import puppeteer from 'puppeteer';
import {setup as setupDevServer} from 'jest-dev-server';
import chalk from 'chalk';

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

export default async function globalSetup() {
  globalThis.servers = await setupDevServer({
    command: `npx serve -l 9000`,
    launchTimeout: 50000,
    port: 9000,
  });

  console.log(chalk.green('Setup Puppeteer'));

  const browser = await puppeteer.launch();
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  globalThis.__BROWSER_GLOBAL__ = browser;

  // use the file system to expose the wsEndpoint for TestEnvironments
  await mkdir(DIR, {recursive: true});
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
}
