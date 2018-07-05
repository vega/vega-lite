/* tslint:disable:quotemark */
import {assert} from 'chai';

import {AggregateOp} from 'vega-typings/types/spec/transform';
import {ErrorBarCenter, ErrorBarExtent} from '../../src/compositemark/errorbar';
import {isFieldDef} from '../../src/fielddef';
import * as log from '../../src/log';
import {isMarkDef} from '../../src/mark';
import {CompositeUnitSpec, ExtendedLayerSpec, GenericSpec, isLayerSpec, isUnitSpec, normalize} from '../../src/spec';
import {isAggregate, isCalculate, Transform} from '../../src/transform';
import {some} from '../../src/util';
import {defaultConfig} from '.././../src/config';

describe('normalizeErrorBar with raw data input', () => {
  it('should produce correct layered specs for mean point and vertical error bar', () => {
    assert.deepEqual(
      normalize(
        {
          data: {
            url: 'data/population.json'
          },
          mark: 'errorbar',
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
        data: {url: 'data/population.json'},
        transform: [
          {
            aggregate: [
              {op: 'stderr', field: 'people', as: 'extent_people'},
              {op: 'mean', field: 'people', as: 'center_people'}
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
            mark: {type: 'rule', style: 'errorbar-rule'},
            encoding: {
              y: {
                field: 'lower_people',
                type: 'quantitative',
                title: 'people'
              },
              y2: {field: 'upper_people', type: 'quantitative'},
              x: {field: 'age', type: 'ordinal', title: 'age'}
            }
          }
        ]
      }
    );
  });

  it('should produce an error if both axes have aggregate errorbar', () => {
    assert.throws(
      () => {
        normalize(
          {
            data: {url: 'data/population.json'},
            mark: {
              type: 'errorbar'
            },
            encoding: {
              x: {aggregate: 'errorbar', field: 'people', type: 'quantitative'},
              y: {
                aggregate: 'errorbar',
                field: 'people',
                type: 'quantitative'
              },
              color: {value: 'skyblue'}
            }
          },
          defaultConfig
        );
      },
      Error,
      'Both x and y cannot have aggregate'
    );
  });

  it(
    'should produce a warning if continuous axis has aggregate property',
    log.wrap(localLogger => {
      const aggregate = 'min';
      const mark = 'errorbar';

      normalize(
        {
          data: {url: 'data/population.json'},
          mark,
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {
              aggregate,
              field: 'people',
              type: 'quantitative'
            },
            color: {value: 'skyblue'}
          }
        },
        defaultConfig
      );

      assert.equal(localLogger.warns[0], log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    })
  );

  it('should produce an error if build 1D errorbar with a discrete axis', () => {
    assert.throws(
      () => {
        normalize(
          {
            data: {url: 'data/population.json'},
            mark: 'errorbar',
            encoding: {
              x: {field: 'age', type: 'ordinal'}
            }
          },
          defaultConfig
        );
      },
      Error,
      'Need a valid continuous axis for errorbars'
    );
  });

  it('should produce an error if both axes are discrete', () => {
    assert.throws(
      () => {
        normalize(
          {
            data: {url: 'data/population.json'},
            mark: {
              type: 'errorbar'
            },
            encoding: {
              x: {field: 'age', type: 'ordinal'},
              y: {
                field: 'age',
                type: 'ordinal'
              },
              color: {value: 'skyblue'}
            }
          },
          defaultConfig
        );
      },
      Error,
      'Need a valid continuous axis for errorbars'
    );
  });

  it('should produce an error if in 2D errobar both axes are not valid field definitions', () => {
    assert.throws(
      () => {
        normalize(
          {
            data: {url: 'data/population.json'},
            mark: {
              type: 'errorbar'
            },
            encoding: {
              x: {field: 'age', type: 'ordinal'},
              y: {
                type: 'ordinal'
              },
              color: {value: 'skyblue'}
            }
          },
          defaultConfig
        );
      },
      Error,
      'Need a valid continuous axis for errorbars'
    );
  });

  it('should produce an error if 1D errorbar only axis is discrete', () => {
    assert.throws(
      () => {
        normalize(
          {
            data: {url: 'data/population.json'},
            mark: 'errorbar',
            encoding: {
              x: {field: 'age', type: 'ordinal'},
              color: {value: 'skyblue'}
            }
          },
          defaultConfig
        );
      },
      Error,
      'Need a valid continuous axis for errorbars'
    );
  });

  it('should aggregate y field for vertical errorbar with two quantitative axes and explicit orient', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {
          type: 'errorbar',
          orient: 'vertical'
        },
        encoding: {
          x: {
            field: 'age',
            type: 'quantitative'
          },
          y: {
            field: 'people',
            type: 'quantitative'
          }
        }
      },
      defaultConfig
    );
    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'people' &&
            (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      );
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it('should aggregate x field for horizontal errorbar with two quantitative axes and explicit orient', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {
          type: 'errorbar',
          orient: 'horizontal'
        },
        encoding: {
          x: {
            field: 'age',
            type: 'quantitative'
          },
          y: {
            field: 'people',
            type: 'quantitative'
          }
        }
      },
      defaultConfig
    );

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      );
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it('should aggregate y field for vertical errorbar with two quantitative axes and specify orientation with aggregate', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: 'errorbar',
        encoding: {
          x: {
            field: 'age',
            type: 'quantitative'
          },
          y: {
            aggregate: 'errorbar',
            field: 'people',
            type: 'quantitative'
          }
        }
      },
      defaultConfig
    );

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'people' &&
            (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      );
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it('should aggregate x field for horizontal errorbar with two quantitative axes and specify orientation with aggregate', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: 'errorbar',
        encoding: {
          x: {
            aggregate: 'errorbar',
            field: 'age',
            type: 'quantitative'
          },
          y: {
            field: 'people',
            type: 'quantitative'
          }
        }
      },
      defaultConfig
    );

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      );
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it('should aggregate x field for horizontal errorbar with x as quantitative axis', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: 'errorbar',
        encoding: {
          x: {
            field: 'age',
            type: 'quantitative'
          },
          y: {
            field: 'people',
            type: 'ordinal'
          }
        }
      },
      defaultConfig
    );

    const aggregateTransform = outputSpec.transform[0];
    if (isAggregate(aggregateTransform)) {
      assert.isTrue(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      );
    } else {
      assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
    }
  });

  it('should produce correct layered specs for veritcal errorbar with ticks', () => {
    const color = 'red';
    const opacity = 0.5;
    const size = 10;

    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {
          type: 'errorbar',
          ticks: {
            size,
            color,
            opacity
          }
        },
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
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      assert.isTrue(
        some(layer, unitSpec => {
          return (
            isUnitSpec(unitSpec) &&
            isMarkDef(unitSpec.mark) &&
            unitSpec.mark.type === 'tick' &&
            unitSpec.mark.size === size &&
            unitSpec.mark.color === color &&
            unitSpec.mark.opacity === opacity
          );
        })
      );
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
    }
  });

  it('should produce correct layered specs with customized title', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {
          type: 'errorbar',
          point: false
        },
        encoding: {
          x: {
            field: 'age',
            type: 'ordinal'
          },
          y: {
            field: 'people',
            type: 'quantitative',
            title: 'population'
          }
        }
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      assert.isTrue(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.y) && unitSpec.encoding.y.title === 'population';
        })
      );
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
    }
  });
});

