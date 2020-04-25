import {assembleLegend} from '../../../src/compile/legend/assemble';
import {LegendComponent} from '../../../src/compile/legend/component';
import {parseUnitModelWithScale} from '../../util';

describe('legend/assemble', () => {
  it('correctly applies labelExpr.', () => {
    const model = parseUnitModelWithScale({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        color: {
          field: 'Origin',
          type: 'nominal',
          legend: {
            labelExpr: 'datum.label[0]'
          }
        }
      }
    });
    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends[0].encode.labels.update.text).toEqual({
      signal: 'datum.label[0]'
    });
  });

  it('correctly applies labelExpr for timeUnit.', () => {
    const model = parseUnitModelWithScale({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        color: {
          timeUnit: 'month',
          field: 'date',
          type: 'temporal',
          legend: {
            labelExpr: 'datum.label[0]'
          }
        }
      }
    });
    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends[0].encode.labels.update.text).toEqual({
      signal: 'datum.label[0]'
    });
  });

  it('merges legend of the same field with the default type.', () => {
    const model = parseUnitModelWithScale({
      $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
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
  });

  it('merges legend of the same field and favor symbol legend over gradient', () => {
    const model = parseUnitModelWithScale({
      data: {
        values: [
          {a: 'A', b: 28},
          {a: 'B', b: 55}
        ]
      },
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
    expect(legends[0].encode.symbols.update?.fill).toBe(undefined);
  });

  describe('assembleLegend', () => {
    it('correctly redirect color signal', () => {
      const legendCmpt = new LegendComponent({
        labelColor: {signal: 'a'}
      });
      const axis = assembleLegend(legendCmpt);
      expect(axis.encode.labels.update.fill).toEqual({signal: 'a'});
    });
  });
});
