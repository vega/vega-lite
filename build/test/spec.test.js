/* tslint:disable:quotemark */
import { assert } from 'chai';
import * as log from '../src/log';
import { fieldDefs, normalize } from '../src/spec';
import { defaultConfig, initConfig } from './../src/config';
// describe('isStacked()') -- tested as part of stackOffset in stack.test.ts
describe('normalize()', function () {
    describe('normalizeFacetedUnit', function () {
        it('should convert single extended spec with column into a composite spec', function () {
            var spec = {
                "name": "faceted",
                "width": 123,
                "height": 234,
                "description": "faceted spec",
                "data": { "url": "data/movies.json" },
                "mark": "point",
                "encoding": {
                    "column": { "field": "MPAA_Rating", "type": "ordinal" },
                    "x": { "field": "Worldwide_Gross", "type": "quantitative" },
                    "y": { "field": "US_DVD_Sales", "type": "quantitative" }
                }
            };
            var config = initConfig(spec.config);
            assert.deepEqual(normalize(spec, config), {
                "name": "faceted",
                "description": "faceted spec",
                "data": { "url": "data/movies.json" },
                "facet": {
                    "column": { "field": "MPAA_Rating", "type": "ordinal" }
                },
                "spec": {
                    "mark": "point",
                    "width": 123,
                    "height": 234,
                    "encoding": {
                        "x": { "field": "Worldwide_Gross", "type": "quantitative" },
                        "y": { "field": "US_DVD_Sales", "type": "quantitative" }
                    }
                }
            });
        });
        it('should convert single extended spec with row into a composite spec', function () {
            var spec = {
                "data": { "url": "data/movies.json" },
                "mark": "point",
                "encoding": {
                    "row": { "field": "MPAA_Rating", "type": "ordinal" },
                    "x": { "field": "Worldwide_Gross", "type": "quantitative" },
                    "y": { "field": "US_DVD_Sales", "type": "quantitative" }
                }
            };
            var config = initConfig(spec.config);
            assert.deepEqual(normalize(spec, config), {
                "data": { "url": "data/movies.json" },
                "facet": {
                    "row": { "field": "MPAA_Rating", "type": "ordinal" }
                },
                "spec": {
                    "mark": "point",
                    "encoding": {
                        "x": { "field": "Worldwide_Gross", "type": "quantitative" },
                        "y": { "field": "US_DVD_Sales", "type": "quantitative" }
                    }
                }
            });
        });
    });
    describe('normalizeFacet', function () {
        it('should produce correct layered specs for mean point and vertical error bar', function () {
            assert.deepEqual(normalize({
                "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                "transform": [{ "filter": "datum.year == 2000" }],
                facet: {
                    "row": { "field": "MPAA_Rating", "type": "ordinal" }
                },
                spec: {
                    layer: [
                        {
                            "mark": "point",
                            "encoding": {
                                "x": { "field": "age", "type": "ordinal" },
                                "y": {
                                    "aggregate": "mean",
                                    "field": "people",
                                    "type": "quantitative",
                                    "axis": { "title": "population" }
                                },
                                "size": { "value": 2 }
                            }
                        },
                        {
                            mark: 'error-bar',
                            encoding: {
                                "x": { "field": "age", "type": "ordinal" },
                                "y": {
                                    "aggregate": "min",
                                    "field": "people",
                                    "type": "quantitative",
                                    "axis": { "title": "population" }
                                },
                                "y2": {
                                    "aggregate": "max",
                                    "field": "people",
                                    "type": "quantitative"
                                },
                                "size": { "value": 5 }
                            }
                        }
                    ]
                }
            }, defaultConfig), {
                "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                "transform": [{ "filter": "datum.year == 2000" }],
                facet: {
                    "row": { "field": "MPAA_Rating", "type": "ordinal" }
                },
                spec: {
                    layer: [
                        {
                            "mark": "point",
                            "encoding": {
                                "x": { "field": "age", "type": "ordinal" },
                                "y": {
                                    "aggregate": "mean",
                                    "field": "people",
                                    "type": "quantitative",
                                    "axis": { "title": "population" }
                                },
                                "size": { "value": 2 }
                            }
                        },
                        {
                            "layer": [
                                {
                                    "mark": "rule",
                                    "encoding": {
                                        "x": { "field": "age", "type": "ordinal" },
                                        "y": {
                                            "aggregate": "min",
                                            "field": "people",
                                            "type": "quantitative",
                                            "axis": { "title": "population" }
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
                                        "x": { "field": "age", "type": "ordinal" },
                                        "y": {
                                            "aggregate": "min",
                                            "field": "people",
                                            "type": "quantitative",
                                            "axis": { "title": "population" }
                                        },
                                        "size": { "value": 5 }
                                    }
                                },
                                {
                                    "mark": "tick",
                                    "encoding": {
                                        "x": { "field": "age", "type": "ordinal" },
                                        "y": {
                                            "aggregate": "max",
                                            "field": "people",
                                            "type": "quantitative",
                                        },
                                        "size": { "value": 5 }
                                    }
                                }
                            ]
                        }
                    ]
                }
            });
        });
    });
    describe('normalizeLayer', function () {
        it('correctly passes shared projection and encoding to children of layer', function () {
            var output = normalize({
                "data": { "url": "data/population.json" },
                "projection": { "type": "mercator" },
                "encoding": {
                    "x": { "field": "age", "type": "ordinal" }
                },
                "layer": [
                    { "mark": "point" },
                    {
                        "layer": [
                            { "mark": "rule" },
                            {
                                "mark": "text",
                                "encoding": {
                                    "text": { "field": "a", "type": "nominal" }
                                }
                            }
                        ]
                    }
                ]
            }, defaultConfig);
            assert.deepEqual(output, {
                "data": { "url": "data/population.json" },
                layer: [
                    {
                        "projection": { "type": "mercator" },
                        "mark": "point",
                        "encoding": {
                            "x": { "field": "age", "type": "ordinal" }
                        }
                    },
                    {
                        "layer": [
                            {
                                "projection": { "type": "mercator" },
                                "mark": "rule",
                                "encoding": {
                                    "x": { "field": "age", "type": "ordinal" }
                                }
                            },
                            {
                                "projection": { "type": "mercator" },
                                "mark": "text",
                                "encoding": {
                                    "x": { "field": "age", "type": "ordinal" },
                                    "text": { "field": "a", "type": "nominal" }
                                }
                            }
                        ]
                    }
                ]
            });
        });
        it('correctly overrides shared projection and encoding and throws warnings', log.wrap(function (localLogger) {
            var output = normalize({
                "data": { "url": "data/population.json" },
                "projection": { "type": "mercator" },
                "encoding": {
                    "x": { "field": "age", "type": "ordinal" }
                },
                "layer": [
                    {
                        "projection": { "type": "albersUsa" },
                        "mark": "rule"
                    },
                    {
                        "mark": "text",
                        "encoding": {
                            "x": { "field": "a", "type": "nominal" }
                        }
                    }
                ]
            }, defaultConfig);
            assert.equal(localLogger.warns.length, 2);
            assert.equal(localLogger.warns[0], log.message.projectionOverridden({
                parentProjection: { "type": "mercator" },
                projection: { "type": "albersUsa" }
            }));
            assert.equal(localLogger.warns[1], log.message.encodingOverridden(['x']));
            assert.deepEqual(output, {
                "data": { "url": "data/population.json" },
                layer: [
                    {
                        "projection": { "type": "albersUsa" },
                        "mark": "rule",
                        "encoding": {
                            "x": { "field": "age", "type": "ordinal" }
                        }
                    },
                    {
                        "projection": { "type": "mercator" },
                        "mark": "text",
                        "encoding": {
                            "x": { "field": "a", "type": "nominal" },
                        }
                    }
                ]
            });
        }));
        it('should produce correct layered specs for mean point and vertical error bar', function () {
            assert.deepEqual(normalize({
                "data": { "url": "data/population.json" },
                layer: [
                    {
                        "mark": "point",
                        "encoding": {
                            "x": { "field": "age", "type": "ordinal" },
                            "y": {
                                "aggregate": "mean",
                                "field": "people",
                                "type": "quantitative",
                                "axis": { "title": "population" }
                            },
                            "size": { "value": 2 }
                        }
                    },
                    {
                        mark: 'error-bar',
                        encoding: {
                            "x": { "field": "age", "type": "ordinal" },
                            "y": {
                                "aggregate": "min",
                                "field": "people",
                                "type": "quantitative",
                                "axis": { "title": "population" }
                            },
                            "y2": {
                                "aggregate": "max",
                                "field": "people",
                                "type": "quantitative"
                            },
                            "size": { "value": 5 }
                        }
                    }
                ]
            }, defaultConfig), {
                "data": { "url": "data/population.json" },
                layer: [
                    {
                        "mark": "point",
                        "encoding": {
                            "x": { "field": "age", "type": "ordinal" },
                            "y": {
                                "aggregate": "mean",
                                "field": "people",
                                "type": "quantitative",
                                "axis": { "title": "population" }
                            },
                            "size": { "value": 2 }
                        }
                    },
                    {
                        "layer": [
                            {
                                "mark": "rule",
                                "encoding": {
                                    "x": { "field": "age", "type": "ordinal" },
                                    "y": {
                                        "aggregate": "min",
                                        "field": "people",
                                        "type": "quantitative",
                                        "axis": { "title": "population" }
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
                                    "x": { "field": "age", "type": "ordinal" },
                                    "y": {
                                        "aggregate": "min",
                                        "field": "people",
                                        "type": "quantitative",
                                        "axis": { "title": "population" }
                                    },
                                    "size": { "value": 5 }
                                }
                            },
                            {
                                "mark": "tick",
                                "encoding": {
                                    "x": { "field": "age", "type": "ordinal" },
                                    "y": {
                                        "aggregate": "max",
                                        "field": "people",
                                        "type": "quantitative",
                                    },
                                    "size": { "value": 5 }
                                }
                            }
                        ]
                    }
                ]
            });
        });
    });
    describe('normalizeOverlay', function () {
        it('correctly normalizes line with overlayed point.', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": "line",
                "encoding": {
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "field": "price", "type": "quantitative" }
                },
                "config": { "line": { "point": {} } }
            };
            var normalizedSpec = normalize(spec, spec.config);
            assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": "line",
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "point", "opacity": 1, "filled": true },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    }
                ],
                "config": { "line": { "point": {} } }
            });
        });
        it('correctly normalizes line with transparent point overlayed.', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": { "type": "line", "point": "transparent" },
                "encoding": {
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "field": "price", "type": "quantitative" }
                }
            };
            var normalizedSpec = normalize(spec, spec.config);
            assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": "line",
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "point", "opacity": 0, "filled": true },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    }
                ]
            });
        });
        it('correctly normalizes line with point overlayed via mark definition.', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": { "type": "line", "point": { "color": "red" } },
                "encoding": {
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "field": "price", "type": "quantitative" }
                }
            };
            var normalizedSpec = normalize(spec, spec.config);
            assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": "line",
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "point", "opacity": 1, "filled": true, "color": "red" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    }
                ]
            });
        });
        it('correctly normalizes faceted line plots with overlayed point.', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": "line",
                "encoding": {
                    "row": { "field": "symbol", "type": "nominal" },
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "field": "price", "type": "quantitative" }
                },
                "config": { "line": { "point": {} } }
            };
            var normalizedSpec = normalize(spec, spec.config);
            assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "facet": {
                    "row": { "field": "symbol", "type": "nominal" },
                },
                "spec": {
                    "layer": [
                        {
                            "mark": "line",
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            }
                        },
                        {
                            "mark": { "type": "point", "opacity": 1, "filled": true },
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            }
                        }
                    ],
                },
                "config": { "line": { "point": {} } }
            });
        });
        it('correctly normalizes area with overlay line and point', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": "area",
                "encoding": {
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "field": "price", "type": "quantitative" }
                },
                "config": { "area": { "line": {}, "point": {} } }
            };
            var normalizedSpec = normalize(spec, spec.config);
            assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": { "type": "area", "opacity": 0.7 },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "line" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "point", "opacity": 1, "filled": true },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    }
                ],
                "config": { "area": { "line": {}, "point": {} } }
            });
        });
        it('correctly normalizes area with overlay line', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": "area",
                "encoding": {
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "field": "price", "type": "quantitative" }
                },
                "config": { "area": { "line": {} } }
            };
            var normalizedSpec = normalize(spec, spec.config);
            assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": { "type": "area", "opacity": 0.7 },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "line" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    }
                ],
                "config": { "area": { "line": {} } }
            });
        });
        it('correctly normalizes area with disabled overlay point and line.', function () {
            for (var _i = 0, _a = [null, false]; _i < _a.length; _i++) {
                var overlay = _a[_i];
                var spec = {
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "mark": { "type": "area", "point": overlay, "line": overlay },
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" }
                    }
                };
                var normalizedSpec = normalize(spec, spec.config);
                assert.deepEqual(normalizedSpec, {
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "mark": "area",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" }
                    }
                });
            }
        });
        it('correctly normalizes area with overlay point and line disabled in config.', function () {
            for (var _i = 0, _a = [null, false]; _i < _a.length; _i++) {
                var overlay = _a[_i];
                var spec = {
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "mark": { "type": "area" },
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" }
                    },
                    "config": {
                        "area": { "point": overlay, "line": overlay }
                    }
                };
                var normalizedSpec = normalize(spec, spec.config);
                assert.deepEqual(normalizedSpec, {
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "mark": "area",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" }
                    },
                    "config": {
                        "area": { "point": overlay, "line": overlay }
                    }
                });
            }
        });
        it('correctly normalizes stacked area with overlay line', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": "area",
                "encoding": {
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "aggregate": "sum", "field": "price", "type": "quantitative" },
                    "color": { "field": "symbol", "type": "nominal" }
                },
                "config": { "area": { "line": {} } }
            };
            var normalizedSpec = normalize(spec, spec.config);
            assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": { "type": "area", "opacity": 0.7 },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "aggregate": "sum", "field": "price", "type": "quantitative" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    },
                    {
                        "mark": { "type": "line" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "aggregate": "sum", "field": "price", "type": "quantitative", "stack": "zero" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    }
                ],
                "config": { "area": { "line": {} } }
            });
        });
        it('correctly normalizes streamgraph with overlay line', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": "area",
                "encoding": {
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "aggregate": "sum", "field": "price", "type": "quantitative", "stack": "center" },
                    "color": { "field": "symbol", "type": "nominal" }
                },
                "config": { "area": { "line": {} } }
            };
            var normalizedSpec = normalize(spec, spec.config);
            assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": { "type": "area", "opacity": 0.7 },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "aggregate": "sum", "field": "price", "type": "quantitative", "stack": "center" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    },
                    {
                        "mark": { "type": "line" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "aggregate": "sum", "field": "price", "type": "quantitative", "stack": "center" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    }
                ],
                "config": { "area": { "line": {} } }
            });
        });
    });
});
describe('normalizeRangedUnitSpec', function () {
    it('should convert y2 -> y if there is no y in the encoding', function () {
        var spec = {
            "data": { "url": "data/population.json" },
            "mark": "rule",
            "encoding": {
                "y2": { "field": "age", "type": "ordinal" },
                "x": { "aggregate": "min", "field": "people", "type": "quantitative" },
                "x2": { "aggregate": "max", "field": "people", "type": "quantitative" }
            }
        };
        assert.deepEqual(normalize(spec, defaultConfig), {
            "data": { "url": "data/population.json" },
            "mark": "rule",
            "encoding": {
                "y": { "field": "age", "type": "ordinal" },
                "x": { "aggregate": "min", "field": "people", "type": "quantitative" },
                "x2": { "aggregate": "max", "field": "people", "type": "quantitative" }
            }
        });
    });
    it('should do nothing if there is no missing x or y', function () {
        var spec = {
            "data": { "url": "data/population.json" },
            "mark": "rule",
            "encoding": {
                "y": { "field": "age", "type": "ordinal" },
                "x": { "aggregate": "min", "field": "people", "type": "quantitative" },
                "x2": { "aggregate": "max", "field": "people", "type": "quantitative" }
            }
        };
        assert.deepEqual(normalize(spec, defaultConfig), spec);
    });
    it('should convert x2 -> x if there is no x in the encoding', function () {
        var spec = {
            "data": { "url": "data/population.json" },
            "mark": "rule",
            "encoding": {
                "x2": { "field": "age", "type": "ordinal" },
                "y": { "aggregate": "min", "field": "people", "type": "quantitative" },
                "y2": { "aggregate": "max", "field": "people", "type": "quantitative" }
            }
        };
        assert.deepEqual(normalize(spec, defaultConfig), {
            "data": { "url": "data/population.json" },
            "mark": "rule",
            "encoding": {
                "x": { "field": "age", "type": "ordinal" },
                "y": { "aggregate": "min", "field": "people", "type": "quantitative" },
                "y2": { "aggregate": "max", "field": "people", "type": "quantitative" }
            }
        });
    });
});
describe('fieldDefs()', function () {
    it('should get all non-duplicate fieldDefs from an encoding', function () {
        var spec = {
            "data": { "url": "data/cars.json" },
            "mark": "point",
            "encoding": {
                "x": { "field": "Horsepower", "type": "quantitative" },
                "y": { "field": "Miles_per_Gallon", "type": "quantitative" }
            }
        };
        assert.sameDeepMembers(fieldDefs(spec), [
            { "field": "Horsepower", "type": "quantitative" },
            { "field": "Miles_per_Gallon", "type": "quantitative" }
        ]);
    });
    it('should get all non-duplicate fieldDefs from all layer in a LayerSpec', function () {
        var layerSpec = {
            "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
            "layer": [
                {
                    "description": "Google's stock price over time.",
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" }
                    }
                },
                {
                    "description": "Google's stock price over time.",
                    "mark": "point",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" },
                        "color": { "field": "symbol", "type": "nominal" }
                    },
                    "config": { "mark": { "filled": true } }
                }
            ]
        };
        assert.sameDeepMembers(fieldDefs(layerSpec), [
            { "field": "date", "type": "temporal" },
            { "field": "price", "type": "quantitative" },
            { "field": "symbol", "type": "nominal" }
        ]);
    });
    it('should get all non-duplicate fieldDefs from all layer in a LayerSpec (merging duplicate fields with different scale types)', function () {
        var layerSpec = {
            "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
            "layer": [
                {
                    "description": "Google's stock price over time.",
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" }
                    }
                },
                {
                    "description": "Google's stock price over time.",
                    "mark": "point",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" },
                        "color": { "field": "date", "type": "temporal", "scale": { "type": "pow" } }
                    },
                    "config": { "mark": { "filled": true } }
                }
            ]
        };
        assert.sameDeepMembers(fieldDefs(layerSpec), [
            { "field": "date", "type": "temporal" },
            { "field": "price", "type": "quantitative" }
        ]);
    });
    it('should get all non-duplicate fieldDefs from facet and layer in a FacetSpec', function () {
        var facetSpec = {
            "data": { "url": "data/movies.json" },
            "facet": { "row": { "field": "MPAA_Rating", "type": "ordinal" } },
            "spec": {
                "mark": "point",
                "encoding": {
                    "x": { "field": "Worldwide_Gross", "type": "quantitative" },
                    "y": { "field": "US_DVD_Sales", "type": "quantitative" }
                }
            }
        };
        assert.sameDeepMembers(fieldDefs(facetSpec), [
            { "field": "MPAA_Rating", "type": "ordinal" },
            { "field": "Worldwide_Gross", "type": "quantitative" },
            { "field": "US_DVD_Sales", "type": "quantitative" }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9zcGVjLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBQzlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFJNUIsT0FBTyxLQUFLLEdBQUcsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQXlDLE1BQU0sYUFBYSxDQUFDO0FBQ3pGLE9BQU8sRUFBQyxhQUFhLEVBQUUsVUFBVSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFMUQsNEVBQTRFO0FBRTVFLFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1FBQy9CLEVBQUUsQ0FBQyx1RUFBdUUsRUFBRTtZQUMxRSxJQUFNLElBQUksR0FBUTtnQkFDaEIsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLE9BQU8sRUFBRSxHQUFHO2dCQUNaLFFBQVEsRUFBRSxHQUFHO2dCQUNiLGFBQWEsRUFBRSxjQUFjO2dCQUM3QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7Z0JBQ25DLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7b0JBQ3BELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUN4RCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7aUJBQ3REO2FBQ0YsQ0FBQztZQUNGLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0s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ZTpxdW90ZW1hcmsgKi9cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtGaWVsZCwgRmllbGREZWZ9IGZyb20gJy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQge0xvY2FsTG9nZ2VyfSBmcm9tICcuLi9zcmMvbG9nJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9zcmMvbG9nJztcbmltcG9ydCB7ZmllbGREZWZzLCBub3JtYWxpemUsIE5vcm1hbGl6ZWRTcGVjLCBUb3BMZXZlbCwgVG9wTGV2ZWxTcGVjfSBmcm9tICcuLi9zcmMvc3BlYyc7XG5pbXBvcnQge2RlZmF1bHRDb25maWcsIGluaXRDb25maWd9IGZyb20gJy4vLi4vc3JjL2NvbmZpZyc7XG5cbi8vIGRlc2NyaWJlKCdpc1N0YWNrZWQoKScpIC0tIHRlc3RlZCBhcyBwYXJ0IG9mIHN0YWNrT2Zmc2V0IGluIHN0YWNrLnRlc3QudHNcblxuZGVzY3JpYmUoJ25vcm1hbGl6ZSgpJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgnbm9ybWFsaXplRmFjZXRlZFVuaXQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHNpbmdsZSBleHRlbmRlZCBzcGVjIHdpdGggY29sdW1uIGludG8gYSBjb21wb3NpdGUgc3BlYycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgc3BlYzogYW55ID0ge1xuICAgICAgICBcIm5hbWVcIjogXCJmYWNldGVkXCIsXG4gICAgICAgIFwid2lkdGhcIjogMTIzLFxuICAgICAgICBcImhlaWdodFwiOiAyMzQsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJmYWNldGVkIHNwZWNcIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwiY29sdW1uXCI6IHtcImZpZWxkXCI6IFwiTVBBQV9SYXRpbmdcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIldvcmxkd2lkZV9Hcm9zc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJVU19EVkRfU2FsZXNcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGluaXRDb25maWcoc3BlYy5jb25maWcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoc3BlYywgY29uZmlnKSwge1xuICAgICAgICBcIm5hbWVcIjogXCJmYWNldGVkXCIsXG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJmYWNldGVkIHNwZWNcIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICAgIFwiZmFjZXRcIjoge1xuICAgICAgICAgIFwiY29sdW1uXCI6IHtcImZpZWxkXCI6IFwiTVBBQV9SYXRpbmdcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3BlY1wiOiB7XG4gICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICBcIndpZHRoXCI6IDEyMyxcbiAgICAgICAgICBcImhlaWdodFwiOiAyMzQsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJXb3JsZHdpZGVfR3Jvc3NcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJVU19EVkRfU2FsZXNcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHNpbmdsZSBleHRlbmRlZCBzcGVjIHdpdGggcm93IGludG8gYSBjb21wb3NpdGUgc3BlYycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgc3BlYzogYW55ID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiV29ybGR3aWRlX0dyb3NzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIlVTX0RWRF9TYWxlc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBjb25maWcgPSBpbml0Q29uZmlnKHNwZWMuY29uZmlnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplKHNwZWMsIGNvbmZpZyksIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICAgIFwiZmFjZXRcIjoge1xuICAgICAgICAgIFwicm93XCI6IHtcImZpZWxkXCI6IFwiTVBBQV9SYXRpbmdcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwic3BlY1wiOiB7XG4gICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIldvcmxkd2lkZV9Hcm9zc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIlVTX0RWRF9TYWxlc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdub3JtYWxpemVGYWNldCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBsYXllcmVkIHNwZWNzIGZvciBtZWFuIHBvaW50IGFuZCB2ZXJ0aWNhbCBlcnJvciBiYXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGVycm9yIGJhciBwbG90IHNob3dpbmcgbWVhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogW3tcImZpbHRlclwiOiBcImRhdHVtLnllYXIgPT0gMjAwMFwifV0sXG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIGxheWVyOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogMn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbWFyazogJ2Vycm9yLWJhcicsXG4gICAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKSwge1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBlcnJvciBiYXIgcGxvdCBzaG93aW5nIG1lYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFt7XCJmaWx0ZXJcIjogXCJkYXR1bS55ZWFyID09IDIwMDBcIn1dLFxuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIFwicm93XCI6IHtcImZpZWxkXCI6IFwiTVBBQV9SYXRpbmdcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBsYXllcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDJ9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJtYXJrXCI6IFwidGlja1wiLFxuICAgICAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIC8vIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ25vcm1hbGl6ZUxheWVyJywgKCkgPT4ge1xuICAgIGl0KCdjb3JyZWN0bHkgcGFzc2VzIHNoYXJlZCBwcm9qZWN0aW9uIGFuZCBlbmNvZGluZyB0byBjaGlsZHJlbiBvZiBsYXllcicsICgpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dCA9IG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcInR5cGVcIjogXCJtZXJjYXRvclwifSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1wibWFya1wiOiBcInBvaW50XCJ9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgICAgICB7XCJtYXJrXCI6IFwicnVsZVwifSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3V0cHV0LCB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbGF5ZXI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1widHlwZVwiOiBcIm1lcmNhdG9yXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1widHlwZVwiOiBcIm1lcmNhdG9yXCJ9LFxuICAgICAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcInR5cGVcIjogXCJtZXJjYXRvclwifSxcbiAgICAgICAgICAgICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdjb3JyZWN0bHkgb3ZlcnJpZGVzIHNoYXJlZCBwcm9qZWN0aW9uIGFuZCBlbmNvZGluZyBhbmQgdGhyb3dzIHdhcm5pbmdzJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyOiBMb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gbm9ybWFsaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInByb2plY3Rpb25cIjoge1widHlwZVwiOiBcIm1lcmNhdG9yXCJ9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1widHlwZVwiOiBcImFsYmVyc1VzYVwifSxcbiAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJucy5sZW5ndGgsIDIpO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLnByb2plY3Rpb25PdmVycmlkZGVuKHtcbiAgICAgICAgcGFyZW50UHJvamVjdGlvbjoge1widHlwZVwiOiBcIm1lcmNhdG9yXCJ9LFxuICAgICAgICBwcm9qZWN0aW9uOiB7XCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJ9XG4gICAgICB9KSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1sxXSwgbG9nLm1lc3NhZ2UuZW5jb2RpbmdPdmVycmlkZGVuKFsneCddKSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3V0cHV0LCB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbGF5ZXI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1widHlwZVwiOiBcImFsYmVyc1VzYVwifSxcbiAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcInR5cGVcIjogXCJtZXJjYXRvclwifSxcbiAgICAgICAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHByb2R1Y2UgY29ycmVjdCBsYXllcmVkIHNwZWNzIGZvciBtZWFuIHBvaW50IGFuZCB2ZXJ0aWNhbCBlcnJvciBiYXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbGF5ZXI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrOiAnZXJyb3ItYmFyJyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgbGF5ZXI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAvLyBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ25vcm1hbGl6ZU92ZXJsYXknLCAoKSA9PiB7XG4gICAgaXQoJ2NvcnJlY3RseSBub3JtYWxpemVzIGxpbmUgd2l0aCBvdmVybGF5ZWQgcG9pbnQuJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImxpbmVcIjoge1wicG9pbnRcIjoge319fVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRTcGVjID0gbm9ybWFsaXplKHNwZWMsIHNwZWMuY29uZmlnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VG9wTGV2ZWw8Tm9ybWFsaXplZFNwZWM+Pihub3JtYWxpemVkU3BlYywge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcInBvaW50XCIsIFwib3BhY2l0eVwiOiAxLCBcImZpbGxlZFwiOiB0cnVlfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImxpbmVcIjoge1wicG9pbnRcIjoge319fVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG5vcm1hbGl6ZXMgbGluZSB3aXRoIHRyYW5zcGFyZW50IHBvaW50IG92ZXJsYXllZC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbFNwZWMgPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwiLCBcInBvaW50XCI6IFwidHJhbnNwYXJlbnRcIn0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJwb2ludFwiLCBcIm9wYWNpdHlcIjogMCwgXCJmaWxsZWRcIjogdHJ1ZX0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbm9ybWFsaXplcyBsaW5lIHdpdGggcG9pbnQgb3ZlcmxheWVkIHZpYSBtYXJrIGRlZmluaXRpb24uJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImxpbmVcIiwgXCJwb2ludFwiOiB7XCJjb2xvclwiOiBcInJlZFwifX0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJwb2ludFwiLCBcIm9wYWNpdHlcIjogMSwgXCJmaWxsZWRcIjogdHJ1ZSwgXCJjb2xvclwiOiBcInJlZFwifSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBub3JtYWxpemVzIGZhY2V0ZWQgbGluZSBwbG90cyB3aXRoIG92ZXJsYXllZCBwb2ludC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbFNwZWMgPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJsaW5lXCI6IHtcInBvaW50XCI6IHt9fX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJmYWNldFwiOiB7XG4gICAgICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJzcGVjXCI6IHtcbiAgICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcInBvaW50XCIsIFwib3BhY2l0eVwiOiAxLCBcImZpbGxlZFwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImxpbmVcIjoge1wicG9pbnRcIjoge319fVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG5vcm1hbGl6ZXMgYXJlYSB3aXRoIG92ZXJsYXkgbGluZSBhbmQgcG9pbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbFNwZWMgPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1wiYXJlYVwiOiB7XCJsaW5lXCI6IHt9LCBcInBvaW50XCI6IHt9fX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImFyZWFcIiwgXCJvcGFjaXR5XCI6IDAuN30sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJsaW5lXCJ9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwicG9pbnRcIiwgXCJvcGFjaXR5XCI6IDEsIFwiZmlsbGVkXCI6IHRydWV9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImFyZWFcIjoge1wibGluZVwiOiB7fSwgXCJwb2ludFwiOiB7fX19XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbm9ybWFsaXplcyBhcmVhIHdpdGggb3ZlcmxheSBsaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImFyZWFcIjoge1wibGluZVwiOiB7fX19XG4gICAgICB9O1xuICAgICAgY29uc3Qgbm9ybWFsaXplZFNwZWMgPSBub3JtYWxpemUoc3BlYywgc3BlYy5jb25maWcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxUb3BMZXZlbDxOb3JtYWxpemVkU3BlYz4+KG5vcm1hbGl6ZWRTcGVjLCB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIixcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJhcmVhXCIsIFwib3BhY2l0eVwiOiAwLjd9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwifSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJhcmVhXCI6IHtcImxpbmVcIjoge319fVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG5vcm1hbGl6ZXMgYXJlYSB3aXRoIGRpc2FibGVkIG92ZXJsYXkgcG9pbnQgYW5kIGxpbmUuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBvdmVybGF5IG9mIFtudWxsLCBmYWxzZV0pIHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJhcmVhXCIsIFwicG9pbnRcIjogb3ZlcmxheSwgXCJsaW5lXCI6IG92ZXJsYXl9LFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFNwZWMgPSBub3JtYWxpemUoc3BlYywgc3BlYy5jb25maWcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBub3JtYWxpemVzIGFyZWEgd2l0aCBvdmVybGF5IHBvaW50IGFuZCBsaW5lIGRpc2FibGVkIGluIGNvbmZpZy4nLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG92ZXJsYXkgb2YgW251bGwsIGZhbHNlXSkge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbFNwZWMgPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImFyZWFcIn0sXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcImFyZWFcIjoge1wicG9pbnRcIjogb3ZlcmxheSwgXCJsaW5lXCI6IG92ZXJsYXl9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWw8VG9wTGV2ZWw8Tm9ybWFsaXplZFNwZWM+Pihub3JtYWxpemVkU3BlYywge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJhcmVhXCI6IHtcInBvaW50XCI6IG92ZXJsYXksIFwibGluZVwiOiBvdmVybGF5fVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG5vcm1hbGl6ZXMgc3RhY2tlZCBhcmVhIHdpdGggb3ZlcmxheSBsaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJhcmVhXCI6IHtcImxpbmVcIjoge319fVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRTcGVjID0gbm9ybWFsaXplKHNwZWMsIHNwZWMuY29uZmlnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VG9wTGV2ZWw8Tm9ybWFsaXplZFNwZWM+Pihub3JtYWxpemVkU3BlYywge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwiYXJlYVwiLCBcIm9wYWNpdHlcIjogMC43fSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwifSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic3RhY2tcIjogXCJ6ZXJvXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImFyZWFcIjoge1wibGluZVwiOiB7fX19XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbm9ybWFsaXplcyBzdHJlYW1ncmFwaCB3aXRoIG92ZXJsYXkgbGluZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsU3BlYyA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IFwiY2VudGVyXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJhcmVhXCI6IHtcImxpbmVcIjoge319fVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRTcGVjID0gbm9ybWFsaXplKHNwZWMsIHNwZWMuY29uZmlnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VG9wTGV2ZWw8Tm9ybWFsaXplZFNwZWM+Pihub3JtYWxpemVkU3BlYywge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwiYXJlYVwiLCBcIm9wYWNpdHlcIjogMC43fSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic3RhY2tcIjogXCJjZW50ZXJcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJsaW5lXCJ9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzdGFja1wiOiBcImNlbnRlclwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJhcmVhXCI6IHtcImxpbmVcIjoge319fVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdub3JtYWxpemVSYW5nZWRVbml0U3BlYycsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBjb252ZXJ0IHkyIC0+IHkgaWYgdGhlcmUgaXMgbm8geSBpbiB0aGUgZW5jb2RpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcGVjOiBOb3JtYWxpemVkU3BlYyA9IHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInkyXCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ4MlwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtYXhcIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxOb3JtYWxpemVkU3BlYz4obm9ybWFsaXplKHNwZWMsIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ4MlwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtYXhcIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBkbyBub3RoaW5nIGlmIHRoZXJlIGlzIG5vIG1pc3NpbmcgeCBvciB5JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFNwZWMgPSB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ4MlwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtYXhcIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoc3BlYywgZGVmYXVsdENvbmZpZyksIHNwZWMpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGNvbnZlcnQgeDIgLT4geCBpZiB0aGVyZSBpcyBubyB4IGluIHRoZSBlbmNvZGluZycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRTcGVjID0ge1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieDJcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWluXCIsIFwiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInkyXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH07XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPE5vcm1hbGl6ZWRTcGVjPihub3JtYWxpemUoc3BlYywgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWluXCIsIFwiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInkyXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnZmllbGREZWZzKCknLCBmdW5jdGlvbigpIHtcbiAgaXQoJ3Nob3VsZCBnZXQgYWxsIG5vbi1kdXBsaWNhdGUgZmllbGREZWZzIGZyb20gYW4gZW5jb2RpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcGVjOiBhbnkgPSB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVyczxGaWVsZERlZjxGaWVsZD4+KGZpZWxkRGVmcyhzcGVjKSwgW1xuICAgICAge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZ2V0IGFsbCBub24tZHVwbGljYXRlIGZpZWxkRGVmcyBmcm9tIGFsbCBsYXllciBpbiBhIExheWVyU3BlYycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGxheWVyU3BlYzogYW55ID0ge1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiR29vZ2xlJ3Mgc3RvY2sgcHJpY2Ugb3ZlciB0aW1lLlwiLFxuICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkdvb2dsZSdzIHN0b2NrIHByaWNlIG92ZXIgdGltZS5cIixcbiAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcIm1hcmtcIjoge1wiZmlsbGVkXCI6IHRydWV9fVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcblxuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnM8RmllbGREZWY8RmllbGQ+PihmaWVsZERlZnMobGF5ZXJTcGVjKSwgW1xuICAgICAge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGdldCBhbGwgbm9uLWR1cGxpY2F0ZSBmaWVsZERlZnMgZnJvbSBhbGwgbGF5ZXIgaW4gYSBMYXllclNwZWMgKG1lcmdpbmcgZHVwbGljYXRlIGZpZWxkcyB3aXRoIGRpZmZlcmVudCBzY2FsZSB0eXBlcyknLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBsYXllclNwZWM6IGFueSA9IHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIixcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkdvb2dsZSdzIHN0b2NrIHByaWNlIG92ZXIgdGltZS5cIixcbiAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLCBcInNjYWxlXCI6IHtcInR5cGVcIjogXCJwb3dcIn19XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XCJtYXJrXCI6IHtcImZpbGxlZFwiOiB0cnVlfX1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG5cbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzPEZpZWxkRGVmPEZpZWxkPj4oZmllbGREZWZzKGxheWVyU3BlYyksIFtcbiAgICAgIHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGdldCBhbGwgbm9uLWR1cGxpY2F0ZSBmaWVsZERlZnMgZnJvbSBmYWNldCBhbmQgbGF5ZXIgaW4gYSBGYWNldFNwZWMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBmYWNldFNwZWM6IGFueSA9IHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgXCJmYWNldFwiOiB7XCJyb3dcIjoge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn19LFxuICAgICAgXCJzcGVjXCI6IHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiV29ybGR3aWRlX0dyb3NzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIlVTX0RWRF9TYWxlc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnM8RmllbGREZWY8RmllbGQ+PihmaWVsZERlZnMoZmFjZXRTcGVjKSwgW1xuICAgICAge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICB7XCJmaWVsZFwiOiBcIldvcmxkd2lkZV9Hcm9zc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIHtcImZpZWxkXCI6IFwiVVNfRFZEX1NhbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgXSk7XG4gIH0pO1xufSk7XG4iXX0=