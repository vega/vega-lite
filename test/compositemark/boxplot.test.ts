import {array} from 'vega-util';
import * as log from '../../src/log';
import {normalize} from '../../src/normalize';
import {Transform} from '../../src/transform';
import {defaultConfig} from '.././../src/config';

describe('normalizeBoxMinMax', () => {
  it('should produce an error if both axes have aggregate boxplot', () => {
    expect(() => {
      normalize(
        {
          description:
            'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
          data: {url: 'data/population.json'},
          mark: {
            type: 'boxplot',
            extent: 'min-max'
          },
          encoding: {
            x: {aggregate: 'boxplot', field: 'people', type: 'quantitative'},
            y: {
              aggregate: 'boxplot',
              field: 'people',
              type: 'quantitative',
              axis: {title: 'Population'}
            },
            color: {value: 'skyblue'}
          }
        },
        defaultConfig
      );
    }).toThrow();
  });

  it('should produce correct transform groupby for vertical boxplot with two quantitative axes and use default orientation', () => {
    const output = normalize(
      {
        description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
        data: {url: 'data/population.json'},
        mark: {
          type: 'boxplot',
          extent: 'min-max',
          size: 5
        },
        encoding: {
          x: {field: 'age', type: 'quantitative'},
          y: {
            field: 'people',
            type: 'quantitative',
            axis: {title: 'Population'}
          },
          color: {value: 'skyblue'}
        }
      },
      defaultConfig
    );

    expect(output.transform).toEqual([
      {
        aggregate: [
          {
            op: 'q1',
            field: 'people',
            as: 'lower_box_people'
          },
          {
            op: 'q3',
            field: 'people',
            as: 'upper_box_people'
          },
          {
            op: 'median',
            field: 'people',
            as: 'mid_box_people'
          },
          {
            op: 'min',
            field: 'people',
            as: 'lower_whisker_people'
          },
          {
            op: 'max',
            field: 'people',
            as: 'upper_whisker_people'
          }
        ],
        groupby: ['age'] // should group by age
      }
    ]);
  });

  it('should produce an error if neither the x axis or y axis is specified', () => {
    expect(() => {
      normalize(
        {
          description:
            'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
          data: {url: 'data/population.json'},
          mark: {
            type: 'boxplot',
            extent: 'min-max'
          },
          encoding: {
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
      const type = 'boxplot';

      normalize(
        {
          description:
            'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
          data: {url: 'data/population.json'},
          mark: {
            type,
            extent: 'min-max',
            size: 14
          },
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {
              aggregate,
              field: 'people',
              type: 'quantitative',
              axis: {title: 'Population'}
            },
            color: {value: 'skyblue'}
          }
        },
        defaultConfig
      );

      expect(localLogger.warns[0]).toEqual(log.message.errorBarContinuousAxisHasCustomizedAggregate(aggregate, type));
    })
  );

  it('should produce an error if build 1D boxplot with a discrete axis', () => {
    expect(() => {
      normalize(
        {
          description:
            'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
          data: {url: 'data/population.json'},
          mark: 'boxplot',
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
          description:
            'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
          data: {url: 'data/population.json'},
          mark: {
            type: 'boxplot',
            extent: 'min-max'
          },
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {
              field: 'age',
              type: 'ordinal',
              axis: {title: 'age'}
            },
            color: {value: 'skyblue'}
          }
        },
        defaultConfig
      );
    }).toThrow();
  });

  it('should produce an error if in 2D boxplot both axes are not valid field definitions', () => {
    expect(() => {
      normalize(
        {
          description:
            'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
          data: {url: 'data/population.json'},
          mark: {
            type: 'boxplot',
            extent: 'min-max'
          },
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {
              type: 'ordinal',
              axis: {title: 'age'}
            },
            color: {value: 'skyblue'}
          }
        },
        defaultConfig
      );
    }).toThrow();
  });

  it('should produce an error if 1D boxplot only axis is discrete', () => {
    expect(() => {
      normalize(
        {
          description:
            'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
          data: {url: 'data/population.json'},
          mark: 'boxplot',
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            color: {value: 'skyblue'}
          }
        },
        defaultConfig
      );
    }).toThrow();
  });

  it('should produce correct transform groupby for vertical boxplot with two quantitative axes and specify orientation with orient', () => {
    const output = normalize(
      {
        description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
        data: {url: 'data/population.json'},
        mark: {
          type: 'boxplot',
          orient: 'vertical',
          extent: 'min-max'
        },
        encoding: {
          x: {field: 'age', type: 'quantitative'},
          y: {
            field: 'people',
            type: 'quantitative',
            axis: {title: 'Population'}
          },
          color: {value: 'skyblue'}
        }
      },
      defaultConfig
    );
    expect(output.transform).toEqual([
      {
        aggregate: [
          {
            op: 'q1',
            field: 'people',
            as: 'lower_box_people'
          },
          {
            op: 'q3',
            field: 'people',
            as: 'upper_box_people'
          },
          {
            op: 'median',
            field: 'people',
            as: 'mid_box_people'
          },
          {
            op: 'min',
            field: 'people',
            as: 'lower_whisker_people'
          },
          {
            op: 'max',
            field: 'people',
            as: 'upper_whisker_people'
          }
        ],
        groupby: ['age'] // should group by age
      }
    ]);
  });

  it('should produce correct transform groupby for horizontal boxplot with two quantitative axes and specify orientation with orient', () => {
    const output = normalize(
      {
        description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
        data: {url: 'data/population.json'},
        mark: {
          type: 'boxplot',
          orient: 'horizontal',
          extent: 'min-max'
        },
        encoding: {
          y: {field: 'age', type: 'quantitative'},
          x: {
            field: 'people',
            type: 'quantitative',
            axis: {title: 'Population'}
          },
          color: {value: 'skyblue'}
        }
      },
      defaultConfig
    );
    expect(output.transform).toEqual([
      {
        aggregate: [
          {
            op: 'q1',
            field: 'people',
            as: 'lower_box_people'
          },
          {
            op: 'q3',
            field: 'people',
            as: 'upper_box_people'
          },
          {
            op: 'median',
            field: 'people',
            as: 'mid_box_people'
          },
          {
            op: 'min',
            field: 'people',
            as: 'lower_whisker_people'
          },
          {
            op: 'max',
            field: 'people',
            as: 'upper_whisker_people'
          }
        ],
        groupby: ['age'] // group by age
      }
    ]);
  });

  it('should produce correct transform groupby for vertical boxplot with two quantitative axes and specify orientation with aggregate', () => {
    const output = normalize(
      {
        description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
        data: {url: 'data/population.json'},
        mark: {
          type: 'boxplot',
          extent: 'min-max'
        },
        encoding: {
          x: {field: 'age', type: 'quantitative'},
          y: {
            field: 'people',
            type: 'quantitative',
            aggregate: 'boxplot',
            axis: {title: 'Population'}
          },
          color: {value: 'skyblue'}
        }
      },
      defaultConfig
    );
    expect(output.transform).toEqual([
      {
        aggregate: [
          {
            op: 'q1',
            field: 'people',
            as: 'lower_box_people'
          },
          {
            op: 'q3',
            field: 'people',
            as: 'upper_box_people'
          },
          {
            op: 'median',
            field: 'people',
            as: 'mid_box_people'
          },
          {
            op: 'min',
            field: 'people',
            as: 'lower_whisker_people'
          },
          {
            op: 'max',
            field: 'people',
            as: 'upper_whisker_people'
          }
        ],
        groupby: ['age']
      }
    ]);
  });

  it('should produce correct transform groupby for horizontal boxplot with two quantitative axes and specify orientation with aggregate', () => {
    const output = normalize(
      {
        description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
        data: {url: 'data/population.json'},
        mark: {
          type: 'boxplot',
          extent: 'min-max'
        },
        encoding: {
          y: {field: 'age', type: 'quantitative'},
          x: {
            field: 'people',
            type: 'quantitative',
            aggregate: 'boxplot',
            axis: {title: 'Population'}
          },
          color: {value: 'skyblue'}
        }
      },
      defaultConfig
    );
    expect(output.transform).toEqual([
      {
        aggregate: [
          {
            op: 'q1',
            field: 'people',
            as: 'lower_box_people'
          },
          {
            op: 'q3',
            field: 'people',
            as: 'upper_box_people'
          },
          {
            op: 'median',
            field: 'people',
            as: 'mid_box_people'
          },
          {
            op: 'min',
            field: 'people',
            as: 'lower_whisker_people'
          },
          {
            op: 'max',
            field: 'people',
            as: 'upper_whisker_people'
          }
        ],
        groupby: ['age']
      }
    ]);
  });

  it('should produce correct transform for vertical boxplot with min and max', () => {
    const output = normalize(
      {
        description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
        data: {url: 'data/population.json'},
        mark: {
          type: 'boxplot',
          extent: 'min-max'
        },
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {
            field: 'people',
            type: 'quantitative',
            axis: {title: 'Population'}
          },
          color: {value: 'skyblue'}
        }
      },
      defaultConfig
    );

    expect(output.transform).toEqual([
      {
        aggregate: [
          {
            op: 'q1',
            field: 'people',
            as: 'lower_box_people'
          },
          {
            op: 'q3',
            field: 'people',
            as: 'upper_box_people'
          },
          {
            op: 'median',
            field: 'people',
            as: 'mid_box_people'
          },
          {
            op: 'min',
            field: 'people',
            as: 'lower_whisker_people'
          },
          {
            op: 'max',
            field: 'people',
            as: 'upper_whisker_people'
          }
        ],
        groupby: ['age']
      }
    ]);
  });

  it("should not overwrite transform with boxplot's transfroms", () => {
    const outputSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: {
          type: 'boxplot',
          extent: 'min-max'
        },
        transform: [{calculate: 'age * 2', as: 'age2'}],
        encoding: {x: {field: 'age', type: 'ordinal'}, y: {field: 'people', type: 'quantitative', title: 'Population'}}
      },
      defaultConfig
    );

    const transforms: Transform[] = outputSpec.transform;
    expect(transforms).toBeDefined();
    expect(transforms).not.toHaveLength(0);
    expect(transforms[0]).toEqual({calculate: 'age * 2', as: 'age2'});
  });
});

