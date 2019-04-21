import {AggregateOp} from 'vega';
import {isFieldDef} from '../../src/channeldef';
import {ErrorBarCenter, ErrorBarExtent} from '../../src/compositemark/errorbar';
import {defaultConfig} from '../../src/config';
import * as log from '../../src/log';
import {isMarkDef} from '../../src/mark';
import {normalize} from '../../src/normalize/index';
import {isLayerSpec, isUnitSpec} from '../../src/spec';
import {TopLevelUnitSpec} from '../../src/spec/unit';
import {isAggregate, isCalculate, Transform} from '../../src/transform';
import {some} from '../../src/util';

describe('normalizeErrorBar with raw data input', () => {
  it('should produce correct layered specs for mean point and vertical error bar', () => {
    const output = normalize(
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
    );

    expect(output).toEqual({
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
          mark: {type: 'rule', style: 'errorbar-rule'},
          encoding: {
            y: {
              field: 'lower_people',
              type: 'quantitative',
              title: 'people'
            },
            y2: {field: 'upper_people', type: 'quantitative'},
            x: {field: 'age', type: 'ordinal'},
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

  it('should produce an error if both axes have aggregate errorbar', () => {
    expect(() => {
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
    }).toThrow();
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

      expect(localLogger.warns[0]).toEqual(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    })
  );

  it('should produce an error if build 1D errorbar with a discrete axis', () => {
    expect(() => {
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
    }).toThrow();
  });

  it('should produce an error if both axes are discrete', () => {
    expect(() => {
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
    }).toThrow();
  });

  it('should produce an error if in 2D errobar both axes are not valid field definitions', () => {
    expect(() => {
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
    }).toThrow();
  });

  it('should produce an error if 1D errorbar only axis is discrete', () => {
    expect(() => {
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
    }).toThrow();
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
      expect(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'people' &&
            (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
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
      expect(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
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
      expect(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'people' &&
            (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
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
      expect(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
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
      expect(
        some(aggregateTransform.aggregate, aggregateFieldDef => {
          return (
            aggregateFieldDef.field === 'age' && (aggregateFieldDef.op === 'mean' || aggregateFieldDef.op === 'median')
          );
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
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
      expect(
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
      ).toBe(true);
    } else {
      expect(false).toBe(true);
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
      expect(
        some(layer, unitSpec => {
          return isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.y) && unitSpec.encoding.y.title === 'population';
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
    }
  });

  it("should not overwrite transform with errorbar's transfroms", () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: 'errorbar',
        transform: [{calculate: 'age * 2', as: 'age2'}],
        encoding: {x: {field: 'age', type: 'ordinal'}, y: {field: 'people', type: 'quantitative', title: 'population'}}
      },
      defaultConfig
    );

    const transforms: Transform[] = outputSpec.transform;
    expect(transforms).toBeDefined();
    expect(transforms).not.toHaveLength(0);
    expect(transforms[0]).toEqual({calculate: 'age * 2', as: 'age2'});
  });

  it('should produce a correct tooltip title for errorbar with stdev extent', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorbar', extent: 'stdev'},
        encoding: {x: {field: 'age', type: 'ordinal'}, y: {field: 'people', type: 'quantitative'}}
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    expect(layer).toBeTruthy();
    for (const unitSpec of layer) {
      const encoding = isUnitSpec(unitSpec) && unitSpec.encoding;
      expect(encoding).toBeTruthy();
      const tooltip = encoding.tooltip;
      expect(tooltip).toEqual([
        {field: 'center_people', title: 'Mean of people', type: 'quantitative'},
        {field: 'upper_people', title: 'Mean + stdev of people', type: 'quantitative'},
        {field: 'lower_people', title: 'Mean - stdev of people', type: 'quantitative'},
        {field: 'age', type: 'ordinal'}
      ]);
    }
  });

  it('should produce a correct tooltip title for errorbar with stderr extent', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorbar', extent: 'stderr'},
        encoding: {x: {field: 'age', type: 'ordinal'}, y: {field: 'people', type: 'quantitative'}}
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    expect(layer).toBeTruthy();
    for (const unitSpec of layer) {
      const encoding = isUnitSpec(unitSpec) && unitSpec.encoding;
      expect(encoding).toBeTruthy();
      const tooltip = encoding.tooltip;
      expect(tooltip).toEqual([
        {field: 'center_people', title: 'Mean of people', type: 'quantitative'},
        {field: 'upper_people', title: 'Mean + stderr of people', type: 'quantitative'},
        {field: 'lower_people', title: 'Mean - stderr of people', type: 'quantitative'},
        {field: 'age', type: 'ordinal'}
      ]);
    }
  });

  it('should produce a correct tooltip title for errorbar with ci extent', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorbar', extent: 'ci'},
        encoding: {x: {field: 'age', type: 'ordinal'}, y: {field: 'people', type: 'quantitative'}}
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    expect(layer).toBeTruthy();
    for (const unitSpec of layer) {
      const encoding = isUnitSpec(unitSpec) && unitSpec.encoding;
      expect(encoding).toBeTruthy();
      const tooltip = encoding.tooltip;
      expect(tooltip).toEqual([
        {field: 'upper_people', title: 'Ci1 of people', type: 'quantitative'},
        {field: 'lower_people', title: 'Ci0 of people', type: 'quantitative'},
        {field: 'center_people', title: 'Mean of people', type: 'quantitative'},
        {field: 'age', type: 'ordinal'}
      ]);
    }
  });

  it('should produce a correct tooltip title for errorbar with iqr extent', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorbar', extent: 'iqr'},
        encoding: {x: {field: 'age', type: 'ordinal'}, y: {field: 'people', type: 'quantitative'}}
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    expect(layer).toBeTruthy();
    for (const unitSpec of layer) {
      const encoding = isUnitSpec(unitSpec) && unitSpec.encoding;
      expect(encoding).toBeTruthy();
      const tooltip = encoding.tooltip;
      expect(tooltip).toEqual([
        {field: 'upper_people', title: 'Q3 of people', type: 'quantitative'},
        {field: 'lower_people', title: 'Q1 of people', type: 'quantitative'},
        {field: 'center_people', title: 'Median of people', type: 'quantitative'},
        {field: 'age', type: 'ordinal'}
      ]);
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
      const spec: TopLevelUnitSpec = {
        data: {url: 'data/population.json'},
        mark: {type, ...(center ? {center} : {}), ...(extent ? {extent} : {})},
        encoding: {
          x: {field: 'people', type: 'quantitative'},
          y: {field: 'people', type: 'quantitative'}
        }
      };

      const warningOutput = warningOutputMap[center ? center : ''][extent ? extent : ''];

      for (let k = 0; k < warningOutput.length; k++) {
        const testMsg = `should ${warningOutput[k] ? '' : 'not '}produce a warning if center is ${
          center ? center : 'not specified'
        } and extent is ${extent ? extent : 'not specified'} that ${warningMessage[k](center, extent, type)}`;

        it(
          testMsg,
          log.wrap(localLogger => {
            normalize(spec);

            expect(warningOutput[k]).toEqual(
              some(localLogger.warns, message => {
                return message === warningMessage[k](center, extent, type);
              })
            );
          })
        );
      }

      const outputSpec = normalize(spec);
      const aggregateTransform = outputSpec.transform[0];
      const testMsg = `should produce a correct layer spec if center is ${
        center ? center : 'not specified'
      } and extent is ${extent ? extent : 'not specified'}.`;

      it(testMsg, () => {
        if (isAggregate(aggregateTransform)) {
          if (extent === 'iqr' || (center === 'median' && !extent)) {
            expect(
              some(aggregateTransform.aggregate, aggregateFieldDef => {
                return aggregateFieldDef.op === 'median';
              })
            ).toBe(true);
          } else if (extent === 'ci') {
            expect(
              some(aggregateTransform.aggregate, aggregateFieldDef => {
                return aggregateFieldDef.op === 'mean';
              })
            ).toBe(true);
          } else {
            if (center) {
              expect(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return aggregateFieldDef.op === center;
                })
              ).toBe(true);
            } else {
              expect(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return aggregateFieldDef.op === 'mean';
                })
              ).toBe(true);
            }

            if (extent) {
              expect(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return isPartOfExtent(extent, aggregateFieldDef.op);
                })
              ).toBe(true);
            } else if (center === 'median') {
              expect(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return isPartOfExtent('iqr', aggregateFieldDef.op);
                })
              ).toBe(true);

              expect(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return aggregateFieldDef.op === 'median';
                })
              ).toBe(false);
            } else {
              expect(
                some(aggregateTransform.aggregate, aggregateFieldDef => {
                  return isPartOfExtent('stderr', aggregateFieldDef.op);
                })
              ).toBe(true);
            }
          }
        } else {
          expect(false).toBe(true);
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

describe('normalizeErrorBar with aggregated upper and lower bound input', () => {
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

  it('should produce correct layered specs for vertical errorbar with aggregated upper and lower bound input', () => {
    expect(
      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {field: 'people', type: 'quantitative'},
            y2: {field: 'people2', type: 'quantitative'}
          }
        },
        defaultConfig
      )
    ).toEqual({
      data,
      transform: [
        {calculate: 'datum["people2"]', as: 'upper_people'},
        {calculate: 'datum["people"]', as: 'lower_people'}
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
            x: {field: 'age', type: 'ordinal'},
            tooltip: [
              {field: 'upper_people', title: 'people2', type: 'quantitative'},
              {field: 'lower_people', title: 'people', type: 'quantitative'},
              {field: 'age', type: 'ordinal'}
            ]
          }
        }
      ]
    });
  });

  it('should produce correct layered specs for horizontal errorbar with aggregated upper and lower bound input', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
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
        expect(
          (calculate.calculate === 'datum["people"]' && calculate.as === 'lower_people') ||
            (calculate.calculate === 'datum["people2"]' && calculate.as === 'upper_people')
        ).toBe(true);
      } else {
        expect(false).toBe(true);
      }
    }

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      expect(
        some(layer, unitSpec => {
          return (
            isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x) && unitSpec.encoding.x.field === 'lower_people'
          );
        })
      ).toBe(true);
      expect(
        some(layer, unitSpec => {
          return (
            isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x2) && unitSpec.encoding.x2.field === 'upper_people'
          );
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
    }
  });

  it(
    'should produce a warning if upper and lower bound are aggregated but center and/or extent is specified',
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

      expect(localLogger.warns[0]).toEqual(log.message.errorBarCenterAndExtentAreNotNeeded(center, extent));
    })
  );

  it('should produce an error if upper and lower bound are aggregated and have both x2 and y2 quantiative', () => {
    expect(() => {
      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'quantitative'},
            x2: {field: 'age2', type: 'quantitative'},
            y: {field: 'people', type: 'quantitative'},
            y2: {field: 'people2', type: 'quantitative'}
          }
        },
        defaultConfig
      );
    }).toThrow();
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

      expect(localLogger.warns[0]).toEqual(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    })
  );

  it('should produce a correct tooltip title for ranged errorbar', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {field: 'people', type: 'quantitative'},
          y2: {field: 'people2', type: 'quantitative'}
        }
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    expect(layer).toBeTruthy();
    for (const unitSpec of layer) {
      const encoding = isUnitSpec(unitSpec) && unitSpec.encoding;
      expect(encoding).toBeTruthy();
      const tooltip = encoding.tooltip;
      expect(tooltip).toEqual([
        {field: 'upper_people', title: 'people2', type: 'quantitative'},
        {field: 'lower_people', title: 'people', type: 'quantitative'},
        {field: 'age', type: 'ordinal'}
      ]);
    }
  });
});

