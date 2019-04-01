/* tslint:disable:quotemark */

import {parseUnitModelWithScale} from '../../util';

describe('legend/assemble', () => {
  it('merges legend of the same field with the default type.', () => {
    const model = parseUnitModelWithScale({
      $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
      description: 'A scatterplot showing horsepower and miles per gallons.',
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        color: {field: 'Origin', type: 'nominal'},
        shape: {field: 'Origin', type: 'nominal'}
      }
    });
    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);

    expect(legends[0].title).toBe('Origin');
    expect(legends[0].stroke).toBe('color');
    expect(legends[0].shape).toBe('shape');
  });

  it('merges legend of the same field and favor symbol legend over gradient', () => {
    const model = parseUnitModelWithScale({
      data: {values: [{a: 'A', b: 28}, {a: 'B', b: 55}]},
      mark: 'bar',
      encoding: {
        x: {field: 'a', type: 'ordinal'},
        y: {field: 'b', type: 'quantitative'},
        color: {field: 'b', type: 'quantitative'},
        size: {field: 'b', type: 'quantitative'}
      }
    });

    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);
    expect(legends[0].title).toBe('b');
    expect(legends[0].fill).toBe('color');
    expect(legends[0].size).toBe('size');
    expect(legends[0].encode.symbols.update.fill).toBe(undefined);
  });
});
