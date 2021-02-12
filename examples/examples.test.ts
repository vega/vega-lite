import Ajv, {ErrorObject} from 'ajv';
import addFormats from 'ajv-formats';
import draft6Schema from 'ajv/lib/refs/json-schema-draft-06.json';
import fs from 'fs';
import path from 'path';
import {Spec as VgSpec} from 'vega';
import vgSchema from 'vega/build/vega-schema.json';
import vlSchema from '../build/vega-lite-schema.json';
import {compile} from '../src/compile/compile';
import * as log from '../src/log';
import {TopLevelSpec} from '../src/spec';
import {duplicate} from '../src/util';

// import {inspect} from 'util';

const ajv = new Ajv({
  allowUnionTypes: true,
  strictTypes: false,
  strictTuples: false
});

ajv.addFormat('color-hex', () => true);
addFormats(ajv);

// for Vega until it's fixed
ajv.addMetaSchema(draft6Schema);
ajv.addKeyword('defs');
ajv.addKeyword('refs');

const validateVl = ajv.compile(vlSchema);
const validateVg = ajv.compile(vgSchema);

function validateVL(spec: TopLevelSpec) {
  const valid = validateVl(spec);
  const errors = validateVl.errors;
  if (!valid) {
    // uncomment to show schema validation error details
    // console.log(inspect(errors, {depth: 10, colors: true}));
  }

  expect(errors?.map((err: ErrorObject) => err.message).join(', ')).toBeUndefined();
  expect(valid).toBe(true);

  expect(spec.$schema.substr(0, 42)).toBe('https://vega.github.io/schema/vega-lite/v5');
}

function validateVega(vegaSpec: VgSpec) {
  const valid = validateVg(vegaSpec);
  const errors = validateVg.errors;
  if (!valid) {
    // uncomment to show schema validation  error details
    // console.log(inspect(errors, {depth: 10, colors: true}));
  }

  expect(errors?.map((err: ErrorObject) => err.message).join(', ')).toBeUndefined();
  expect(valid).toBe(true);
}

const BROKEN_SUFFIX = '_broken.vl.json';
const FUTURE_SUFFIX = '_future.vl.json';

const examples = fs.readdirSync('examples/specs').map(file => `examples/specs/${file}`);
const normalizedExamples = fs.readdirSync('examples/specs/normalized').map(file => `examples/specs/normalized/${file}`);

for (const example of [...examples, ...normalizedExamples]) {
  if (path.extname(example) !== '.json') {
    continue;
  }
  const jsonSpec = JSON.parse(fs.readFileSync(example).toString());
  const originalSpec = duplicate(jsonSpec);

  describe(
    // eslint-disable-next-line jest/valid-describe, jest/valid-title
    example,
    log.wrap(localLogger => {
      const vegaSpec: VgSpec = compile(jsonSpec).spec;

      it('should not cause any side effects', () => {
        expect(jsonSpec).toEqual(originalSpec);
      });

      // eslint-disable-next-line jest/expect-expect
      it('should be valid Vega-Lite with proper $schema', () => {
        if (example.endsWith(FUTURE_SUFFIX)) {
          return;
        }
        validateVL(jsonSpec);
      });

      it('should not produce any warning', () => {
        if (example.endsWith(BROKEN_SUFFIX)) {
          return;
        }

        expect(localLogger.warns).toEqual([]);
      });

      // eslint-disable-next-line jest/expect-expect
      it('should produce valid Vega', () => {
        if (example.endsWith(BROKEN_SUFFIX)) {
          return;
        }

        validateVega(vegaSpec);
      });
    })
  );
}
