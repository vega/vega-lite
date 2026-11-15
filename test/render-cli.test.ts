import {execFileSync} from 'child_process';
import {mkdtempSync, rmSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import path from 'path';

describe('vl2svg CLI options', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(path.join(tmpdir(), 'vl2svg-test-'));
  });

  afterEach(() => {
    rmSync(tmpDir, {recursive: true, force: true});
  });

  const runVl2Svg = (args: string[]) =>
    execFileSync(process.execPath, [path.resolve('bin/vl2svg'), ...args], {
      encoding: 'utf8',
    });

  it('parses JSON for -f (number locale), -t (time locale), and --config', () => {
    const specPath = path.join(tmpDir, 'spec.vl.json');
    const numLocalePath = path.join(tmpDir, 'number-locale.json');
    const timeLocalePath = path.join(tmpDir, 'time-locale.json');
    const configPath = path.join(tmpDir, 'config.json');

    writeFileSync(
      specPath,
      JSON.stringify({
        data: {values: [{x: '2026-01-15', y: 10000}]},
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'temporal', axis: {format: '%B'}},
          y: {field: 'y', type: 'quantitative'},
        },
      }),
    );

    writeFileSync(
      numLocalePath,
      JSON.stringify({
        decimal: ',',
        thousands: '.',
        grouping: [3],
        currency: ['', ' €'],
      }),
    );

    writeFileSync(
      timeLocalePath,
      JSON.stringify({
        dateTime: '%A, %e de %B de %Y, %X',
        date: '%d/%m/%Y',
        time: '%H:%M:%S',
        periods: ['AM', 'PM'],
        days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        shortDays: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        months: [
          'enero',
          'febrero',
          'marzo',
          'abril',
          'mayo',
          'junio',
          'julio',
          'agosto',
          'septiembre',
          'octubre',
          'noviembre',
          'diciembre',
        ],
        shortMonths: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      }),
    );

    writeFileSync(
      configPath,
      JSON.stringify({
        mark: {color: '#123456'},
      }),
    );

    const svg = runVl2Svg(['-f', numLocalePath, '-t', timeLocalePath, '--config', configPath, specPath]);
    expect(svg).toContain('10.000');
    expect(svg).toContain('enero');
    expect(svg).toContain('#123456');
  });

  it('does not overwrite spec config.locale when -f and -t are omitted', () => {
    const specPath = path.join(tmpDir, 'spec-locale.vl.json');

    writeFileSync(
      specPath,
      JSON.stringify({
        config: {
          locale: {
            number: {
              decimal: ',',
              thousands: '.',
              grouping: [3],
              currency: ['', ' €'],
            },
          },
        },
        data: {values: [{y: 10000}]},
        mark: 'point',
        encoding: {
          y: {field: 'y', type: 'quantitative'},
        },
      }),
    );

    const svg = runVl2Svg([specPath]);
    expect(svg).toContain('10.000');
  });
});
