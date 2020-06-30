import * as log from '../../src/log';
import {isMarkDef} from '../../src/mark';
import {normalize} from '../../src/normalize';
import {isLayerSpec, isUnitSpec} from '../../src/spec';
import {every, some} from '../../src/util';
import {defaultConfig} from '.././../src/config';

describe('normalizeErrorBand', () => {
  it('should produce correct layered specs for mean point and vertical error band', () => {
    expect(
      normalize(
        {
          data: {url: 'data/population.json'},
          mark: 'errorband',
          encoding: {x: {field: 'age', type: 'ordinal'}, y: {field: 'people', type: 'quantitative'}}
        },
        defaultConfig
      )
    ).toEqual({
      data: {
        url: 'data/population.json'
      },
      transform: [
        {
          aggregate: [
            {
              op: 'stderr',
              field: 'people',
              as: 'extent_people'
            },
            {
              op: 'mean',
              field: 'people',
              as: 'center_people'
            }
          ],
          groupby: ['age']
        },
        {
          calculate: 'datum["center_people"] + datum["extent_people"]',
          as: 'upper_people'
        },
        {
          calculate: 'datum["center_people"] - datum["extent_people"]',
          as: 'lower_people'
        }
      ],
      layer: [
        {
          mark: {
            opacity: 0.3,
            type: 'area',
            style: 'errorband-band',
            ariaRoleDescription: 'errorband'
          },
          encoding: {
            y: {
              field: 'lower_people',
              type: 'quantitative',
              title: 'people'
            },
            y2: {
              field: 'upper_people'
            },
            x: {
              field: 'age',
              type: 'ordinal'
            },
            tooltip: [
              {field: 'center_people', title: 'Mean of people', type: 'quantitative'},
              {field: 'upper_people', title: 'Mean + stderr of people', type: 'quantitative'},
              {field: 'lower_people', title: 'Mean - stderr of people', type: 'quantitative'},
              {field: 'age', type: 'ordinal'}
            ]
          }
        }
      ]
    });
  });

  it('should produce correct layered specs with rect + rule, instead of area + line, in 1D error band', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorband', borders: true},
        encoding: {y: {field: 'people', type: 'quantitative'}}
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      expect(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'rect';
        })
      ).toBe(true);
      expect(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'rule';
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
    }
  });

  it('should produce correct layered specs with area + line, in 2D error band', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorband', borders: true},
        encoding: {
          y: {field: 'people', type: 'quantitative'},
          x: {field: 'age', type: 'ordinal'}
        }
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      expect(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'area';
        })
      ).toBe(true);
      expect(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'line';
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
    }
  });

  it('should produce correct layered specs with interpolation in 2D error band', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorband', interpolate: 'monotone'},
        encoding: {
          y: {field: 'people', type: 'quantitative'},
          x: {field: 'age', type: 'ordinal'}
        }
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      expect(
        every(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.interpolate === 'monotone';
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
    }
  });

  it(
    'should produce correct layered specs without interpolation in 1D error band',
    log.wrap(localLogger => {
      const outputSpec = normalize(
        {
          data: {url: 'data/population.json'},
          mark: {type: 'errorband', interpolate: 'bundle', tension: 1},
          encoding: {
            y: {field: 'people', type: 'quantitative'}
          }
        },
        defaultConfig
      );

      const layer = isLayerSpec(outputSpec) && outputSpec.layer;
      expect(
        every(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && !unitSpec.mark.interpolate;
        })
      ).toBe(true);
      expect(localLogger.warns[0]).toEqual(log.message.errorBand1DNotSupport('interpolate'));
    })
  );

  it(
    'should produce a warning 1D error band has interpolate property',
    log.wrap(localLogger => {
      normalize(
        {
          data: {url: 'data/population.json'},
          mark: {type: 'errorband', interpolate: 'monotone'},
          encoding: {
            y: {field: 'people', type: 'quantitative'}
          }
        },
        defaultConfig
      );

      expect(localLogger.warns[0]).toEqual(log.message.errorBand1DNotSupport('interpolate'));
    })
  );

  it(
    'should produce a warning 1D error band has tension property',
    log.wrap(localLogger => {
      normalize(
        {
          data: {url: 'data/population.json'},
          mark: {type: 'errorband', tension: 1},
          encoding: {
            y: {field: 'people', type: 'quantitative'}
          }
        },
        defaultConfig
      );

      expect(localLogger.warns[0]).toEqual(log.message.errorBand1DNotSupport('tension'));
    })
  );
});
