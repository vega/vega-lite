import {rm} from 'fs/promises';
import os from 'os';
import path from 'path';
import {teardown as teardownDevServer} from 'jest-dev-server';

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

export default async function () {
  await teardownDevServer(globalThis.servers);

  // close the browser instance
  await globalThis.__BROWSER_GLOBAL__.close();

  // clean-up the wsEndpoint file
  await rm(DIR, {recursive: true, force: true});
}