describe('normalizeErrorBar with aggregated error input', () => {
  const data = {url: 'data.csv'};

  const mark = 'errorbar';

  it('should produce correct layered specs for vertical errorbar with aggregated error input', () => {
    expect(
      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {field: 'people', type: 'quantitative'},
            yError: {field: 'people_error', type: 'quantitative'}
          }
        },
        defaultConfig
      )
    ).toEqual({
      data,
      transform: [
        {calculate: 'datum["people"] + datum["people_error"]', as: 'upper_people'},
        {calculate: 'datum["people"] - datum["people_error"]', as: 'lower_people'}
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
            x: {field: 'age', type: 'ordinal'},
            tooltip: [
              {field: 'people', title: 'people', type: 'quantitative'},
              {field: 'upper_people', title: 'people + people_error', type: 'quantitative'},
              {field: 'lower_people', title: 'people - people_error', type: 'quantitative'},
              {field: 'age', type: 'ordinal'}
            ]
          }
        }
      ]
    });
  });

  it('should produce correct layered specs for horizontal errorbar with aggregated error input', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
        encoding: {
          y: {field: 'age', type: 'ordinal'},
          x: {field: 'people', type: 'quantitative'},
          xError: {field: 'people_error', type: 'quantitative'}
        }
      },
      defaultConfig
    );

    for (let i = 0; i < 2; i++) {
      const calculate: Transform = outputSpec.transform[i];

      if (isCalculate(calculate)) {
        expect(
          (calculate.calculate === 'datum["people"] - datum["people_error"]' && calculate.as === 'lower_people') ||
            (calculate.calculate === 'datum["people"] + datum["people_error"]' && calculate.as === 'upper_people')
        ).toBe(true);
      } else {
        expect(false).toBe(true);
      }
    }

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    if (layer) {
      expect(
        some(layer, unitSpec => {
          return (
            isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x) && unitSpec.encoding.x.field === 'lower_people'
          );
        })
      ).toBe(true);
      expect(
        some(layer, unitSpec => {
          return (
            isUnitSpec(unitSpec) && isFieldDef(unitSpec.encoding.x2) && unitSpec.encoding.x2.field === 'upper_people'
          );
        })
      ).toBe(true);
    } else {
      expect(false).toBe(true);
    }
  });

  it('should produce correct layered specs for horizontal errorbar with 2 aggregated error input', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
        encoding: {
          y: {field: 'age', type: 'ordinal'},
          x: {field: 'people', type: 'quantitative'},
          xError: {field: 'people_error', type: 'quantitative'},
          xError2: {field: 'people_error2', type: 'quantitative'}
        }
      },
      defaultConfig
    );

    for (let i = 0; i < 2; i++) {
      const calculate: Transform = outputSpec.transform[i];

      if (isCalculate(calculate)) {
        expect(
          (calculate.calculate === 'datum["people"] + datum["people_error"]' && calculate.as === 'upper_people') ||
            (calculate.calculate === 'datum["people"] + datum["people_error2"]' && calculate.as === 'lower_people')
        ).toBe(true);
      } else {
        expect(false).toBe(true);
      }
    }

    if (isLayerSpec(outputSpec)) {
      const unit = outputSpec.layer[0];
      if (isUnitSpec(unit)) {
        const tooltip = unit.encoding.tooltip;
        expect(tooltip).toEqual([
          {field: 'people', title: 'people', type: 'quantitative'},
          {field: 'upper_people', title: 'people + people_error', type: 'quantitative'},
          {field: 'lower_people', title: 'people + people_error2', type: 'quantitative'},
          {field: 'age', type: 'ordinal'}
        ]);
      }
    }
  });

  it(
    'should produce a warning if error are aggregated but center and/or extent is specified',
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
            yError: {field: 'people_error', type: 'quantitative'}
          }
        },
        defaultConfig
      );

      expect(localLogger.warns[0]).toEqual(log.message.errorBarCenterAndExtentAreNotNeeded(center, extent));
    })
  );

  it('should produce an error if error are aggregated and have both xError and yError quantiative', () => {
    expect(() => {
      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'quantitative'},
            xError: {field: 'age', type: 'quantitative'},
            y: {field: 'people', type: 'quantitative'},
            yError: {field: 'people_errpr', type: 'quantitative'}
          }
        },
        defaultConfig
      );
    }).toThrow();
  });

  it('should produce an error if error are aggregated for horizontal errorbar and xError2 exist without xError', () => {
    expect(() => {
      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'quantitative'},
            xError2: {field: 'age', type: 'quantitative'},
            y: {field: 'people', type: 'quantitative'}
          }
        },
        defaultConfig
      );
    }).toThrow();
  });

  it('should produce an error if error are aggregated for vertical errorbar and yError2 exist without yError', () => {
    expect(() => {
      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'quantitative'},
            yError2: {field: 'people_error2', type: 'quantitative'},
            y: {field: 'people', type: 'quantitative'}
          }
        },
        defaultConfig
      );
    }).toThrow();
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
            yError: {field: 'people_error', type: 'quantitative', aggregate}
          }
        },
        defaultConfig
      );

      expect(localLogger.warns[0]).toEqual(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, mark));
    })
  );

  it('should produce an error if both error and upper-lower bound are aggregated', () => {
    expect(() => {
      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'quantitative'},
            xError: {field: 'people_error', type: 'ordinal'},
            x2: {field: 'people_error2', type: 'quantitative'},
            y: {field: 'people', type: 'quantitative'}
          }
        },
        defaultConfig
      );
    }).toThrow();
  });

  it('should produce a correct tooltip title for errorbar with pre-aggregated error value', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {field: 'people', type: 'quantitative'},
          yError: {field: 'people_error', type: 'quantitative'}
        }
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    expect(layer).toBeTruthy();
    for (const unitSpec of layer) {
      const encoding = isUnitSpec(unitSpec) && unitSpec.encoding;
      expect(encoding).toBeTruthy();
      const tooltip = encoding.tooltip;
      expect(tooltip).toEqual([
        {field: 'people', title: 'people', type: 'quantitative'},
        {field: 'upper_people', title: 'people + people_error', type: 'quantitative'},
        {field: 'lower_people', title: 'people - people_error', type: 'quantitative'},
        {field: 'age', type: 'ordinal'}
      ]);
    }
  });

  it('should produce a correct tooltip title for errorbar with pre-aggregated error value', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {field: 'people', type: 'quantitative'},
          yError: {field: 'people_error', type: 'quantitative'},
          yError2: {field: 'people_error2', type: 'quantitative'}
        }
      },
      defaultConfig
    );

    const layer = isLayerSpec(outputSpec) && outputSpec.layer;
    expect(layer).toBeTruthy();
    for (const unitSpec of layer) {
      const encoding = isUnitSpec(unitSpec) && unitSpec.encoding;
      expect(encoding).toBeTruthy();
      const tooltip = encoding.tooltip;
      expect(tooltip).toEqual([
        {field: 'people', title: 'people', type: 'quantitative'},
        {field: 'upper_people', title: 'people + people_error', type: 'quantitative'},
        {field: 'lower_people', title: 'people + people_error2', type: 'quantitative'},
        {field: 'age', type: 'ordinal'}
      ]);
    }
  });
});
