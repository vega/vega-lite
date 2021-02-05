import {normalize} from '../../src';
import {NormalizerParams} from '../../src/normalize';
import {SelectionCompatibilityNormalizer} from '../../src/normalize/selectioncompat';
import {NormalizedUnitSpec} from '../../src/spec';

const normParams: NormalizerParams = {config: {}, emptySelections: {}, selectionPredicates: {}};
const selectionCompatNormalizer = new SelectionCompatibilityNormalizer();
const unit: NormalizedUnitSpec = {
  data: {url: 'data/cars.json'},
  mark: 'point',
  encoding: {
    x: {field: 'Horsepower', type: 'quantitative'},
    y: {field: 'Miles_per_Gallon', type: 'quantitative'}
  }
};

describe('SelectionCompatibilityNormalizer', () => {
  it('should normalize "single" selections', () => {
    const spec: any = {
      ...unit,
      selection: {
        CylYr: {
          type: 'single',
          fields: ['Cylinders', 'Year'],
          init: {Cylinders: 4, Year: 1977},
          bind: {input: 'range', step: 1},
          nearest: true
        }
      }
    };

    const normedUnit = selectionCompatNormalizer.mapUnit(spec, normParams);
    expect(normedUnit.selection).toBeUndefined();
    expect(normedUnit.params).toHaveLength(1);
    expect(normedUnit.params[0]).toHaveProperty('name', 'CylYr');
    expect(normedUnit.params[0]).toHaveProperty('value', {Cylinders: 4, Year: 1977});
    expect(normedUnit.params[0]).toHaveProperty('bind', {input: 'range', step: 1});
    expect(normedUnit.params[0]).toHaveProperty('select', {
      type: 'point',
      fields: ['Cylinders', 'Year'],
      toggle: false,
      nearest: true
    });
  });

  it('should normalize "multi" selections', () => {
    const spec: any = {
      ...unit,
      selection: {
        Org: {
          type: 'multi',
          fields: ['Origin'],
          init: {Origin: 'Japan'},
          bind: 'legend'
        }
      }
    };

    const normedUnit = selectionCompatNormalizer.mapUnit(spec, normParams);
    expect(normedUnit.selection).toBeUndefined();
    expect(normedUnit.params).toHaveLength(1);
    expect(normedUnit.params[0]).toHaveProperty('name', 'Org');
    expect(normedUnit.params[0]).toHaveProperty('value', {Origin: 'Japan'});
    expect(normedUnit.params[0]).toHaveProperty('bind', 'legend');
    expect(normedUnit.params[0]).toHaveProperty('select', {
      type: 'point',
      fields: ['Origin']
    });
  });

  it('should normalize "interval" selections', () => {
    const spec: any = {
      ...unit,
      selection: {
        brush: {
          type: 'interval',
          init: {x: [55, 160], y: [13, 37]}
        },
        grid: {
          type: 'interval',
          bind: 'scales'
        }
      }
    };

    const normedUnit = selectionCompatNormalizer.mapUnit(spec, normParams);
    expect(normedUnit.selection).toBeUndefined();
    expect(normedUnit.params).toHaveLength(2);
    expect(normedUnit.params[0]).toHaveProperty('name', 'brush');
    expect(normedUnit.params[1]).toHaveProperty('name', 'grid');
    expect(normedUnit.params[0]).toHaveProperty('value', {x: [55, 160], y: [13, 37]});
    expect(normedUnit.params[1]).toHaveProperty('bind', 'scales');
  });

  it('should normalize selection predicates', () => {
    const spec: any = {
      data: {url: 'data/cars.json'},
      transform: [
        {filter: {selection: 'foo'}},
        {filter: {selection: {and: ['foo', 'bar']}}},
        {filter: {or: [{selection: {not: 'foo'}}, 'false']}}
      ],
      selection: {
        foo: {type: 'single', empty: 'all'},
        bar: {type: 'multi', empty: 'none'},
        brush: {type: 'interval'}
      },
      mark: 'line',
      encoding: {
        x: {
          field: 'Horsepower',
          type: 'quantitative',
          condition: {
            selection: 'bar',
            value: 5
          }
        },
        y: {
          value: 10,
          condition: {
            selection: {or: ['foo', 'brush']},
            field: 'Miles_per_Gallon',
            type: 'quantitative'
          }
        },
        color: {
          condition: {
            test: {and: [{selection: {not: 'foo'}}, 'true']},
            field: 'Cylinders',
            type: 'ordinal'
          },
          value: 'grey'
        },
        strokeWidth: {
          condition: [
            {
              test: {
                and: [{selection: 'foo'}, 'length(data("foo_store"))']
              },
              value: 2
            },
            {selection: 'bar', value: 1}
          ],
          value: 0
        }
      }
    };

    const normalized = normalize(spec) as any;
    expect(normalized.transform).toEqual(
      expect.arrayContaining([
        {filter: {param: 'foo', empty: true}},
        {
          filter: {
            and: [
              {param: 'foo', empty: true},
              {param: 'bar', empty: false}
            ]
          }
        },
        {filter: {or: [{not: {param: 'foo', empty: true}}, 'false']}}
      ])
    );
    expect(normalized.encoding.x.condition.test).toEqual({param: 'bar', empty: false});
    expect(normalized.encoding.y.condition.test).toEqual({
      or: [
        {param: 'foo', empty: true},
        {param: 'brush', empty: true}
      ]
    });
    expect(normalized.encoding.color.condition.test).toEqual({
      and: [{not: {param: 'foo', empty: true}}, 'true']
    });
    expect(normalized.encoding.strokeWidth.condition).toEqual([
      {
        value: 2,
        test: {and: [{param: 'foo', empty: true}, 'length(data("foo_store"))']}
      },
      {
        value: 1,
        test: {param: 'bar', empty: false}
      }
    ]);

    // And make sure we didn't delete any properties by mistake
    expect(normalized.encoding.x).toHaveProperty('field', 'Horsepower');
    expect(normalized.encoding.x).toHaveProperty('type', 'quantitative');
    expect(normalized.encoding.x).toHaveProperty('condition.value', 5);
    expect(normalized.encoding.y).toHaveProperty('value', 10);
    expect(normalized.encoding.y).toHaveProperty('condition.field', 'Miles_per_Gallon');
    expect(normalized.encoding.y).toHaveProperty('condition.type', 'quantitative');
    expect(normalized.encoding.color).toHaveProperty('value', 'grey');
    expect(normalized.encoding.color).toHaveProperty('condition.field', 'Cylinders');
    expect(normalized.encoding.color).toHaveProperty('condition.type', 'ordinal');
  });

  it('should normalize bin extents', () => {
    const spec: any = {
      data: {url: 'data/cars.json'},
      transform: [
        {bin: true, field: 'Horsepower', as: 'bin_HP'},
        {bin: {extent: {selection: 'foo'}, nice: true}, field: 'Miles_per_Gallon', as: 'bin_MPG'},
        {bin: {extent: {selection: 'bar', field: 'Accl'}, nice: false}, field: 'Acceleration', as: 'bin_Accl'}
      ],
      selection: {
        foo: {type: 'single'},
        bar: {type: 'multi'},
        brush: {type: 'interval'}
      },
      mark: 'line',
      encoding: {
        x: {
          field: 'Horsepower',
          type: 'quantitative',
          bin: true
        },
        y: {
          field: 'Miles_per_Gallon',
          type: 'quantitative',
          bin: {extent: {selection: 'foo'}, nice: true}
        },
        color: {
          field: 'Acceleration',
          type: 'quantitative',
          bin: {extent: {selection: 'foo', encoding: 'x'}, nice: false}
        },
        size: {
          value: 50,
          condition: {
            selection: 'bar',
            field: 'Displacement',
            type: 'quantitative',
            bin: true
          }
        },
        opacity: {
          value: 1,
          condition: {
            selection: 'foo',
            field: 'Weight_in_lbs',
            type: 'quantitative',
            bin: {extent: {selection: 'brush', field: 'Lbs'}, nice: true}
          }
        }
      }
    };

    const normalized = normalize(spec) as any;
    expect(normalized.transform).toEqual(
      expect.arrayContaining([
        {bin: true, field: 'Horsepower', as: 'bin_HP'},
        {bin: {extent: {param: 'foo'}, nice: true}, field: 'Miles_per_Gallon', as: 'bin_MPG'},
        {bin: {extent: {param: 'bar', field: 'Accl'}, nice: false}, field: 'Acceleration', as: 'bin_Accl'}
      ])
    );

    expect(normalized.encoding.x.bin).toEqual(true);
    expect(normalized.encoding.y.bin).toEqual({extent: {param: 'foo'}, nice: true});
    expect(normalized.encoding.color.bin).toEqual({extent: {param: 'foo', encoding: 'x'}, nice: false});
    expect(normalized.encoding.size.condition.bin).toEqual(true);
    expect(normalized.encoding.opacity.condition.bin).toEqual({extent: {param: 'brush', field: 'Lbs'}, nice: true});
  });

  it('should normalize scale domains', () => {
    const spec: any = {
      data: {url: 'data/cars.json'},
      selection: {
        foo: {type: 'single'},
        bar: {type: 'multi'},
        brush: {type: 'interval'}
      },
      mark: 'line',
      encoding: {
        x: {
          field: 'Horsepower',
          type: 'quantitative',
          scale: {domain: {selection: 'brush'}, reverse: true}
        },
        y: {
          field: 'Miles_per_Gallon',
          type: 'quantitative',
          scale: {domain: {selection: 'bar', field: 'MPG'}, round: true}
        },
        size: {
          value: 50,
          condition: {
            selection: 'bar',
            field: 'Displacement',
            type: 'quantitative',
            scale: {domain: {selection: 'foo'}, reverse: true}
          }
        },
        opacity: {
          value: 1,
          condition: {
            selection: 'foo',
            field: 'Weight_in_lbs',
            type: 'quantitative',
            scale: {domain: {selection: 'foo', encoding: 'y'}, round: true}
          }
        }
      }
    };

    const normalized = normalize(spec) as any;
    expect(normalized.encoding.x.scale).toEqual({domain: {param: 'brush'}, reverse: true});
    expect(normalized.encoding.y.scale).toEqual({domain: {param: 'bar', field: 'MPG'}, round: true});
    expect(normalized.encoding.size.condition.scale).toEqual({domain: {param: 'foo'}, reverse: true});
    expect(normalized.encoding.opacity.condition.scale).toEqual({domain: {param: 'foo', encoding: 'y'}, round: true});
  });

  it('should normalize lookups', () => {
    const spec: any = {
      data: {url: 'data/cars.json'},
      transform: [
        {
          lookup: 'person',
          from: {
            data: {url: 'data/lookup_people.csv'},
            key: 'name',
            fields: ['age', 'height']
          }
        },
        {
          lookup: 'symbol',
          from: {selection: 'index', key: 'symbol'},
          default: 5
        }
      ],
      selection: {
        foo: {type: 'single'},
        bar: {type: 'multi'},
        brush: {type: 'interval'}
      },
      mark: 'line',
      encoding: {
        x: {
          field: 'Horsepower',
          type: 'quantitative'
        },
        y: {
          field: 'Miles_per_Gallon',
          type: 'quantitative'
        }
      }
    };

    const normalized = normalize(spec) as any;
    expect(normalized.transform).toEqual(
      expect.arrayContaining([
        {
          lookup: 'person',
          from: {
            data: {url: 'data/lookup_people.csv'},
            key: 'name',
            fields: ['age', 'height']
          }
        },
        {
          lookup: 'symbol',
          from: {param: 'index', key: 'symbol'},
          default: 5
        }
      ])
    );
  });

  it('should be the first normalizer run', () => {
    const spec: any = {
      data: {url: 'data/cars.json'},
      selection: {
        brush: {
          type: 'interval',
          init: {x: [55, 160], y: [13, 37]}
        }
      },
      mark: {type: 'line', point: true},
      encoding: {
        row: {field: 'Origin', type: 'nominal'},
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        color: {
          condition: {selection: 'brush', field: 'Cylinders', type: 'ordinal'},
          value: 'grey'
        }
      }
    };

    const normalized = normalize(spec) as any;
    expect(normalized.spec.layer[0]).toHaveProperty('params');
    expect(normalized.spec.layer[0].params[0].name).toEqual('brush');
  });

  it('should normalize multi-views', () => {
    const spec: any = {
      data: {url: 'data/stocks.csv'},
      encoding: {
        color: {
          condition: {
            selection: 'hover',
            field: 'symbol',
            type: 'nominal'
          },
          value: 'grey'
        }
      },
      layer: [
        {
          encoding: {
            x: {field: 'date', type: 'temporal', title: 'date'},
            y: {field: 'price', type: 'quantitative', title: 'price'}
          },
          layer: [
            {
              selection: {
                hover: {
                  type: 'single',
                  on: 'mouseover',
                  empty: 'all',
                  fields: ['symbol'],
                  init: {symbol: 'AAPL'}
                }
              },
              mark: {type: 'line', strokeWidth: 8, stroke: 'transparent'}
            },
            {
              mark: 'line'
            }
          ]
        },
        {
          mark: {type: 'circle'},
          encoding: {
            x: {aggregate: 'max', field: 'date', type: 'temporal'},
            y: {aggregate: {argmax: 'date'}, field: 'price', type: 'quantitative'}
          }
        }
      ]
    };

    expect(normalize(spec)).toEqual({
      data: {url: 'data/stocks.csv'},
      layer: [
        {
          layer: [
            {
              mark: {type: 'line', strokeWidth: 8, stroke: 'transparent'},
              params: [
                {
                  name: 'hover',
                  value: {symbol: 'AAPL'},
                  select: {
                    type: 'point',
                    on: 'mouseover',
                    fields: ['symbol'],
                    toggle: false
                  }
                }
              ],
              encoding: {
                color: {
                  condition: {
                    field: 'symbol',
                    type: 'nominal',
                    test: {param: 'hover', empty: true}
                  },
                  value: 'grey'
                },
                x: {field: 'date', type: 'temporal', title: 'date'},
                y: {field: 'price', type: 'quantitative', title: 'price'}
              }
            },
            {
              mark: 'line',
              encoding: {
                color: {
                  condition: {
                    field: 'symbol',
                    type: 'nominal',
                    test: {param: 'hover', empty: true}
                  },
                  value: 'grey'
                },
                x: {field: 'date', type: 'temporal', title: 'date'},
                y: {field: 'price', type: 'quantitative', title: 'price'}
              }
            }
          ]
        },
        {
          mark: {type: 'circle'},
          encoding: {
            color: {
              condition: {
                field: 'symbol',
                type: 'nominal',
                test: {param: 'hover', empty: true}
              },
              value: 'grey'
            },
            x: {aggregate: 'max', field: 'date', type: 'temporal'},
            y: {
              aggregate: {argmax: 'date'},
              field: 'price',
              type: 'quantitative'
            }
          }
        }
      ]
    });
  });
});
