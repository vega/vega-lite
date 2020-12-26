import {normalize} from '../../src/normalize';
import {PathOverlayNormalizer} from '../../src/normalize/pathoverlay';
import {TopLevelSpec} from '../../src/spec';
import {DataMixins} from '../../src/spec/base';
import {TopLevel} from '../../src/spec/toplevel';
import {NormalizedUnitSpec} from '../../src/spec/unit';

describe('PathOverlayNormalizer', () => {
  const pathOverlayNormalizer = new PathOverlayNormalizer();

  it('correctly normalizes line with overlayed point.', () => {
    const spec: TopLevel<NormalizedUnitSpec> & DataMixins = {
      data: {url: 'data/stocks.csv'},
      mark: 'line',
      encoding: {
        x: {field: 'date', type: 'temporal'},
        y: {field: 'price', type: 'quantitative'}
      },
      config: {line: {point: {}}}
    };

    expect(pathOverlayNormalizer.hasMatchingType(spec, spec.config)).toBeTruthy();

    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      data: {url: 'data/stocks.csv'},
      layer: [
        {
          mark: 'line',
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        },
        {
          mark: {type: 'point', opacity: 1, filled: true},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        }
      ],
      config: {line: {point: {}}}
    });
  });

  it('correctly normalizes line with transparent point overlayed.', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/stocks.csv'},
      mark: {type: 'line', point: 'transparent', tooltip: ''},
      encoding: {
        x: {field: 'date', type: 'temporal'},
        y: {field: 'price', type: 'quantitative'}
      }
    };
    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      data: {url: 'data/stocks.csv'},
      layer: [
        {
          mark: {type: 'line', tooltip: ''},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        },
        {
          mark: {type: 'point', opacity: 0, filled: true, tooltip: ''},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        }
      ]
    });
  });

  it('correctly normalizes line with point overlayed via mark definition.', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/stocks.csv'},
      mark: {type: 'line', point: {color: 'red'}},
      encoding: {
        x: {field: 'date', type: 'temporal'},
        y: {field: 'price', type: 'quantitative'}
      }
    };
    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      data: {url: 'data/stocks.csv'},
      layer: [
        {
          mark: 'line',
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        },
        {
          mark: {type: 'point', opacity: 1, filled: true, color: 'red'},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        }
      ]
    });
  });

  it('correctly normalizes faceted line plots with overlayed point.', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/stocks.csv'},
      mark: 'line',
      encoding: {
        row: {field: 'symbol', type: 'nominal'},
        x: {field: 'date', type: 'temporal'},
        y: {field: 'price', type: 'quantitative'}
      },
      config: {line: {point: {}}}
    };
    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      data: {url: 'data/stocks.csv'},
      facet: {
        row: {field: 'symbol', type: 'nominal'}
      },
      spec: {
        layer: [
          {
            mark: 'line',
            encoding: {
              x: {field: 'date', type: 'temporal'},
              y: {field: 'price', type: 'quantitative'}
            }
          },
          {
            mark: {type: 'point', opacity: 1, filled: true},
            encoding: {
              x: {field: 'date', type: 'temporal'},
              y: {field: 'price', type: 'quantitative'}
            }
          }
        ]
      },
      config: {line: {point: {}}}
    });
  });

  it('correctly normalizes area with overlay line and point', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/stocks.csv'},
      mark: 'area',
      encoding: {
        x: {field: 'date', type: 'temporal'},
        y: {field: 'price', type: 'quantitative'}
      },
      config: {area: {line: {}, point: {}}}
    };
    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      data: {url: 'data/stocks.csv'},
      layer: [
        {
          mark: {type: 'area', opacity: 0.7},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        },
        {
          mark: {type: 'line'},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative', stack: 'zero'}
          }
        },
        {
          mark: {type: 'point', opacity: 1, filled: true},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative', stack: 'zero'}
          }
        }
      ],
      config: {area: {line: {}, point: {}}}
    });
  });

  it('correctly normalizes interpolated area with overlay line', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/stocks.csv'},
      mark: {type: 'area', interpolate: 'monotone'},
      encoding: {
        x: {field: 'date', type: 'temporal'},
        y: {field: 'price', type: 'quantitative'}
      },
      config: {area: {line: {}}}
    };
    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      data: {url: 'data/stocks.csv'},
      layer: [
        {
          mark: {type: 'area', opacity: 0.7, interpolate: 'monotone'},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        },
        {
          mark: {type: 'line', interpolate: 'monotone'},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative', stack: 'zero'}
          }
        }
      ],
      config: {area: {line: {}}}
    });
  });

  it('correctly normalizes area with overlay point and line disabled in config.', () => {
    for (const overlay of [null, false]) {
      const spec: TopLevelSpec = {
        data: {url: 'data/stocks.csv'},
        mark: 'area',
        encoding: {
          x: {field: 'date', type: 'temporal'},
          y: {field: 'price', type: 'quantitative'}
        },
        config: {
          area: {point: overlay, line: overlay}
        }
      };
      const normalizedSpec = normalize(spec);
      expect(normalizedSpec).toEqual({
        data: {url: 'data/stocks.csv'},
        mark: 'area',
        encoding: {
          x: {field: 'date', type: 'temporal'},
          y: {field: 'price', type: 'quantitative'}
        },
        config: {
          area: {point: overlay, line: overlay}
        }
      });
    }
  });

  it('correctly normalizes stacked area with overlay line', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/stocks.csv'},
      mark: 'area',
      encoding: {
        x: {field: 'date', type: 'temporal'},
        y: {aggregate: 'sum', field: 'price', type: 'quantitative'},
        color: {field: 'symbol', type: 'nominal'}
      },
      config: {area: {line: {}}}
    };
    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      data: {url: 'data/stocks.csv'},
      layer: [
        {
          mark: {type: 'area', opacity: 0.7},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {aggregate: 'sum', field: 'price', type: 'quantitative'},
            color: {field: 'symbol', type: 'nominal'}
          }
        },
        {
          mark: {type: 'line'},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {aggregate: 'sum', field: 'price', type: 'quantitative', stack: 'zero'},
            color: {field: 'symbol', type: 'nominal'}
          }
        }
      ],
      config: {area: {line: {}}}
    });
  });

  it('correctly normalizes streamgraph with overlay line', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/stocks.csv'},
      mark: 'area',
      encoding: {
        x: {field: 'date', type: 'temporal'},
        y: {aggregate: 'sum', field: 'price', type: 'quantitative', stack: 'center'},
        color: {field: 'symbol', type: 'nominal'}
      },
      config: {area: {line: {}}}
    };

    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      data: {url: 'data/stocks.csv'},
      layer: [
        {
          mark: {type: 'area', opacity: 0.7},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {aggregate: 'sum', field: 'price', type: 'quantitative', stack: 'center'},
            color: {field: 'symbol', type: 'nominal'}
          }
        },
        {
          mark: {type: 'line'},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {aggregate: 'sum', field: 'price', type: 'quantitative', stack: 'center'},
            color: {field: 'symbol', type: 'nominal'}
          }
        }
      ],
      config: {area: {line: {}}}
    });
  });

  it('correctly normalizes opacity for area with line', () => {
    const spec: TopLevelSpec = {
      data: {url: 'data/stocks.csv'},
      mark: {
        type: 'area',
        line: true,
        opacity: 1,
        color: 'red'
      },
      encoding: {
        x: {field: 'date', type: 'temporal'},
        y: {field: 'price', type: 'quantitative'}
      }
    };

    const normalizedSpec = normalize(spec);
    expect(normalizedSpec).toEqual({
      data: {url: 'data/stocks.csv'},
      layer: [
        {
          mark: {type: 'area', opacity: 1, color: 'red'},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative'}
          }
        },
        {
          mark: {type: 'line'},
          encoding: {
            x: {field: 'date', type: 'temporal'},
            y: {field: 'price', type: 'quantitative', stack: 'zero'}
          }
        }
      ]
    });
  });
});
