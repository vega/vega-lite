/* tslint:disable:quotemark */
import {assert} from 'chai';

import * as log from '../../src/log';
import {isMarkDef} from '../../src/mark';
import {isLayerSpec, isUnitSpec, normalize} from '../../src/spec';
import {every, some} from '../../src/util';
import {defaultConfig} from '.././../src/config';

describe('normalizeErrorBand', () => {
  it('should produce correct layered specs for mean point and vertical error band', () => {
    assert.deepEqual(
      normalize(
        {
          data: {
            url: 'data/population.json'
          },
          mark: 'errorband',
          encoding: {
            x: {
              field: 'age',
              type: 'ordinal'
            },
            y: {
              field: 'people',
              type: 'quantitative'
            }
          }
        },
        defaultConfig
      ),
      {
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
            calculate: 'datum.center_people + datum.extent_people',
            as: 'upper_people'
          },
          {
            calculate: 'datum.center_people - datum.extent_people',
            as: 'lower_people'
          }
        ],
        layer: [
          {
            mark: {
              opacity: 0.3,
              type: 'area',
              style: 'errorband-band'
            },
            encoding: {
              y: {
                field: 'lower_people',
                type: 'quantitative',
                title: 'people'
              },
              y2: {
                field: 'upper_people',
                type: 'quantitative'
              },
              x: {
                field: 'age',
                type: 'ordinal',
                title: 'age'
              }
            }
          }
        ]
      }
    );
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
      assert.isTrue(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'rect';
        })
      );
      assert.isTrue(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'rule';
        })
      );
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
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
      assert.isTrue(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'area';
        })
      );
      assert.isTrue(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.type === 'line';
        })
      );
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
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
      assert.isTrue(
        every(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && unitSpec.mark.interpolate === 'monotone';
        })
      );
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
    }
  });

  it('should produce correct layered specs with out interpolation in 1D error band', () => {
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
    if (layer) {
      assert.isTrue(
        every(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isMarkDef(unitSpec.mark) && !unitSpec.mark.interpolate;
        })
      );
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
    }
  });

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

      assert.equal(localLogger.warns[0], log.message.errorBand1DNotSupport('interpolate'));
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

      assert.equal(localLogger.warns[0], log.message.errorBand1DNotSupport('tension'));
    })
  );
});