describe('normalizeErrorBar for all possible extents and centers with raw data input', () => {
  const centers: ErrorBarCenter[] = ['mean', 'median', undefined];
  const extents: ErrorBarExtent[] = ['stderr', 'stdev', 'ci', 'iqr', undefined];

  const warningOutputMap = {
    mean: {
      stderr: [false, false],
      stdev: [false, false],
      ci: [false, true],
      iqr: [true, true],
      '': [false, false]
    },
    median: {
      stderr: [true, false],
      stdev: [true, false],
      ci: [true, true],
      iqr: [false, true],
      '': [false, false]
    },
    '': {
      stderr: [false, false],
      stdev: [false, false],
      ci: [false, false],
      iqr: [false, false],
      '': [false, false]
    }
  };

  const warningMessage = [
    (center: ErrorBarCenter, extent: ErrorBarExtent, type: 'errorbar' | 'errorband') => {
      return log.message.errorBarCenterIsUsedWithWrongExtent(center, extent, type); // msg1
    },
    (_center: ErrorBarCenter, extent: ErrorBarExtent, type: 'errorbar' | 'errorband') => {
      return log.message.errorBarCenterIsNotNeeded(extent, type); // msg2
    }
  ];

  const type = 'errorbar';

  for (const center of centers) {
    for (const extent of extents) {
      const spec: GenericSpec<CompositeUnitSpec, ExtendedLayerSpec> = {
        data: {url: 'data/population.json'},
        mark: {type, ...(center ? {center} : {}), ...(extent ? {extent} : {})},
        encoding: {
          x: {field: 'people', type: 'quantitative'},
          y: {field: 'people', type: 'quantitative'}
        }
      };

      const warningOutput = warningOutputMap[center ? center : ''][extent ? extent : ''];

      for (let k = 0; k < warningOutput.length; k++) {
        const testMsg =
          'should ' +
          (warningOutput[k] ? '' : 'not ') +
          'produce a warning if center is ' +
          (center ? center : 'not specified') +
          ' and extent is ' +
          (extent ? extent : 'not specified') +
          ' that ' +
          warningMessage[k](center, extent, type);

        it(
          testMsg,
          log.wrap(localLogger => {
            normalize(spec, defaultConfig);

            assert.equal(
              warningOutput[k],
              some(localLogger.warns, message => {
                return message === warningMessage[k](center, extent, type);
              })
            );
          })
        );
      }

      const outputSpec = normalize(spec, defaultConfig);
      const aggregateTransform = outputSpec.transform[0];
      const testMsg =
        'should produce a correct layer spec if center is ' +
        (center ? center : 'not specified') +
        ' and extent is ' +
        (extent ? extent : 'not specified') +
        '.';

      it(testMsg, () => {
        if (isAggregate(aggregateTransform)) {
          if (extent === 'ci' || extent === 'iqr' || (center === 'median' && !extent)) {
            assert.isFalse(
              some(aggregateTransform.aggregate, aggregateFieldDef => {
                return aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median';
              })
            );
          } else {
            if (center) {
              assert.isTrue(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return aggregateFieldDef.op === center;
                })
              );
            } else {
              assert.isTrue(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return aggregateFieldDef.op === 'mean';
                })
              );
            }

            if (extent) {
              assert.isTrue(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return isPartOfExtent(extent, aggregateFieldDef.op);
                })
              );
            } else if (center === 'median') {
              assert.isTrue(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return isPartOfExtent('iqr', aggregateFieldDef.op);
                })
              );

              assert.isFalse(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return aggregateFieldDef.op === 'median';
                })
              );
            } else {
              assert.isTrue(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return isPartOfExtent('stderr', aggregateFieldDef.op);
                })
              );
            }
          }
        } else {
          assert.fail(isAggregate(aggregateTransform), true, 'transform[0] should be an aggregate transform');
        }
      });
    }
  }
});

