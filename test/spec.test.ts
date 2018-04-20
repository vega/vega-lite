/* tslint:disable:quotemark */
import {assert} from 'chai';

import {Field, FieldDef} from '../src/fielddef';
import {LocalLogger} from '../src/log';
import * as log from '../src/log';
import {fieldDefs, normalize, NormalizedSpec, TopLevel, TopLevelSpec} from '../src/spec';
import {defaultConfig, initConfig} from './../src/config';

// describe('isStacked()') -- tested as part of stackOffset in stack.test.ts

describe('normalize()', function () {
  describe('normalizeFacetedUnit', () => {
    it('should convert single extended spec with column into a composite spec', function() {
      const spec: any = {
        "name": "faceted",
        "width": 123,
        "height": 234,
        "description": "faceted spec",
        "data": {"url": "data/movies.json"},
        "mark": "point",
        "encoding": {
          "column": {"field": "MPAA_Rating","type": "ordinal"},
          "x": {"field": "Worldwide_Gross","type": "quantitative"},
          "y": {"field": "US_DVD_Sales","type": "quantitative"}
        }
      };
      const config = initConfig(spec.config);
      assert.deepEqual(normalize(spec, config), {
        "name": "faceted",
        "description": "faceted spec",
        "data": {"url": "data/movies.json"},
        "facet": {
          "column": {"field": "MPAA_Rating","type": "ordinal"}
        },
        "spec": {
          "mark": "point",
          "width": 123,
          "height": 234,
          "encoding": {
            "x": {"field": "Worldwide_Gross","type": "quantitative"},
            "y": {"field": "US_DVD_Sales","type": "quantitative"}
          }
        }
      });
    });

    it('should convert single extended spec with row into a composite spec', function() {
      const spec: any = {
        "data": {"url": "data/movies.json"},
        "mark": "point",
        "encoding": {
          "row": {"field": "MPAA_Rating","type": "ordinal"},
          "x": {"field": "Worldwide_Gross","type": "quantitative"},
          "y": {"field": "US_DVD_Sales","type": "quantitative"}
        }
      };

      const config = initConfig(spec.config);
      assert.deepEqual(normalize(spec, config), {
        "data": {"url": "data/movies.json"},
        "facet": {
          "row": {"field": "MPAA_Rating","type": "ordinal"}
        },
        "spec": {
          "mark": "point",
          "encoding": {
            "x": {"field": "Worldwide_Gross","type": "quantitative"},
            "y": {"field": "US_DVD_Sales","type": "quantitative"}
          }
        }
      });
    });
  });

  describe('normalizeFacet', () => {
    it('should produce correct layered specs for mean point and vertical error bar', () => {
      assert.deepEqual(normalize({
        "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [{"filter": "datum.year == 2000"}],
        facet: {
          "row": {"field": "MPAA_Rating","type": "ordinal"}
        },
        spec: {
          layer: [
            {
              "mark": "point",
              "encoding": {
                "x": {"field": "age","type": "ordinal"},
                "y": {
                  "aggregate": "mean",
                  "field": "people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                },
                "size": {"value": 2}
              }
            },
            {
              mark: 'error-bar',
              encoding: {
                "x": {"field": "age","type": "ordinal"},
                "y": {
                  "aggregate": "min",
                  "field": "people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                },
                "y2": {
                  "aggregate": "max",
                  "field": "people",
                  "type": "quantitative"
                },
                "size": {"value": 5}
              }
            }
          ]
        }
      }, defaultConfig), {
        "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
        "data": {"url": "data/population.json"},
        "transform": [{"filter": "datum.year == 2000"}],
        facet: {
          "row": {"field": "MPAA_Rating","type": "ordinal"}
        },
        spec: {
          layer: [
            {
              "mark": "point",
              "encoding": {
                "x": {"field": "age","type": "ordinal"},
                "y": {
                  "aggregate": "mean",
                  "field": "people",
                  "type": "quantitative",
                  "axis": {"title": "population"}
                },
                "size": {"value": 2}
              }
            },
            {
              "layer": [
                {
                  "mark": "rule",
                  "encoding": {
                    "x": {"field": "age","type": "ordinal"},
                    "y": {
                      "aggregate": "min",
                      "field": "people",
                      "type": "quantitative",
                      "axis": {"title": "population"}
                    },
                    "y2": {
                      "aggregate": "max",
                      "field": "people",
                      "type": "quantitative"
                    }
                  }
                },
                {
                  "mark": "tick",
                  "encoding": {
                    "x": {"field": "age","type": "ordinal"},
                    "y": {
                      "aggregate": "min",
                      "field": "people",
                      "type": "quantitative",
                      "axis": {"title": "population"}
                    },
                    "size": {"value": 5}
                  }
                },
                {
                  "mark": "tick",
                  "encoding": {
                    "x": {"field": "age","type": "ordinal"},
                    "y": {
                      "aggregate": "max",
                      "field": "people",
                      "type": "quantitative",
                      // "axis": {"title": "population"}
                    },
                    "size": {"value": 5}
                  }
                }
              ]
            }
          ]
        }
      });
    });
  });

  describe('normalizeLayer', () => {
    it('correctly passes shared projection and encoding to children of layer', () => {
      const output = normalize({
        "data": {"url": "data/population.json"},
        "projection": {"type": "mercator"},
        "encoding": {
          "x": {"field": "age", "type": "ordinal"}
        },
        "layer": [
          {"mark": "point"},
          {
            "layer": [
              {"mark": "rule"},
              {
                "mark": "text",
                "encoding": {
                  "text": {"field": "a", "type": "nominal"}
                }
              }
            ]
          }
        ]
      }, defaultConfig);

      assert.deepEqual(output, {
        "data": {"url": "data/population.json"},
        layer: [
          {
            "projection": {"type": "mercator"},
            "mark": "point",
            "encoding": {
              "x": {"field": "age", "type": "ordinal"}
            }
          },
          {
            "layer": [
              {
                "projection": {"type": "mercator"},
                "mark": "rule",
                "encoding": {
                  "x": {"field": "age", "type": "ordinal"}
                }
              },
              {
                "projection": {"type": "mercator"},
                "mark": "text",
                "encoding": {
                  "x": {"field": "age", "type": "ordinal"},
                  "text": {"field": "a", "type": "nominal"}
                }
              }
            ]
          }
        ]
      });
    });


    it('correctly overrides shared projection and encoding and throws warnings', log.wrap((localLogger: LocalLogger) => {
      const output = normalize({
        "data": {"url": "data/population.json"},
        "projection": {"type": "mercator"},
        "encoding": {
          "x": {"field": "age", "type": "ordinal"}
        },
        "layer": [
          {
            "projection": {"type": "albersUsa"},
            "mark": "rule"
          },
          {
            "mark": "text",
            "encoding": {
              "x": {"field": "a", "type": "nominal"}
            }
          }
        ]
      }, defaultConfig);

      assert.equal(localLogger.warns.length, 2);

      assert.equal(localLogger.warns[0], log.message.projectionOverridden({
        parentProjection: {"type": "mercator"},
        projection: {"type": "albersUsa"}
      }));

      assert.equal(localLogger.warns[1], log.message.encodingOverridden(['x']));

      assert.deepEqual(output, {
        "data": {"url": "data/population.json"},
        layer: [
          {
            "projection": {"type": "albersUsa"},
            "mark": "rule",
            "encoding": {
              "x": {"field": "age", "type": "ordinal"}
            }
          },
          {
            "projection": {"type": "mercator"},
            "mark": "text",
            "encoding": {
              "x": {"field": "a", "type": "nominal"},
            }
          }
        ]
      });
    }));

    it('should produce correct layered specs for mean point and vertical error bar', () => {
      assert.deepEqual(normalize({
        "data": {"url": "data/population.json"},
        layer: [
          {
            "mark": "point",
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "mean",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "size": {"value": 2}
            }
          },
          {
            mark: 'error-bar',
            encoding: {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "min",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "y2": {
                "aggregate": "max",
                "field": "people",
                "type": "quantitative"
              },
              "size": {"value": 5}
            }
          }
        ]
      }, defaultConfig), {
        "data": {"url": "data/population.json"},
        layer: [
          {
            "mark": "point",
            "encoding": {
              "x": {"field": "age","type": "ordinal"},
              "y": {
                "aggregate": "mean",
                "field": "people",
                "type": "quantitative",
                "axis": {"title": "population"}
              },
              "size": {"value": 2}
            }
          },
          {
            "layer": [
              {
                "mark": "rule",
                "encoding": {
                  "x": {"field": "age","type": "ordinal"},
                  "y": {
                    "aggregate": "min",
                    "field": "people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "y2": {
                    "aggregate": "max",
                    "field": "people",
                    "type": "quantitative"
                  }
                }
              },
              {
                "mark": "tick",
                "encoding": {
                  "x": {"field": "age","type": "ordinal"},
                  "y": {
                    "aggregate": "min",
                    "field": "people",
                    "type": "quantitative",
                    "axis": {"title": "population"}
                  },
                  "size": {"value": 5}
                }
              },
              {
                "mark": "tick",
                "encoding": {
                  "x": {"field": "age","type": "ordinal"},
                  "y": {
                    "aggregate": "max",
                    "field": "people",
                    "type": "quantitative",
                    // "axis": {"title": "population"}
                  },
                  "size": {"value": 5}
                }
              }
            ]
          }
        ]
      });
    });
  });

  describe('normalizeOverlay', () => {
    it('correctly normalizes line with overlayed point.', () => {
      const spec: TopLevelSpec = {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "mark": "line",
        "encoding": {
          "x": {"field": "date", "type": "temporal"},
          "y": {"field": "price", "type": "quantitative"}
        },
        "config": {"line": {"point": {}}}
      };
      const normalizedSpec = normalize(spec, spec.config);
      assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "layer": [
          {
            "mark": "line",
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"}
            }
          },
          {
            "mark": {"type": "point", "opacity": 1, "filled": true},
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"}
            }
          }
        ],
        "config": {"line": {"point": {}}}
      });
    });

    it('correctly normalizes line with transparent point overlayed.', () => {
      const spec: TopLevelSpec = {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "mark": {"type": "line", "point": "transparent"},
        "encoding": {
          "x": {"field": "date", "type": "temporal"},
          "y": {"field": "price", "type": "quantitative"}
        }
      };
      const normalizedSpec = normalize(spec, spec.config);
      assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "layer": [
          {
            "mark": "line",
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"}
            }
          },
          {
            "mark": {"type": "point", "opacity": 0, "filled": true},
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"}
            }
          }
        ]
      });
    });

    it('correctly normalizes line with point overlayed via mark definition.', () => {
      const spec: TopLevelSpec = {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "mark": {"type": "line", "point": {"color": "red"}},
        "encoding": {
          "x": {"field": "date", "type": "temporal"},
          "y": {"field": "price", "type": "quantitative"}
        }
      };
      const normalizedSpec = normalize(spec, spec.config);
      assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "layer": [
          {
            "mark": "line",
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"}
            }
          },
          {
            "mark": {"type": "point", "opacity": 1, "filled": true, "color": "red"},
            "encoding": {
              "x": {"field": "date", "type": "temporal"},
              "y": {"field": "price", "type": "quantitative"}
            }
          }
        ]
      });
    });

    it('correctly normalizes faceted line plots with overlayed point.', () => {
      const spec: TopLevelSpec = {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "mark": "line",
        "encoding": {
          "row": {"field": "symbol", "type": "nominal"},
          "x": {"field": "date", "type": "temporal"},
          "y": {"field": "price", "type": "quantitative"}
        },
        "config": {"line": {"point": {}}}
      };
      const normalizedSpec = normalize(spec, spec.config);
      assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "facet": {
          "row": {"field": "symbol", "type": "nominal"},
        },
        "spec": {
          "layer": [
            {
              "mark": "line",
              "encoding": {
                "x": {"field": "date", "type": "temporal"},
                "y": {"field": "price", "type": "quantitative"}
              }
            },
            {
              "mark": {"type": "point", "opacity": 1, "filled": true},
              "encoding": {
                "x": {"field": "date", "type": "temporal"},
                "y": {"field": "price", "type": "quantitative"}
              }
            }
          ],
        },
        "config": {"line": {"point": {}}}
      });
    });

    it('correctly normalizes area with overlay line and point', () => {
      const spec: TopLevelSpec = {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "mark": "area",
        "encoding": {
          "x": {"field": "date", "type": "temporal"},
          "y": {"field": "price", "type": "quantitative"}
        },
        "config": {"area": {"line": {}, "point": {}}}
      };
      const normalizedSpec = normalize(spec, spec.config);
      assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
        "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
        "layer": [
          {
            "mark": "area",
            "encoding": {
              "x": {"field": "date","type": "temporal"},
              "y": {"field": "price","type": "quantitative"}
            }
          },
          {
            "mark": {"type": "line"},
            "encoding": {
              "x": {"field": "date","type": "temporal"},
              "y": {"field": "price","type": "quantitative"}
            }
          },
          {
            "mark": {"type": "point", "opacity": 1, "filled": true},
            "encoding": {
              "x": {"field": "date","type": "temporal"},
              "y": {"field": "price","type": "quantitative"}
            }
          }
        ],
        "config": {"area": {"line": {}, "point": {}}}
      });
    });

    it('correctly normalizes area with overlay line', () => {
      const spec: TopLevelSpec = {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "mark": "area",
        "encoding": {
          "x": {"field": "date", "type": "temporal"},
          "y": {"field": "price", "type": "quantitative"}
        },
        "config": {"area": {"line": {}}}
      };
      const normalizedSpec = normalize(spec, spec.config);
      assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
        "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
        "layer": [
          {
            "mark": "area",
            "encoding": {
              "x": {"field": "date","type": "temporal"},
              "y": {"field": "price","type": "quantitative"}
            }
          },
          {
            "mark": {"type": "line"},
            "encoding": {
              "x": {"field": "date","type": "temporal"},
              "y": {"field": "price","type": "quantitative"}
            }
          }
        ],
        "config": {"area": {"line": {}}}
      });
    });

    it('correctly normalizes area with disabled overlay point and line.', () => {
      for (const overlay of [null, false]) {
        const spec: TopLevelSpec = {
          "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
          "mark": {"type": "area", "point": overlay, "line": overlay},
          "encoding": {
            "x": {"field": "date", "type": "temporal"},
            "y": {"field": "price", "type": "quantitative"}
          }
        };
        const normalizedSpec = normalize(spec, spec.config);
        assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
          "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
          "mark": "area",
          "encoding": {
            "x": {"field": "date", "type": "temporal"},
            "y": {"field": "price", "type": "quantitative"}
          }
        });
      }
    });

    it('correctly normalizes area with overlay point and line disabled in config.', () => {
      for (const overlay of [null, false]) {
        const spec: TopLevelSpec = {
          "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
          "mark": {"type": "area"},
          "encoding": {
            "x": {"field": "date", "type": "temporal"},
            "y": {"field": "price", "type": "quantitative"}
          },
          "config": {
            "area": {"point": overlay, "line": overlay}
          }
        };
        const normalizedSpec = normalize(spec, spec.config);
        assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
          "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
          "mark": "area",
          "encoding": {
            "x": {"field": "date", "type": "temporal"},
            "y": {"field": "price", "type": "quantitative"}
          },
          "config": {
            "area": {"point": overlay, "line": overlay}
          }
        });
      }
    });

    it('correctly normalizes stacked area with overlay line', () => {
      const spec: TopLevelSpec = {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "mark": "area",
        "encoding": {
          "x": {"field": "date", "type": "temporal"},
          "y": {"aggregate": "sum", "field": "price", "type": "quantitative"},
          "color": {"field": "symbol", "type": "nominal"}
        },
        "config": {"area": {"line": {}}}
      };
      const normalizedSpec = normalize(spec, spec.config);
      assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
        "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
        "layer": [
          {
            "mark": "area",
            "encoding": {
              "x": {"field": "date","type": "temporal"},
              "y": {"aggregate": "sum", "field": "price","type": "quantitative"},
              "color": {"field": "symbol", "type": "nominal"}
            }
          },
          {
            "mark": {"type": "line"},
            "encoding": {
              "x": {"field": "date","type": "temporal"},
              "y": {"aggregate": "sum", "field": "price","type": "quantitative", "stack": "zero"},
              "color": {"field": "symbol", "type": "nominal"}
            }
          }
        ],
        "config": {"area": {"line": {}}}
      });
    });

    it('correctly normalizes streamgraph with overlay line', () => {
      const spec: TopLevelSpec = {
        "data": {"url": "data/stocks.csv", "format": {"type": "csv"}},
        "mark": "area",
        "encoding": {
          "x": {"field": "date", "type": "temporal"},
          "y": {"aggregate": "sum", "field": "price", "type": "quantitative", "stack": "center"},
          "color": {"field": "symbol", "type": "nominal"}
        },
        "config": {"area": {"line": {}}}
      };
      const normalizedSpec = normalize(spec, spec.config);
      assert.deepEqual<TopLevel<NormalizedSpec>>(normalizedSpec, {
        "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
        "layer": [
          {
            "mark": "area",
            "encoding": {
              "x": {"field": "date","type": "temporal"},
              "y": {"aggregate": "sum", "field": "price","type": "quantitative", "stack": "center"},
              "color": {"field": "symbol", "type": "nominal"}
            }
          },
          {
            "mark": {"type": "line"},
            "encoding": {
              "x": {"field": "date","type": "temporal"},
              "y": {"aggregate": "sum", "field": "price","type": "quantitative", "stack": "center"},
              "color": {"field": "symbol", "type": "nominal"}
            }
          }
        ],
        "config": {"area": {"line": {}}}
      });
    });
  });
});

