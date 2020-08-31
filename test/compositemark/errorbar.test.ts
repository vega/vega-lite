import {AggregateOp} from 'vega';
import {ErrorBarCenter, ErrorBarExtent} from '../../src/compositemark/errorbar';
import {defaultConfig} from '../../src/config';
import * as log from '../../src/log';
import {isMarkDef} from '../../src/mark';
import {normalize} from '../../src/normalize';
import {isLayerSpec, isUnitSpec} from '../../src/spec';
import {TopLevelUnitSpec} from '../../src/spec/unit';
import {isAggregate, isCalculate, Transform} from '../../src/transform';
import {some} from '../../src/util';
import {assertIsLayerSpec, assertIsUnitSpec} from '../util';

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
      mark: {type: 'rule', ariaRoleDescription: 'errorbar', style: 'errorbar-rule'},
      encoding: {
        y: {
          field: 'lower_people',
          type: 'quantitative',
          title: 'people'
        },
        y2: {field: 'upper_people'},
        x: {field: 'age', type: 'ordinal'},
        tooltip: [
          {field: 'center_people', title: 'Mean of people', type: 'quantitative'},
          {field: 'upper_people', title: 'Mean + stderr of people', type: 'quantitative'},
          {field: 'lower_people', title: 'Mean - stderr of people', type: 'quantitative'},
          {field: 'age', type: 'ordinal'}
        ]
      }
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

  it('should produce correct specs with customized title', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {
          type: 'errorbar'
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

    assertIsUnitSpec(outputSpec);

    expect(outputSpec.encoding.y['title']).toBe('population');
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

    assertIsUnitSpec(outputSpec);

    expect(outputSpec.encoding.tooltip).toEqual([
      {field: 'center_people', title: 'Mean of people', type: 'quantitative'},
      {field: 'upper_people', title: 'Mean + stdev of people', type: 'quantitative'},
      {field: 'lower_people', title: 'Mean - stdev of people', type: 'quantitative'},
      {field: 'age', type: 'ordinal'}
    ]);
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

    assertIsUnitSpec(outputSpec);

    expect(outputSpec.encoding.tooltip).toEqual([
      {field: 'center_people', title: 'Mean of people', type: 'quantitative'},
      {field: 'upper_people', title: 'Mean + stderr of people', type: 'quantitative'},
      {field: 'lower_people', title: 'Mean - stderr of people', type: 'quantitative'},
      {field: 'age', type: 'ordinal'}
    ]);
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

    assertIsUnitSpec(outputSpec);

    expect(outputSpec.encoding.tooltip).toEqual([
      {field: 'upper_people', title: 'Ci1 of people', type: 'quantitative'},
      {field: 'lower_people', title: 'Ci0 of people', type: 'quantitative'},
      {field: 'center_people', title: 'Mean of people', type: 'quantitative'},
      {field: 'age', type: 'ordinal'}
    ]);
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

    assertIsUnitSpec(outputSpec);

    expect(outputSpec.encoding.tooltip).toEqual([
      {field: 'upper_people', title: 'Q3 of people', type: 'quantitative'},
      {field: 'lower_people', title: 'Q1 of people', type: 'quantitative'},
      {field: 'center_people', title: 'Median of people', type: 'quantitative'},
      {field: 'age', type: 'ordinal'}
    ]);
  });

  it('should drop size in encoding channel', () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorbar'},
        encoding: {x: {field: 'age', type: 'quantitative'}, size: {value: 3}}
      },
      defaultConfig
    );

    assertIsUnitSpec(outputSpec);
    expect(outputSpec.encoding.size).toBeFalsy();
  });

  it('should apply mark.size to only size of ticks', () => {
    const size = 10;
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorbar', size, ticks: true},
        encoding: {x: {field: 'age', type: 'quantitative'}}
      },
      defaultConfig
    );

    assertIsLayerSpec(outputSpec);
    for (const layer of outputSpec.layer) {
      if (layer['mark']) {
        if (layer['mark']['type'] === 'tick') {
          expect(layer['mark']['size']).toBe(size);
        } else {
          expect(layer['mark']['size']).toBeFalsy();
        }
      }
    }
  });

  it('should override mark.size with mark.ticks.size', () => {
    const size = 10;
    const tickSize = 5;
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorbar', size, ticks: {size: tickSize}},
        encoding: {x: {field: 'age', type: 'quantitative'}}
      },
      defaultConfig
    );

    assertIsLayerSpec(outputSpec);
    for (const layer of outputSpec.layer) {
      if (layer['mark']) {
        if (layer['mark']['type'] === 'tick') {
          expect(layer['mark']['size']).toBe(tickSize);
        } else {
          expect(layer['mark']['size']).toBeFalsy();
        }
      }
    }
  });

  it('should apply mark.thickness to both thickness of ticks and size of rule', () => {
    const thickness = 10;
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {type: 'errorbar', thickness, ticks: true},
        encoding: {x: {field: 'age', type: 'quantitative'}}
      },
      defaultConfig
    );

    assertIsLayerSpec(outputSpec);
    for (const layer of outputSpec.layer) {
      if (layer['mark']) {
        if (layer['mark']['type'] === 'tick') {
          expect(layer['mark']['thickness']).toBe(thickness);
        } else {
          expect(layer['mark']['size']).toBe(thickness);
        }
      }
    }
  });

  it('should override mark.thickness with mark.ticks.thickness and mark.rule.size', () => {
    const thickness = 10;
    const tickThickness = 5;
    const ruleSize = 7;

    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {
          type: 'errorbar',
          thickness,
          ticks: {thickness: tickThickness} as any,
          rule: {size: ruleSize}
        },
        encoding: {x: {field: 'age', type: 'quantitative'}}
      },
      defaultConfig
    );

    assertIsLayerSpec(outputSpec);
    for (const layer of outputSpec.layer) {
      if (layer['mark']) {
        if (layer['mark']['type'] === 'tick') {
          expect(layer['mark']['thickness']).toBe(tickThickness);
        } else {
          expect(layer['mark']['size']).toBe(ruleSize);
        }
      }
    }
  });
});

