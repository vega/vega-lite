import _Ajv from 'ajv';
import {inspect} from 'util';
import specSchema from '../build/vega-lite-schema.json';

// https://github.com/ajv-validator/ajv/issues/2132
const Ajv = _Ajv as unknown as typeof _Ajv.default;

describe('Schema', () => {
  it('should be valid', () => {
    const ajv = new Ajv();
    ajv.addFormat('color-hex', () => true);

    // now validate our data against the schema
    const valid = ajv.validateSchema(specSchema);

    if (!valid) {
      console.log(inspect(ajv.errors, {depth: 10, colors: true}));
    }
    expect(valid).toBe(true);
  });
});
