"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var log = tslib_1.__importStar(require("../src/log"));
var spec_1 = require("../src/spec");
var config_1 = require("./../src/config");
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
            var config = config_1.initConfig(spec.config);
            chai_1.assert.deepEqual(spec_1.normalize(spec, config), {
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
            var config = config_1.initConfig(spec.config);
            chai_1.assert.deepEqual(spec_1.normalize(spec, config), {
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
            chai_1.assert.deepEqual(spec_1.normalize({
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
            }, config_1.defaultConfig), {
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
            var output = spec_1.normalize({
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
            }, config_1.defaultConfig);
            chai_1.assert.deepEqual(output, {
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
            var output = spec_1.normalize({
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
            }, config_1.defaultConfig);
            chai_1.assert.equal(localLogger.warns.length, 2);
            chai_1.assert.equal(localLogger.warns[0], log.message.projectionOverridden({
                parentProjection: { "type": "mercator" },
                projection: { "type": "albersUsa" }
            }));
            chai_1.assert.equal(localLogger.warns[1], log.message.encodingOverridden(['x']));
            chai_1.assert.deepEqual(output, {
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
            chai_1.assert.deepEqual(spec_1.normalize({
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
            }, config_1.defaultConfig), {
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
    describe('normalizePathOverlay', function () {
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
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
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
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
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
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
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
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
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
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
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
        it('correctly normalizes interpolated area with overlay line', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": { "type": "area", "interpolate": "monotone" },
                "encoding": {
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "field": "price", "type": "quantitative" }
                },
                "config": { "area": { "line": {} } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": { "type": "area", "opacity": 0.7, "interpolate": "monotone" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "line", "interpolate": "monotone" },
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
                var normalizedSpec = spec_1.normalize(spec, spec.config);
                chai_1.assert.deepEqual(normalizedSpec, {
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
                var normalizedSpec = spec_1.normalize(spec, spec.config);
                chai_1.assert.deepEqual(normalizedSpec, {
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
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
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
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
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
        chai_1.assert.deepEqual(spec_1.normalize(spec, config_1.defaultConfig), {
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
        chai_1.assert.deepEqual(spec_1.normalize(spec, config_1.defaultConfig), spec);
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
        chai_1.assert.deepEqual(spec_1.normalize(spec, config_1.defaultConfig), {
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
        chai_1.assert.sameDeepMembers(spec_1.fieldDefs(spec), [
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
        chai_1.assert.sameDeepMembers(spec_1.fieldDefs(layerSpec), [
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
        chai_1.assert.sameDeepMembers(spec_1.fieldDefs(layerSpec), [
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
        chai_1.assert.sameDeepMembers(spec_1.fieldDefs(facetSpec), [
            { "field": "MPAA_Rating", "type": "ordinal" },
            { "field": "Worldwide_Gross", "type": "quantitative" },
            { "field": "US_DVD_Sales", "type": "quantitative" }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9zcGVjLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOEJBQThCO0FBQzlCLDZCQUE0QjtBQUk1QixzREFBa0M7QUFDbEMsb0NBQXlGO0FBQ3pGLDBDQUEwRDtBQUUxRCw0RUFBNEU7QUFFNUUsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUN0QixRQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsRUFBRSxDQUFDLHVFQUF1RSxFQUFFO1lBQzFFLElBQU0sSUFBSSxHQUFRO2dCQUNoQixNQUFNLEVBQUUsU0FBUztnQkFDakIsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsYUFBYSxFQUFFLGNBQWM7Z0JBQzdCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztnQkFDbkMsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQztvQkFDcEQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQ3hELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztpQkFDdEQ7YUFDRixDQUFDO1lBQ0YsSUFBTSxNQUFNLEdBQUcsbUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBUyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDeEMsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLGFBQWEsRUFBRSxjQUFjO2dCQUM3QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7Z0JBQ25DLE9BQU8sRUFBRTtvQkFDUCxRQUFR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b3RlbWFyayAqL1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge0ZpZWxkLCBGaWVsZERlZn0gZnJvbSAnLi4vc3JjL2ZpZWxkZGVmJztcbmltcG9ydCB7TG9jYWxMb2dnZXJ9IGZyb20gJy4uL3NyYy9sb2cnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtmaWVsZERlZnMsIG5vcm1hbGl6ZSwgTm9ybWFsaXplZFNwZWMsIFRvcExldmVsLCBUb3BMZXZlbFNwZWN9IGZyb20gJy4uL3NyYy9zcGVjJztcbmltcG9ydCB7ZGVmYXVsdENvbmZpZywgaW5pdENvbmZpZ30gZnJvbSAnLi8uLi9zcmMvY29uZmlnJztcblxuLy8gZGVzY3JpYmUoJ2lzU3RhY2tlZCgpJykgLS0gdGVzdGVkIGFzIHBhcnQgb2Ygc3RhY2tPZmZzZXQgaW4gc3RhY2sudGVzdC50c1xuXG5kZXNjcmliZSgnbm9ybWFsaXplKCknLCBmdW5jdGlvbiAoKSB7XG4gIGRlc2NyaWJlKCdub3JtYWxpemVGYWNldGVkVW5pdCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgc2luZ2xlIGV4dGVuZGVkIHNwZWMgd2l0aCBjb2x1bW4gaW50byBhIGNvbXBvc2l0ZSBzcGVjJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBzcGVjOiBhbnkgPSB7XG4gICAgICAgIFwibmFtZVwiOiBcImZhY2V0ZWRcIixcbiAgICAgICAgXCJ3aWR0aFwiOiAxMjMsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDIzNCxcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcImZhY2V0ZWQgc3BlY1wiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJjb2x1bW5cIjoge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiV29ybGR3aWRlX0dyb3NzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIlVTX0RWRF9TYWxlc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3QgY29uZmlnID0gaW5pdENvbmZpZyhzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG5vcm1hbGl6ZShzcGVjLCBjb25maWcpLCB7XG4gICAgICAgIFwibmFtZVwiOiBcImZhY2V0ZWRcIixcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcImZhY2V0ZWQgc3BlY1wiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgICAgXCJmYWNldFwiOiB7XG4gICAgICAgICAgXCJjb2x1bW5cIjoge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzcGVjXCI6IHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgIFwid2lkdGhcIjogMTIzLFxuICAgICAgICAgIFwiaGVpZ2h0XCI6IDIzNCxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIldvcmxkd2lkZV9Hcm9zc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIlVTX0RWRF9TYWxlc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgc2luZ2xlIGV4dGVuZGVkIHNwZWMgd2l0aCByb3cgaW50byBhIGNvbXBvc2l0ZSBzcGVjJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBzcGVjOiBhbnkgPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInJvd1wiOiB7XCJmaWVsZFwiOiBcIk1QQUFfUmF0aW5nXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJXb3JsZHdpZGVfR3Jvc3NcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiVVNfRFZEX1NhbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGNvbmZpZyA9IGluaXRDb25maWcoc3BlYy5jb25maWcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoc3BlYywgY29uZmlnKSwge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgICAgXCJmYWNldFwiOiB7XG4gICAgICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzcGVjXCI6IHtcbiAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiV29ybGR3aWRlX0dyb3NzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiVVNfRFZEX1NhbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ25vcm1hbGl6ZUZhY2V0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIG1lYW4gcG9pbnQgYW5kIHZlcnRpY2FsIGVycm9yIGJhcicsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplKHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgZXJyb3IgYmFyIHBsb3Qgc2hvd2luZyBtZWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbe1wiZmlsdGVyXCI6IFwiZGF0dW0ueWVhciA9PSAyMDAwXCJ9XSxcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBcInJvd1wiOiB7XCJmaWVsZFwiOiBcIk1QQUFfUmF0aW5nXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbGF5ZXI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiAyfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBtYXJrOiAnZXJyb3ItYmFyJyxcbiAgICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJBIGVycm9yIGJhciBwbG90IHNob3dpbmcgbWVhbiwgbWluLCBhbmQgbWF4IGluIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGluIDIwMDAuXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgXCJ0cmFuc2Zvcm1cIjogW3tcImZpbHRlclwiOiBcImRhdHVtLnllYXIgPT0gMjAwMFwifV0sXG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIGxheWVyOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogMn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJtYXJrXCI6IFwidGlja1wiLFxuICAgICAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgLy8gXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbm9ybWFsaXplTGF5ZXInLCAoKSA9PiB7XG4gICAgaXQoJ2NvcnJlY3RseSBwYXNzZXMgc2hhcmVkIHByb2plY3Rpb24gYW5kIGVuY29kaW5nIHRvIGNoaWxkcmVuIG9mIGxheWVyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gbm9ybWFsaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInByb2plY3Rpb25cIjoge1widHlwZVwiOiBcIm1lcmNhdG9yXCJ9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XCJtYXJrXCI6IFwicG9pbnRcIn0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAgICAgIHtcIm1hcmtcIjogXCJydWxlXCJ9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvdXRwdXQsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBsYXllcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XCJ0eXBlXCI6IFwibWVyY2F0b3JcIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XCJ0eXBlXCI6IFwibWVyY2F0b3JcIn0sXG4gICAgICAgICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1widHlwZVwiOiBcIm1lcmNhdG9yXCJ9LFxuICAgICAgICAgICAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ2NvcnJlY3RseSBvdmVycmlkZXMgc2hhcmVkIHByb2plY3Rpb24gYW5kIGVuY29kaW5nIGFuZCB0aHJvd3Mgd2FybmluZ3MnLCBsb2cud3JhcCgobG9jYWxMb2dnZXI6IExvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXQgPSBub3JtYWxpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwicHJvamVjdGlvblwiOiB7XCJ0eXBlXCI6IFwibWVyY2F0b3JcIn0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zLmxlbmd0aCwgMik7XG5cbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UucHJvamVjdGlvbk92ZXJyaWRkZW4oe1xuICAgICAgICBwYXJlbnRQcm9qZWN0aW9uOiB7XCJ0eXBlXCI6IFwibWVyY2F0b3JcIn0sXG4gICAgICAgIHByb2plY3Rpb246IHtcInR5cGVcIjogXCJhbGJlcnNVc2FcIn1cbiAgICAgIH0pKTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzFdLCBsb2cubWVzc2FnZS5lbmNvZGluZ092ZXJyaWRkZW4oWyd4J10pKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvdXRwdXQsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBsYXllcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XCJ0eXBlXCI6IFwiYWxiZXJzVXNhXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInByb2plY3Rpb25cIjoge1widHlwZVwiOiBcIm1lcmNhdG9yXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgcHJvZHVjZSBjb3JyZWN0IGxheWVyZWQgc3BlY3MgZm9yIG1lYW4gcG9pbnQgYW5kIHZlcnRpY2FsIGVycm9yIGJhcicsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBsYXllcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogMn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcms6ICdlcnJvci1iYXInLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBsYXllcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogMn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJtYXJrXCI6IFwidGlja1wiLFxuICAgICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgIC8vIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbm9ybWFsaXplUGF0aE92ZXJsYXknLCAoKSA9PiB7XG4gICAgaXQoJ2NvcnJlY3RseSBub3JtYWxpemVzIGxpbmUgd2l0aCBvdmVybGF5ZWQgcG9pbnQuJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImxpbmVcIjoge1wicG9pbnRcIjoge319fVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRTcGVjID0gbm9ybWFsaXplKHNwZWMsIHNwZWMuY29uZmlnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VG9wTGV2ZWw8Tm9ybWFsaXplZFNwZWM+Pihub3JtYWxpemVkU3BlYywge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcInBvaW50XCIsIFwib3BhY2l0eVwiOiAxLCBcImZpbGxlZFwiOiB0cnVlfSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImxpbmVcIjoge1wicG9pbnRcIjoge319fVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG5vcm1hbGl6ZXMgbGluZSB3aXRoIHRyYW5zcGFyZW50IHBvaW50IG92ZXJsYXllZC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbFNwZWMgPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwiLCBcInBvaW50XCI6IFwidHJhbnNwYXJlbnRcIn0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJwb2ludFwiLCBcIm9wYWNpdHlcIjogMCwgXCJmaWxsZWRcIjogdHJ1ZX0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbm9ybWFsaXplcyBsaW5lIHdpdGggcG9pbnQgb3ZlcmxheWVkIHZpYSBtYXJrIGRlZmluaXRpb24uJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImxpbmVcIiwgXCJwb2ludFwiOiB7XCJjb2xvclwiOiBcInJlZFwifX0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJwb2ludFwiLCBcIm9wYWNpdHlcIjogMSwgXCJmaWxsZWRcIjogdHJ1ZSwgXCJjb2xvclwiOiBcInJlZFwifSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBub3JtYWxpemVzIGZhY2V0ZWQgbGluZSBwbG90cyB3aXRoIG92ZXJsYXllZCBwb2ludC4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbFNwZWMgPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJsaW5lXCI6IHtcInBvaW50XCI6IHt9fX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJmYWNldFwiOiB7XG4gICAgICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgfSxcbiAgICAgICAgXCJzcGVjXCI6IHtcbiAgICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcInBvaW50XCIsIFwib3BhY2l0eVwiOiAxLCBcImZpbGxlZFwiOiB0cnVlfSxcbiAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImxpbmVcIjoge1wicG9pbnRcIjoge319fVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG5vcm1hbGl6ZXMgYXJlYSB3aXRoIG92ZXJsYXkgbGluZSBhbmQgcG9pbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbFNwZWMgPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1wiYXJlYVwiOiB7XCJsaW5lXCI6IHt9LCBcInBvaW50XCI6IHt9fX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImFyZWFcIiwgXCJvcGFjaXR5XCI6IDAuN30sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJsaW5lXCJ9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwicG9pbnRcIiwgXCJvcGFjaXR5XCI6IDEsIFwiZmlsbGVkXCI6IHRydWV9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcImFyZWFcIjoge1wibGluZVwiOiB7fSwgXCJwb2ludFwiOiB7fX19XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbm9ybWFsaXplcyBpbnRlcnBvbGF0ZWQgYXJlYSB3aXRoIG92ZXJsYXkgbGluZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsU3BlYyA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJhcmVhXCIsIFwiaW50ZXJwb2xhdGVcIjogXCJtb25vdG9uZVwifSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1wiYXJlYVwiOiB7XCJsaW5lXCI6IHt9fX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImFyZWFcIiwgXCJvcGFjaXR5XCI6IDAuNywgXCJpbnRlcnBvbGF0ZVwiOiBcIm1vbm90b25lXCJ9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwiLCBcImludGVycG9sYXRlXCI6IFwibW9ub3RvbmVcIn0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJjb25maWdcIjoge1wiYXJlYVwiOiB7XCJsaW5lXCI6IHt9fX1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBub3JtYWxpemVzIGFyZWEgd2l0aCBkaXNhYmxlZCBvdmVybGF5IHBvaW50IGFuZCBsaW5lLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgb3ZlcmxheSBvZiBbbnVsbCwgZmFsc2VdKSB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsU3BlYyA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwiYXJlYVwiLCBcInBvaW50XCI6IG92ZXJsYXksIFwibGluZVwiOiBvdmVybGF5fSxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRTcGVjID0gbm9ybWFsaXplKHNwZWMsIHNwZWMuY29uZmlnKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxUb3BMZXZlbDxOb3JtYWxpemVkU3BlYz4+KG5vcm1hbGl6ZWRTcGVjLCB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbm9ybWFsaXplcyBhcmVhIHdpdGggb3ZlcmxheSBwb2ludCBhbmQgbGluZSBkaXNhYmxlZCBpbiBjb25maWcuJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBvdmVybGF5IG9mIFtudWxsLCBmYWxzZV0pIHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJhcmVhXCJ9LFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJhcmVhXCI6IHtcInBvaW50XCI6IG92ZXJsYXksIFwibGluZVwiOiBvdmVybGF5fVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFNwZWMgPSBub3JtYWxpemUoc3BlYywgc3BlYy5jb25maWcpO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwiYXJlYVwiOiB7XCJwb2ludFwiOiBvdmVybGF5LCBcImxpbmVcIjogb3ZlcmxheX1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBub3JtYWxpemVzIHN0YWNrZWQgYXJlYSB3aXRoIG92ZXJsYXkgbGluZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsU3BlYyA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1wiYXJlYVwiOiB7XCJsaW5lXCI6IHt9fX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImFyZWFcIiwgXCJvcGFjaXR5XCI6IDAuN30sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImxpbmVcIn0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IFwiemVyb1wifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJhcmVhXCI6IHtcImxpbmVcIjoge319fVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG5vcm1hbGl6ZXMgc3RyZWFtZ3JhcGggd2l0aCBvdmVybGF5IGxpbmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbFNwZWMgPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIiwgXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJwcmljZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzdGFja1wiOiBcImNlbnRlclwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb25maWdcIjoge1wiYXJlYVwiOiB7XCJsaW5lXCI6IHt9fX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImFyZWFcIiwgXCJvcGFjaXR5XCI6IDAuN30sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IFwiY2VudGVyXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwifSxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic3RhY2tcIjogXCJjZW50ZXJcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJjb25maWdcIjoge1wiYXJlYVwiOiB7XCJsaW5lXCI6IHt9fX1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnbm9ybWFsaXplUmFuZ2VkVW5pdFNwZWMnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgY29udmVydCB5MiAtPiB5IGlmIHRoZXJlIGlzIG5vIHkgaW4gdGhlIGVuY29kaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFNwZWMgPSB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5MlwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtaW5cIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieDJcIjoge1wiYWdncmVnYXRlXCI6IFwibWF4XCIsIFwiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8Tm9ybWFsaXplZFNwZWM+KG5vcm1hbGl6ZShzcGVjLCBkZWZhdWx0Q29uZmlnKSwge1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtaW5cIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieDJcIjoge1wiYWdncmVnYXRlXCI6IFwibWF4XCIsIFwiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZG8gbm90aGluZyBpZiB0aGVyZSBpcyBubyBtaXNzaW5nIHggb3IgeScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRTcGVjID0ge1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtaW5cIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieDJcIjoge1wiYWdncmVnYXRlXCI6IFwibWF4XCIsIFwiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplKHNwZWMsIGRlZmF1bHRDb25maWcpLCBzcGVjKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjb252ZXJ0IHgyIC0+IHggaWYgdGhlcmUgaXMgbm8geCBpbiB0aGUgZW5jb2RpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcGVjOiBOb3JtYWxpemVkU3BlYyA9IHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcIngyXCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5MlwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtYXhcIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxOb3JtYWxpemVkU3BlYz4obm9ybWFsaXplKHNwZWMsIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5MlwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtYXhcIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2ZpZWxkRGVmcygpJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdzaG91bGQgZ2V0IGFsbCBub24tZHVwbGljYXRlIGZpZWxkRGVmcyBmcm9tIGFuIGVuY29kaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogYW55ID0ge1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9LFxuICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnM8RmllbGREZWY8RmllbGQ+PihmaWVsZERlZnMoc3BlYyksIFtcbiAgICAgIHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGdldCBhbGwgbm9uLWR1cGxpY2F0ZSBmaWVsZERlZnMgZnJvbSBhbGwgbGF5ZXIgaW4gYSBMYXllclNwZWMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBsYXllclNwZWM6IGFueSA9IHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIixcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkdvb2dsZSdzIHN0b2NrIHByaWNlIG92ZXIgdGltZS5cIixcbiAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XCJtYXJrXCI6IHtcImZpbGxlZFwiOiB0cnVlfX1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG5cbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzPEZpZWxkRGVmPEZpZWxkPj4oZmllbGREZWZzKGxheWVyU3BlYyksIFtcbiAgICAgIHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBnZXQgYWxsIG5vbi1kdXBsaWNhdGUgZmllbGREZWZzIGZyb20gYWxsIGxheWVyIGluIGEgTGF5ZXJTcGVjIChtZXJnaW5nIGR1cGxpY2F0ZSBmaWVsZHMgd2l0aCBkaWZmZXJlbnQgc2NhbGUgdHlwZXMpJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbGF5ZXJTcGVjOiBhbnkgPSB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICBcImxheWVyXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiR29vZ2xlJ3Mgc3RvY2sgcHJpY2Ugb3ZlciB0aW1lLlwiLFxuICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IFwicG93XCJ9fVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1wibWFya1wiOiB7XCJmaWxsZWRcIjogdHJ1ZX19XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuXG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVyczxGaWVsZERlZjxGaWVsZD4+KGZpZWxkRGVmcyhsYXllclNwZWMpLCBbXG4gICAgICB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgIHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBnZXQgYWxsIG5vbi1kdXBsaWNhdGUgZmllbGREZWZzIGZyb20gZmFjZXQgYW5kIGxheWVyIGluIGEgRmFjZXRTcGVjJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZmFjZXRTcGVjOiBhbnkgPSB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9tb3ZpZXMuanNvblwifSxcbiAgICAgIFwiZmFjZXRcIjoge1wicm93XCI6IHtcImZpZWxkXCI6IFwiTVBBQV9SYXRpbmdcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9fSxcbiAgICAgIFwic3BlY1wiOiB7XG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIldvcmxkd2lkZV9Hcm9zc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJVU19EVkRfU2FsZXNcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzPEZpZWxkRGVmPEZpZWxkPj4oZmllbGREZWZzKGZhY2V0U3BlYyksIFtcbiAgICAgIHtcImZpZWxkXCI6IFwiTVBBQV9SYXRpbmdcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAge1wiZmllbGRcIjogXCJXb3JsZHdpZGVfR3Jvc3NcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICB7XCJmaWVsZFwiOiBcIlVTX0RWRF9TYWxlc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgIF0pO1xuICB9KTtcbn0pO1xuIl19