import {compile} from '../src';
import {spec} from '../test-runtime/util';

test('example test', () => {
  const s = spec(
    'unit',
    1,
    {type: 'interval', encodings: ['y']},
    {
      x: {aggregate: 'count', type: 'quantitative'},
      y: {bin: true},
      color: {value: 'steelblue'}
    }
  );
  expect(s).toBeDefined();

  console.log(JSON.stringify(s));

  const vg = compile(s).spec;

  expect(vg).toBeDefined();
});
