import {describe, it, expect} from 'vitest';
import {compile} from '../src/compile/compile';

describe('invalid type error messaging', () => {
  it('mentions the invalid type, channel, and field', () => {
    const spec: any = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {values: [{x: 1, y: 2}]},
      mark: 'point',
      encoding: {
        x: {field: 'x', type: 'bool'}, // intentionally invalid
        y: {field: 'y', type: 'quantitative'}
      }
    };

    expect(() => compile(spec))
      .toThrow(/Invalid (field )?type\s*"(bool|undefined)".*(channel\s*"x".*field\s*"x"|field\s*"x".*channel\s*"x")/i);
    ;


  });
});
