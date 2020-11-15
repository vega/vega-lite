import {FieldName} from '../../src/channeldef';
import * as log from '../../src/log';
import {normalize} from '../../src/normalize';
import {TopLevelUnitSpec} from '../../src/spec/unit';

describe('RuleForRangedLineNormalizer', () => {
  it(
    'correctly normalizes line with rule where there is x2 or y2.',
    log.wrap(localLogger => {
      const spec: TopLevelUnitSpec<FieldName> = {
        data: {url: 'data/stocks.csv', format: {type: 'csv'}},
        mark: 'line',
        encoding: {
          x: {field: 'date', type: 'temporal'},
          y: {field: 'price', type: 'quantitative'},
          x2: {field: 'date2'}
        }
      };

      const normalizedSpec = normalize(spec);
      expect(normalizedSpec).toEqual({
        ...spec,
        mark: 'rule'
      });
      expect(localLogger.warns[0]).toEqual(log.message.lineWithRange(true, false));
    })
  );

  it('does not normalize line when there is x2 or y2, but its primary channel is "binned".', () => {
    const spec: TopLevelUnitSpec<FieldName> = {
      data: {url: 'data/stocks.csv', format: {type: 'csv'}},
      mark: 'line',
      encoding: {
        x: {bin: 'binned', field: 'x', type: 'quantitative'},
        x2: {field: 'x2'},
        y: {field: 'price', type: 'quantitative'}
      }
    };

    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual(spec);
  });
});
