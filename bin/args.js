import yargs from 'yargs';
import {argv} from 'process';

export default function args(type) {
  const helpText = `${type === 'vega' ? 'Compile' : 'Render'} a Vega-Lite specification to ${
    type === 'vega' ? 'Vega' : type.toUpperCase()
  }.
Usage: vl2${type} [vega_json_spec_file] [output_${type}_file]
  If no arguments are provided, reads from stdin.
  If output_${type}_file is not provided, writes to stdout.
  For errors and log messages, writes to stderr.
To load data, you may need to set a base directory:
  For web retrieval, use '-b http://host/data/'.
  For files, use '-b file:///dir/data/' (absolute) or '-b data/' (relative).`;

  const a = yargs(argv.slice(2)).usage(helpText).demand(0);

  a.string('b')
    .alias('b', 'base')
    .describe('b', 'Base directory for data loading. Defaults to the directory of the input spec.');

  a.string('l')
    .alias('l', 'loglevel')
    .describe('l', 'Level of log messages written to stderr. One of "error", "warn" (default), "info", or "debug".');

  a.string('c')
    .alias('c', 'config')
    .describe('c', 'Vega config object. Either a JSON file or a .js file that exports the config object.');

  a.string('f')
    .alias('f', 'format')
    .describe('f', 'Number format locale descriptor. Either a JSON file or a .js file that exports the locale object.');

  a.string('t')
    .alias('t', 'timeFormat')
    .describe(
      't',
      'Date/time format locale descriptor. Either a JSON file or a .js file that exports the locale object.',
    );

  if (type === 'svg') {
    a.boolean('h').alias('h', 'header').describe('h', 'Include XML header and SVG doctype.');
  }

  a.number('s').alias('s', 'scale').default('s', 1).describe('s', 'Output resolution scale factor.');

  a.number('seed').describe('seed', 'Seed for random number generation.');

  if (type === 'vega') {
    a.boolean('p').alias('p', 'pretty').describe('p', 'Output human readable/pretty spec.');
  } else if (type === 'png') {
    a.number('ppi').describe('ppi', 'Resolution in ppi.');
  }

  return a.help().version().argv;
}