function isPartOfExtent(extent: ErrorBarExtent, op: AggregateOp) {
  if (extent === 'ci') {
    return op === 'ci0' || op === 'ci1';
  } else if (extent === 'iqr') {
    return op === 'q1' || op === 'q3';
  }
  return extent === op;
}

describe('normalizeErrorBar with aggregated data input', () => {
  const data = {
    values: [
      {age: 1, people: 1, people2: 2},
      {age: 2, people: 4, people2: 8},
      {age: 3, people: 13, people2: 18},
      {age: 4, people: 2, people2: 28},
      {age: 5, people: 19, people2: 23},
      {age: 6, people: 10, people2: 20},
      {age: 7, people: 2, people2: 5}
    ]
  };

  const mark = 'errorbar';

  it('should produce correct layered specs for vertical errorbar with aggregated data input', () => {
    assert.deepEqual(
      normalize(
        {
          data,
          mark: 'errorbar',
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {field: 'people', type: 'quantitative'},
            y2: {field: 'people2', type: 'quantitative'}
          }
        },
        defaultConfig
      ),
      {
        data,
        transform: [{calculate: 'datum.people', as: 'lower_people'}, {calculate: 'datum.people2', as: 'upper_people'}],
        layer: [
          {
            mark: {type: 'rule', style: 'errorbar-rule'},
            encoding: {
              y: {
                field: 'lower_people',
                type: 'quantitative',
                title: 'people'
              },
              y2: {field: 'upper_people', type: 'quantitative'},
              x: {field: 'age', type: 'ordinal', title: 'age'}
            }
          }
        ]
      }
    );
  });

  it('should produce correct layered specs for horizontal errorbar with aggregated data input', () => {
    const outputSpec = normalize(
      {
        data,
        mark: 'errorbar',
        encoding: {
          y: {field: 'age', type: 'ordinal'},
          x: {field: 'people', type: 'quantitative'},
          x2: {field: 'people2', type: 'quantitative'}
        }
      },
      defaultConfig
    );

    for (let i = 0; i < 2; i++) {
      const calculate: Transform = outputSpec.transform[i];

      if (isCalculate(calculate)) {
        assert.isTrue(
          (calculate.calculate === 'datum.people' && calculate.as === 'lower_people') ||
            (calculate.calculate === 'datum.people2' && calculate.as === 'upper_people')
        );
      } else {
        assert.fail(isCalculate(calculate), true, 'transform[' + i + '] should be an aggregate transform');
      }
    }

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      assert.isTrue(
        some(layer, unitSpec => {
          return (
            isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x) && unitSpec.encoding.x.field === 'lower_people'
          );
        })
      );
      assert.isTrue(
        some(layer, unitSpec => {
          return (
            isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x2) && unitSpec.encoding.x2.field === 'upper_people'
          );
        })
      );
    } else {
      assert.fail(!layer, false, 'layer should be a part of the spec');
    }
  });

  it(
    'should produce a warning if data are aggregated but center and/or extent is specified',
    log.wrap(localLogger => {
      const extent = 'stdev';
      const center = 'mean';

      normalize(
        {
          data,
          mark: {
            type: 'errorbar',
            extent,
            center
          },
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {field: 'people', type: 'quantitative'},
            y2: {field: 'people2', type: 'quantitative'}
          }
        },
        defaultConfig
      );

      assert.equal(localLogger.warns[0], log.message.errorBarCenterAndExtentAreNotNeeded(center, extent));
    })
  );

  it('should produce an error if data are aggregated and have both x2 and y2 quantiative', () => {
    assert.throws(
      () => {
        normalize(
          {
            data,
            mark: {
              type: 'errorbar',
              extent: 'stdev',
              center: 'mean'
            },
            encoding: {
              x: {field: 'age', type: 'quantitative'},
              x2: {field: 'age2', type: 'quantitative'},
              y: {field: 'people', type: 'quantitative'},
              y2: {field: 'people2', type: 'quantitative'}
            }
          },
          defaultConfig
        );
      },
      Error,
      'Cannot have both x2 and y2 with both are quantiative'
    );
  });

  it(
    'should produce a warning if the second continuous axis has aggregate property',
    log.wrap(localLogger => {
      const aggregate = 'min';

      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {field: 'people', type: 'quantitative'},
            y2: {field: 'people2', type: 'quantitative', aggregate}
          }
        },
        defaultConfig
      );

      assert.equal(localLogger.warns[0], log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    })
  );

  it(
    'should produce a warning if there is an unsupported channel in encoding',
    log.wrap(localLogger => {
      const size = 'size';

      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {field: 'people', type: 'quantitative'},
            y2: {field: 'people2', type: 'quantitative', aggregate: 'min'},
            size: {value: 10}
          }
        },
        defaultConfig
      );

      assert.equal(localLogger.warns[0], log.message.incompatibleChannel(size, mark));
    })
  );
});