describe('normalizeErrorBar for all possible extents and centers with raw data input', () => {
  const centers: ErrorBarCenter[] = ['mean', 'median', undefined];
  const extents: ErrorBarExtent[] = ['stderr', 'stdev', 'ci', 'iqr', undefined];

  const warningIndex = {
    mean: {
      stderr: false,
      stdev: false,
      ci: false,
      iqr: true,
      '': false
    },
    median: {
      stderr: true,
      stdev: true,
      ci: true,
      iqr: false,
      '': false
    },
    undefined: {
      stderr: false,
      stdev: false,
      ci: false,
      iqr: false,
      '': false
    }
  };

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

      it(
        `should produce a correct layer spec for center=${center}, extent=${extent} and throw appropriate warning`,
        log.wrap(localLogger => {
          const outputSpec = normalize(spec);
          const aggregateTransform = outputSpec.transform[0];
          if (warningIndex[center][extent]) {
            expect(localLogger.warns[0]).toEqual(log.message.errorBarCenterIsUsedWithWrongExtent(center, extent, type));
          }

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
        })
      );
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

  it('should produce correct specs for vertical errorbar with aggregated upper and lower bound input', () => {
    expect(
      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {field: 'people', type: 'quantitative'},
            y2: {field: 'people2'}
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
      mark: {type: 'rule', ariaRoleDescription: 'errorbar', style: 'errorbar-rule'},
      encoding: {
        x: {field: 'age', type: 'ordinal'},
        y: {
          field: 'lower_people',
          type: 'quantitative',
          title: 'people'
        },
        y2: {field: 'upper_people'},
        tooltip: [
          {field: 'upper_people', title: 'people2', type: 'quantitative'},
          {field: 'lower_people', title: 'people', type: 'quantitative'},
          {field: 'age', type: 'ordinal'}
        ]
      }
    });
  });

  it('should produce correct specs for horizontal errorbar with aggregated upper and lower bound input', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
        encoding: {
          y: {field: 'age', type: 'ordinal'},
          x: {field: 'people', type: 'quantitative'},
          x2: {field: 'people2'}
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

    assertIsUnitSpec(outputSpec);

    const encoding = outputSpec.encoding;

    expect(encoding.x['field']).toBe('lower_people');
    expect(encoding.x2['field']).toBe('upper_people');
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
            y2: {field: 'people2'}
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
            x2: {field: 'age2'},
            y: {field: 'people', type: 'quantitative'},
            y2: {field: 'people2'}
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
            y2: {field: 'people2', aggregate}
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
          y2: {field: 'people2'}
        }
      },
      defaultConfig
    );

    assertIsUnitSpec(outputSpec);

    expect(outputSpec.encoding.tooltip).toEqual([
      {field: 'upper_people', title: 'people2', type: 'quantitative'},
      {field: 'lower_people', title: 'people', type: 'quantitative'},
      {field: 'age', type: 'ordinal'}
    ]);
  });
});

