import {normalize} from '../../src/normalize/index';
import {TopLevelUnitSpec} from '../../src/spec/unit';

describe('RuleForRangedLineNormalizer', () => {
  it('correctly normalizes line with rule where there is x2 or y2.', () => {
    const spec: TopLevelUnitSpec = {
      data: {url: 'data/stocks.csv', format: {type: 'csv'}},
      mark: 'line',
      encoding: {
        x: {field: 'date', type: 'temporal'},
        y: {field: 'price', type: 'quantitative'},
        x2: {field: 'date2', type: 'temporal'}
      }
    };

    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      ...spec,
      mark: 'rule'
    });
  });

  it('does not normalize line when there is x2 or y2, but its primary channel is "binned".', () => {
    const spec: TopLevelUnitSpec = {
      data: {url: 'data/stocks.csv', format: {type: 'csv'}},
      mark: 'line',
      encoding: {
        x: {bin: 'binned', field: 'x', type: 'quantitative'},
        x2: {field: 'x2', type: 'quantitative'},
        y: {field: 'price', type: 'quantitative'}
      }
    };

    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual(spec);
  });
});
