import {mkdtempSync, rmSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import path from 'path';
import {loadJSON, localeOptions} from '../bin/render-config.js';

describe('CLI JSON configuration and locale flags', () => {
  let dir: string;
  let configFile: string;
  let numberFile: string;
  let timeFile: string;

  const config = {axis: {labelFont: 'Arial'}};
  const number = {decimal: ',', thousands: '.', grouping: [3]};
  const time = {dateTime: '%A, %B %e, %Y, %X'};

  beforeAll(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'vega-lite-cli-'));
    configFile = path.join(dir, 'config.json');
    numberFile = path.join(dir, 'number.json');
    timeFile = path.join(dir, 'time.json');
    writeFileSync(configFile, JSON.stringify(config));
    writeFileSync(numberFile, JSON.stringify(number));
    writeFileSync(timeFile, JSON.stringify(time));
  });

  afterAll(() => {
    rmSync(dir, {recursive: true, force: true});
  });

  it('parses a JSON config file into an object', () => {
    expect(loadJSON(configFile)).toEqual(config);
  });

  it('does not override the Vega specification locale without CLI flags', () => {
    expect(localeOptions()).toEqual({});
  });

  it('overrides only the number locale when -f is given', () => {
    expect(localeOptions(numberFile)).toEqual({locale: {number}});
  });

  it('overrides only the time locale when -t is given', () => {
    expect(localeOptions(undefined, timeFile)).toEqual({locale: {time}});
  });

  it('combines explicit number and time locale options', () => {
    expect(localeOptions(numberFile, timeFile)).toEqual({locale: {number, time}});
  });

  it('rejects malformed configuration JSON', () => {
    const invalid = path.join(dir, 'invalid.json');
    writeFileSync(invalid, '{invalid-json');
    expect(() => loadJSON(invalid)).toThrow(SyntaxError);
  });
});