describe('normalizeErrorBar with aggregated error input', () => {
  const data = {url: 'data.csv'};

  const mark = 'errorbar';

  it('should produce correct specs for vertical errorbar with aggregated error input', () => {
    expect(
      normalize(
        {
          data,
          mark,
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {field: 'people', type: 'quantitative'},
            yError: {field: 'people_error'}
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
      mark: {type: 'rule', ariaRoleDescription: 'errorbar', style: 'errorbar-rule'},
      encoding: {
        y: {
          field: 'lower_people',
          type: 'quantitative',
          title: 'people'
        },
        y2: {field: 'upper_people'},
        x: {field: 'age', type: 'ordinal'},
        tooltip: [
          {field: 'people', title: 'people', type: 'quantitative'},
          {field: 'upper_people', title: 'people + people_error', type: 'quantitative'},
          {field: 'lower_people', title: 'people - people_error', type: 'quantitative'},
          {field: 'age', type: 'ordinal'}
        ]
      }
    });
  });

  it('should produce correct specs for horizontal errorbar with aggregated error input', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
        encoding: {
          y: {field: 'age', type: 'ordinal'},
          x: {field: 'people', type: 'quantitative'},
          xError: {field: 'people_error'}
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

    assertIsUnitSpec(outputSpec);

    const encoding = outputSpec.encoding;

    expect(encoding.x['field']).toBe('lower_people');
    expect(encoding.x2['field']).toBe('upper_people');
  });

  it('should produce correct layered specs for horizontal errorbar with 2 aggregated error input', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
        encoding: {
          y: {field: 'age', type: 'ordinal'},
          x: {field: 'people', type: 'quantitative'},
          xError: {field: 'people_error'},
          xError2: {field: 'people_error2'}
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
            yError: {field: 'people_error'}
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
            xError: {field: 'age'},
            y: {field: 'people', type: 'quantitative'},
            yError: {field: 'people_errpr'}
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
            xError2: {field: 'age'},
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
            yError2: {field: 'people_error2'},
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
            yError: {field: 'people_error', aggregate}
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
            xError: {field: 'people_error'},
            x2: {field: 'people_error2'},
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
          yError: {field: 'people_error'}
        }
      },
      defaultConfig
    );

    assertIsUnitSpec(outputSpec);

    expect(outputSpec.encoding.tooltip).toEqual([
      {field: 'people', title: 'people', type: 'quantitative'},
      {field: 'upper_people', title: 'people + people_error', type: 'quantitative'},
      {field: 'lower_people', title: 'people - people_error', type: 'quantitative'},
      {field: 'age', type: 'ordinal'}
    ]);
  });

  it('should produce a correct tooltip title for errorbar with pre-aggregated error values', () => {
    const outputSpec = normalize(
      {
        data,
        mark,
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {field: 'people', type: 'quantitative'},
          yError: {field: 'people_error'},
          yError2: {field: 'people_error2'}
        }
      },
      defaultConfig
    );

    assertIsUnitSpec(outputSpec);

    expect(outputSpec.encoding.tooltip).toEqual([
      {field: 'people', title: 'people', type: 'quantitative'},
      {field: 'upper_people', title: 'people + people_error', type: 'quantitative'},
      {field: 'lower_people', title: 'people + people_error2', type: 'quantitative'},
      {field: 'age', type: 'ordinal'}
    ]);
  });
});
