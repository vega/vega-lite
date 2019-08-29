import Ajv from 'ajv';
import fs from 'fs';
import path from 'path';
import {inspect} from 'util';
import {Spec as VgSpec} from 'vega';
import {compile} from '../src/compile/compile';
import * as log from '../src/log';
import {TopLevelSpec} from '../src/spec';
import {duplicate} from '../src/util';

const vlSchema = require('../build/vega-lite-schema.json');
const vgSchema = require('vega/build/vega-schema.json');

const ajv = new Ajv({
  validateSchema: true,
  allErrors: true,
  extendRefs: 'fail',
  schemaId: 'auto' // for draft 04 and 06 schemas
});

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
ajv.addFormat('color-hex', () => true);

const validateVl = ajv.compile(vlSchema);
const validateVg = ajv.compile(vgSchema);

function validateVL(spec: TopLevelSpec) {
  const valid = validateVl(spec);
  const errors = validateVl.errors;
  if (!valid) {
    console.log(inspect(errors, {depth: 10, colors: true}));
  }

  expect(errors && errors.map((err: Ajv.ErrorObject) => err.message).join(', ')).toBeNull();
  expect(valid).toBe(true);

  expect(spec.$schema.substr(0, 42)).toBe('https://vega.github.io/schema/vega-lite/v4');
}

function validateVega(vegaSpec: VgSpec) {
  const valid = validateVg(vegaSpec);
  const errors = validateVg.errors;
  if (!valid) {
    console.log(inspect(errors, {depth: 10, colors: true}));
  }

  expect(errors && errors.map((err: Ajv.ErrorObject) => err.message).join(', ')).toBeNull();
  expect(valid).toBe(true);
}

const futureSuffixLength = '_future.vl.json'.length;
const brokenSuffixLength = '_broken.vl.json'.length;

describe('Examples', () => {
  const examples = fs.readdirSync('examples/specs').map(file => 'examples/specs/' + file);
  const normalizedExamples = fs
    .readdirSync('examples/specs/normalized')
    .map(file => 'examples/specs/normalized/' + file);

  for (const example of examples.concat(normalizedExamples)) {
    if (path.extname(example) !== '.json') {
      return;
    }
    const jsonSpec = JSON.parse(fs.readFileSync(example).toString());
    const originalSpec = duplicate(jsonSpec);

    describe(
      example,
      log.wrap(localLogger => {
        const vegaSpec: VgSpec = compile(jsonSpec).spec;

        it('should not cause any side effects', () => {
          expect(jsonSpec).toEqual(originalSpec);
        });

        it('should be valid vega-lite with proper $schema', () => {
          if (
            // Ignore all examples with "_future" suffix
            example.lastIndexOf('_future.vl.json', example.length - futureSuffixLength) >= 0
          ) {
            return;
          }
          validateVL(jsonSpec);
        });

        it('should not include any warning', () => {
          if (example.lastIndexOf('_broken.vl.json', example.length - brokenSuffixLength) >= 0) {
            // Ignore all examples with "_broken" suffix
            return;
          }

          expect(localLogger.warns).toEqual([]);
        });

        it('should produce valid vega', () => {
          if (example.lastIndexOf('_broken.vl.json', example.length - brokenSuffixLength) >= 0) {
            // Ignore all examples with "_broken" suffix
            return;
          }

          validateVega(vegaSpec);
        });
      })
    );
  }
});