describe('normalizeRangedUnitSpec', () => {
  it('should convert y2 -> y if there is no y in the encoding', function() {
    const spec: NormalizedSpec = {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "y2": {"field": "age","type": "ordinal"},
        "x": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "x2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    };

    assert.deepEqual<NormalizedSpec>(normalize(spec, defaultConfig), {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "y": {"field": "age","type": "ordinal"},
        "x": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "x2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    });
  });

  it('should do nothing if there is no missing x or y', function() {
    const spec: NormalizedSpec = {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "y": {"field": "age","type": "ordinal"},
        "x": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "x2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    };

    assert.deepEqual(normalize(spec, defaultConfig), spec);
  });

  it('should convert x2 -> x if there is no x in the encoding', function() {
    const spec: NormalizedSpec = {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "x2": {"field": "age","type": "ordinal"},
        "y": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "y2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    };

    assert.deepEqual<NormalizedSpec>(normalize(spec, defaultConfig), {
      "data": {"url": "data/population.json"},
      "mark": "rule",
      "encoding": {
        "x": {"field": "age","type": "ordinal"},
        "y": {"aggregate": "min", "field": "people", "type": "quantitative"},
        "y2": {"aggregate": "max", "field": "people", "type": "quantitative"}
      }
    });
  });
});

describe('fieldDefs()', function() {
  it('should get all non-duplicate fieldDefs from an encoding', function() {
    const spec: any = {
      "data": {"url": "data/cars.json"},
      "mark": "point",
      "encoding": {
        "x": {"field": "Horsepower","type": "quantitative"},
        "y": {"field": "Miles_per_Gallon","type": "quantitative"}
      }
    };

    assert.sameDeepMembers<FieldDef<Field>>(fieldDefs(spec), [
      {"field": "Horsepower","type": "quantitative"},
      {"field": "Miles_per_Gallon","type": "quantitative"}
    ]);
  });

  it('should get all non-duplicate fieldDefs from all layer in a LayerSpec', function() {
    const layerSpec: any = {
      "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
      "layer": [
        {
          "description": "Google's stock price over time.",
          "mark": "line",
          "encoding": {
            "x": {"field": "date","type": "temporal"},
            "y": {"field": "price","type": "quantitative"}
          }
        },
        {
          "description": "Google's stock price over time.",
          "mark": "point",
          "encoding": {
            "x": {"field": "date","type": "temporal"},
            "y": {"field": "price","type": "quantitative"},
            "color": {"field": "symbol", "type": "nominal"}
          },
          "config": {"mark": {"filled": true}}
        }
      ]
    };

    assert.sameDeepMembers<FieldDef<Field>>(fieldDefs(layerSpec), [
      {"field": "date","type": "temporal"},
      {"field": "price","type": "quantitative"},
      {"field": "symbol", "type": "nominal"}
    ]);
  });

  it('should get all non-duplicate fieldDefs from all layer in a LayerSpec (merging duplicate fields with different scale types)', function() {
    const layerSpec: any = {
      "data": {"url": "data/stocks.csv","format": {"type": "csv"}},
      "layer": [
        {
          "description": "Google's stock price over time.",
          "mark": "line",
          "encoding": {
            "x": {"field": "date","type": "temporal"},
            "y": {"field": "price","type": "quantitative"}
          }
        },
        {
          "description": "Google's stock price over time.",
          "mark": "point",
          "encoding": {
            "x": {"field": "date","type": "temporal"},
            "y": {"field": "price","type": "quantitative"},
            "color": {"field": "date","type": "temporal", "scale": {"type": "pow"}}
          },
          "config": {"mark": {"filled": true}}
        }
      ]
    };

    assert.sameDeepMembers<FieldDef<Field>>(fieldDefs(layerSpec), [
      {"field": "date","type": "temporal"},
      {"field": "price","type": "quantitative"}
    ]);
  });

  it('should get all non-duplicate fieldDefs from facet and layer in a FacetSpec', function() {
    const facetSpec: any = {
      "data": {"url": "data/movies.json"},
      "facet": {"row": {"field": "MPAA_Rating","type": "ordinal"}},
      "spec": {
        "mark": "point",
        "encoding": {
          "x": {"field": "Worldwide_Gross","type": "quantitative"},
          "y": {"field": "US_DVD_Sales","type": "quantitative"}
        }
      }
    };

    assert.sameDeepMembers<FieldDef<Field>>(fieldDefs(facetSpec), [
      {"field": "MPAA_Rating","type": "ordinal"},
      {"field": "Worldwide_Gross","type": "quantitative"},
      {"field": "US_DVD_Sales","type": "quantitative"}
    ]);
  });
});