describe('normalizeBoxIQR', () => {
  it('should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation for a 1.5 * IQR whiskers with boxplot mark type', () => {
    const output = normalize(
      {
        description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
        data: {url: 'data/population.json'},
        mark: 'boxplot',
        encoding: {
          x: {field: 'age', type: 'quantitative'},
          y: {
            field: 'people',
            type: 'quantitative',
            title: 'Population'
          },
          color: {value: 'skyblue'}
        }
      },
      defaultConfig
    );

    const outliersUnit = {
      transform: [
        {
          filter:
            '(datum["people"] < datum["lower_box_people"] - 1.5 * (datum["upper_box_people"] - datum["lower_box_people"])) || (datum["people"] > datum["upper_box_people"] + 1.5 * (datum["upper_box_people"] - datum["lower_box_people"]))'
        }
      ],
      mark: {
        type: 'point',
        style: 'boxplot-outliers'
      },
      encoding: {
        x: {field: 'age', type: 'quantitative'},
        y: {
          field: 'people',
          type: 'quantitative'
        }
      }
    };

    const whiskersUnit = {
      transform: [
        {
          filter:
            '(datum["lower_box_people"] - 1.5 * (datum["upper_box_people"] - datum["lower_box_people"]) <= datum["people"]) && (datum["people"] <= datum["upper_box_people"] + 1.5 * (datum["upper_box_people"] - datum["lower_box_people"]))'
        },
        {
          aggregate: [
            {
              as: 'lower_whisker_people',
              field: 'people',
              op: 'min'
            },
            {
              as: 'upper_whisker_people',
              field: 'people',
              op: 'max'
            },
            {
              as: 'lower_box_people',
              field: 'lower_box_people',
              op: 'min'
            },
            {
              as: 'upper_box_people',
              field: 'upper_box_people',
              op: 'max'
            }
          ],
          groupby: ['age']
        }
      ],
      layer: [
        {
          mark: {
            type: 'rule',
            style: 'boxplot-rule'
          },
          encoding: {
            x: {field: 'age', type: 'quantitative'},
            y: {
              field: 'lower_whisker_people',
              type: 'quantitative',
              title: 'Population'
            },
            y2: {
              field: 'lower_box_people'
            }
          }
        },
        {
          mark: {
            type: 'rule',
            style: 'boxplot-rule'
          },
          encoding: {
            x: {field: 'age', type: 'quantitative'},
            y: {
              field: 'upper_box_people',
              type: 'quantitative',
              title: 'Population'
            },
            y2: {
              field: 'upper_whisker_people'
            }
          }
        }
      ]
    };

    const boxUnit = {
      transform: [
        {
          aggregate: [
            {
              op: 'q1',
              field: 'people',
              as: 'lower_box_people'
            },
            {
              op: 'q3',
              field: 'people',
              as: 'upper_box_people'
            },
            {
              op: 'median',
              field: 'people',
              as: 'mid_box_people'
            },
            {
              op: 'min',
              field: 'people',
              as: 'min_people'
            },
            {
              op: 'max',
              field: 'people',
              as: 'max_people'
            }
          ],
          groupby: ['age']
        }
      ],
      layer: [
        {
          mark: {
            type: 'bar',
            style: 'boxplot-box',
            size: 14
          },
          encoding: {
            x: {field: 'age', type: 'quantitative'},
            y: {
              field: 'lower_box_people',
              type: 'quantitative',
              title: 'Population'
            },
            y2: {
              field: 'upper_box_people'
            },
            color: {value: 'skyblue'}
          }
        },
        {
          mark: {
            type: 'tick',
            orient: 'horizontal',
            style: 'boxplot-median',
            color: 'white',
            size: 14
          },
          encoding: {
            x: {field: 'age', type: 'quantitative'},
            y: {
              field: 'mid_box_people',
              type: 'quantitative',
              title: 'Population'
            }
          }
        }
      ]
    };

    expect(output).toMatchObject({
      layer: [
        {
          transform: [
            {
              joinaggregate: [
                {
                  op: 'q1',
                  field: 'people',
                  as: 'lower_box_people'
                },
                {
                  op: 'q3',
                  field: 'people',
                  as: 'upper_box_people'
                }
              ],
              groupby: ['age']
            }
          ],
          layer: [outliersUnit, whiskersUnit]
        },
        boxUnit
      ]
    });
  });

  it('should produce correct layered specs for vertical boxplot with two quantitative axes and use default orientation for a 1.5 * IQR whiskers', () => {
    const partialOutlierUnit = {
      transform: [
        {
          joinaggregate: [
            {
              op: 'q1',
              field: 'people',
              as: 'lower_box_people'
            },
            {
              op: 'q3',
              field: 'people',
              as: 'upper_box_people'
            }
          ],
          groupby: ['age']
        }
      ]
      // omit the rest of spec as they are unnecessary -- we just need to check the join aggregate
    };

    const partialBoxUnit = {
      transform: [
        {
          aggregate: [
            {
              op: 'q1',
              field: 'people',
              as: 'lower_box_people'
            },
            {
              op: 'q3',
              field: 'people',
              as: 'upper_box_people'
            },
            {
              op: 'median',
              field: 'people',
              as: 'mid_box_people'
            },
            {
              op: 'min',
              field: 'people',
              as: 'min_people'
            },
            {
              op: 'max',
              field: 'people',
              as: 'max_people'
            }
          ],
          groupby: ['age']
        }
      ]
      // omit the rest of spec as they are unnecessary -- we just need to check the join aggregate
    };

    const output = normalize(
      {
        description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
        data: {url: 'data/population.json'},
        mark: {
          type: 'boxplot',
          extent: 1.5
        },
        encoding: {
          x: {field: 'age', type: 'quantitative'},
          y: {
            field: 'people',
            type: 'quantitative',
            axis: {title: 'Population'}
          },
          color: {value: 'skyblue'}
        }
      },
      defaultConfig
    );
    expect(output).toMatchObject({
      description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
      data: {url: 'data/population.json'},
      layer: [partialOutlierUnit, partialBoxUnit]
    });
  });

  it('should produce correct layered specs for vertical IQR boxplot where color encodes the mean of the people field', () => {
    const normalizedSpec = normalize(
      {
        description: 'A box plot showing median, min, and max in the US population distribution of age groups in 2000.',
        data: {url: 'data/population.json'},
        mark: {
          type: 'boxplot',
          extent: 1.5
        },
        encoding: {
          x: {field: 'age', type: 'quantitative'},
          y: {
            field: 'people',
            type: 'quantitative',
            title: 'Population'
          },
          color: {
            aggregate: 'mean',
            field: 'people',
            type: 'quantitative',
            title: 'Mean Population'
          }
        }
      },
      defaultConfig
    );

    expect(normalizedSpec['layer'][1].layer[0]).toEqual({
      mark: {
        type: 'bar',
        style: 'boxplot-box',
        size: 14,
        orient: 'vertical',
        invalid: null,
        ariaRoleDescription: 'box'
      },
      encoding: {
        x: {field: 'age', type: 'quantitative'},
        y: {
          field: 'lower_box_people',
          type: 'quantitative',
          title: 'Population'
        },
        y2: {
          field: 'upper_box_people'
        },
        color: {
          field: 'mean_people',
          type: 'quantitative',
          title: 'Mean Population'
        },
        tooltip: [
          {
            field: 'max_people',
            title: 'Max of Population',
            type: 'quantitative'
          },
          {
            field: 'upper_box_people',
            title: 'Q3 of Population',
            type: 'quantitative'
          },
          {
            field: 'mid_box_people',
            title: 'Median of Population',
            type: 'quantitative'
          },
          {
            field: 'lower_box_people',
            title: 'Q1 of Population',
            type: 'quantitative'
          },
          {
            field: 'min_people',
            title: 'Min of Population',
            type: 'quantitative'
          },
          {
            field: 'age',
            type: 'quantitative'
          },
          {
            field: 'mean_people',
            title: 'Mean Population',
            type: 'quantitative'
          }
        ]
      }
    });
  });

  it('should only include custom tooltip without aggregate in outliers layer', () => {
    const normalizedSpecWithTooltip = normalize(
      {
        data: {url: 'data/population.json'},
        mark: 'boxplot',
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {field: 'people', type: 'quantitative'},
          tooltip: {field: 'year', type: 'quantitative'}
        }
      },
      defaultConfig
    );
    const normalizedSpecWithoutTooltip = normalize(
      {
        data: {url: 'data/population.json'},
        mark: 'boxplot',
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {field: 'people', type: 'quantitative'}
        }
      },
      defaultConfig
    );

    expect(normalizedSpecWithTooltip).not.toEqual(normalizedSpecWithoutTooltip);

    const innerLayer = normalizedSpecWithTooltip['layer'][0]['layer'][0];
    const {tooltip, ...encodingWithoutTooltip} = innerLayer['encoding'];
    innerLayer['encoding'] = encodingWithoutTooltip;

    expect(normalizedSpecWithTooltip).toEqual(normalizedSpecWithoutTooltip);
  });

  it('should only include custom tooltip with aggregate in box and whiskers layer', () => {
    const normalizedSpecWithTooltip = normalize(
      {
        data: {url: 'data/population.json'},
        mark: 'boxplot',
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {field: 'people', type: 'quantitative'},
          tooltip: {field: 'people', aggregate: 'mean', type: 'quantitative'}
        }
      },
      defaultConfig
    );

    // There is correct tooltips in whisker layer
    const whiskerLayer = normalizedSpecWithTooltip['layer'][0]['layer'][1];
    for (const whisker of whiskerLayer['layer']) {
      const {tooltip} = whisker['encoding'];
      expect(array(tooltip)).toEqual([
        {
          title: 'Mean of people',
          type: 'quantitative',
          field: 'mean_people'
        }
      ]);
    }

    const whiskerAggregate = whiskerLayer['transform'][1]['aggregate'];
    expect(whiskerLayer['transform'][1]['aggregate'][whiskerAggregate.length - 1]).toEqual({
      op: 'mean',
      as: 'mean_people',
      field: 'people'
    });

    // There is correct tooltips in whisker layer
    const boxLayer = normalizedSpecWithTooltip['layer'][1];
    for (const box of boxLayer['layer']) {
      const {tooltip} = box['encoding'];
      expect(array(tooltip)).toEqual([
        {
          title: 'Mean of people',
          type: 'quantitative',
          field: 'mean_people'
        }
      ]);
    }

    const boxAggregate = boxLayer['transform'][0]['aggregate'];
    const customBoxAggregate = boxAggregate[0];
    expect(customBoxAggregate).toEqual({op: 'mean', as: 'mean_people', field: 'people'});

    // There is no tooltip in outlier layer
    expect(normalizedSpecWithTooltip['layer'][0]['layer'][0]['encoding']['tooltip']).toBeFalsy();
  });

  it('should include custom tooltip with aggregate into box and whiskers layer and custom tooltip without aggregate into outlier layer', () => {
    const normalizedSpecWithTooltip = normalize(
      {
        data: {url: 'data/population.json'},
        mark: 'boxplot',
        encoding: {
          x: {field: 'age', type: 'ordinal'},
          y: {field: 'people', type: 'quantitative'},
          tooltip: [
            {
              field: 'people',
              aggregate: 'mean',
              type: 'quantitative'
            },
            {
              field: 'year',
              type: 'quantitative'
            }
          ]
        }
      },
      defaultConfig
    );

    // There are correct tooltips in whisker layer
    const whiskerLayer = normalizedSpecWithTooltip['layer'][0]['layer'][1];
    for (const whisker of whiskerLayer['layer']) {
      const {tooltip} = whisker['encoding'];
      expect(array(tooltip)).toEqual([
        {
          title: 'Mean of people',
          type: 'quantitative',
          field: 'mean_people'
        }
      ]);
    }

    const whiskerAggregate = whiskerLayer['transform'][1]['aggregate'];
    expect(whiskerLayer['transform'][1]['aggregate'][whiskerAggregate.length - 1]).toEqual({
      op: 'mean',
      as: 'mean_people',
      field: 'people'
    });

    // There are correct tooltips in whisker layer
    const boxLayer = normalizedSpecWithTooltip['layer'][1];
    for (const box of boxLayer['layer']) {
      const {tooltip} = box['encoding'];
      expect(array(tooltip)).toEqual([
        {
          title: 'Mean of people',
          type: 'quantitative',
          field: 'mean_people'
        }
      ]);
    }

    const boxAggregate = boxLayer['transform'][0]['aggregate'];
    const customBoxAggregate = boxAggregate[0];
    expect(customBoxAggregate).toEqual({op: 'mean', as: 'mean_people', field: 'people'});

    // There is correct tooltips in outlier layer
    const {tooltip} = normalizedSpecWithTooltip['layer'][0]['layer'][0]['encoding'];
    expect(tooltip).toEqual({field: 'year', type: 'quantitative'});
  });

  it("should include timeUnit transform in filteredLayerMixins' transform", () => {
    const field = 'Date';
    const timeUnit = 'year';
    const normalizedSpec = normalize(
      {
        data: {url: 'data/population.json'},
        mark: 'boxplot',
        encoding: {
          x: {
            field,
            type: 'temporal',
            timeUnit
          },
          y: {field: 'Anomaly', type: 'quantitative'}
        }
      },
      defaultConfig
    );

    const filteredLayerMixins = normalizedSpec['layer'][1];
    expect(filteredLayerMixins.transform[0]).toEqual({
      timeUnit: {unit: 'year'},
      field,
      as: `${timeUnit}_${field}`
    });
  });
});
