import {mkdtempSync, rmSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import path from 'path';
import {loadConfig, localeOptions} from '../bin/render-config.js';

describe('CLI JSON and JavaScript configuration and locale flags', () => {
  let dir: string;
  let configFile: string;
  let numberFile: string;
  let timeFile: string;
  let jsFile: string;
  let cjsFile: string;

  const config = {axis: {labelFont: 'Arial'}};
  const number = {decimal: ',', thousands: '.', grouping: [3]};
  const time = {dateTime: '%A, %B %e, %Y, %X'};

  beforeAll(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'vega-lite-cli-'));
    configFile = path.join(dir, 'config.json');
    numberFile = path.join(dir, 'number.json');
    timeFile = path.join(dir, 'time.json');
    jsFile = path.join(dir, 'number.js');
    cjsFile = path.join(dir, 'number.cjs');
    writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}');
    writeFileSync(configFile, JSON.stringify(config));
    writeFileSync(numberFile, JSON.stringify(number));
    writeFileSync(timeFile, JSON.stringify(time));
    writeFileSync(jsFile, `export default ${JSON.stringify(number)};`);
    writeFileSync(cjsFile, `module.exports = ${JSON.stringify(number)};`);
  });

  afterAll(() => {
    rmSync(dir, {recursive: true, force: true});
  });

  it('parses JSON configuration into an object', async () => {
    expect(await loadConfig(configFile)).toEqual(config);
  });

  it('imports a JavaScript ES module config', async () => {
    expect(await loadConfig(jsFile)).toEqual(number);
  });

  it('imports a CommonJS module config', async () => {
    expect(await loadConfig(cjsFile)).toEqual(number);
  });

  it('does not override the Vega specification locale without flags', async () => {
    expect(await localeOptions()).toEqual({});
  });

  it('overrides only the number locale when -f is given', async () => {
    expect(await localeOptions(numberFile)).toEqual({locale: {number}});
  });

  it('overrides only the time locale when -t is given', async () => {
    expect(await localeOptions(undefined, timeFile)).toEqual({locale: {time}});
  });

  it('combines explicit number and time locale options', async () => {
    expect(await localeOptions(numberFile, timeFile)).toEqual({locale: {number, time}});
  });

  it('accepts a JavaScript number-locale module alongside a JSON time locale', async () => {
    expect(await localeOptions(jsFile, timeFile)).toEqual({locale: {number, time}});
  });

  it('rejects malformed configuration JSON', async () => {
    const invalid = path.join(dir, 'invalid.json');
    writeFileSync(invalid, '{invalid-json');
    await expect(loadConfig(invalid)).rejects.toThrow(SyntaxError);
  });
});
