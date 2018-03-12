"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var log = require("../src/log");
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
    describe('normalizeOverlay', function () {
        it('correctly normalizes line with overlayed point.', function () {
            var spec = {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "mark": "line",
                "encoding": {
                    "x": { "field": "date", "type": "temporal" },
                    "y": { "field": "price", "type": "quantitative" }
                },
                "config": { "overlay": { "line": true } }
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
                        "mark": { "type": "point", "filled": true, "style": "pointOverlay" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    }
                ],
                "config": { "overlay": { "line": true } }
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
                "config": { "overlay": { "line": true } }
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
                            "mark": { "type": "point", "filled": true, "style": "pointOverlay" },
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            }
                        }
                    ],
                },
                "config": { "overlay": { "line": true } }
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
                "config": { "overlay": { "area": 'linepoint' } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": "area",
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "line", "style": "lineOverlay" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "point", "filled": true, "style": "pointOverlay" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    }
                ],
                "config": { "overlay": { "area": 'linepoint' } }
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
                "config": { "overlay": { "area": 'line' } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": "area",
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "line", "style": "lineOverlay" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    }
                ],
                "config": { "overlay": { "area": 'line' } }
            });
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
                "config": { "overlay": { "area": 'line' } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": "area",
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "aggregate": "sum", "field": "price", "type": "quantitative" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    },
                    {
                        "mark": { "type": "line", "style": "lineOverlay" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "aggregate": "sum", "field": "price", "type": "quantitative", "stack": "zero" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    }
                ],
                "config": { "overlay": { "area": 'line' } }
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
                "config": { "overlay": { "area": 'line' } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                "layer": [
                    {
                        "mark": "area",
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "aggregate": "sum", "field": "price", "type": "quantitative", "stack": "center" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    },
                    {
                        "mark": { "type": "line", "style": "lineOverlay" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "aggregate": "sum", "field": "price", "type": "quantitative", "stack": "center" },
                            "color": { "field": "symbol", "type": "nominal" }
                        }
                    }
                ],
                "config": { "overlay": { "area": 'line' } }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9zcGVjLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4QkFBOEI7QUFDOUIsNkJBQTRCO0FBSTVCLGdDQUFrQztBQUNsQyxvQ0FBeUY7QUFDekYsMENBQTBEO0FBRTFELDRFQUE0RTtBQUU1RSxRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3RCLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtRQUMvQixFQUFFLENBQUMsdUVBQXVFLEVBQUU7WUFDMUUsSUFBTSxJQUFJLEdBQVE7Z0JBQ2hCLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixPQUFPLEVBQUUsR0FBRztnQkFDWixRQUFRLEVBQUUsR0FBRztnQkFDYixhQUFhLEVBQUUsY0FBYztnQkFDN0IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO2dCQUNuQyxNQUFNLEVBQUUsT0FBTztnQkFDZixVQUFVLEVBQUU7b0JBQ1YsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDO29CQUNwRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDeEQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUN0RDthQUNGLENBQUM7WUFDRixJQUFNLE1BQU0sR0FBRyxtQkFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QyxhQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUN4QyxNQUFNLEVBQUUsU0FBUztnQkFDakIsYUFBYSxFQUFFLGNBQWM7Z0JBQzdCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztnQkFDbkMsT0FBTyxFQUFFO29CQUNQLFFBQVEs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TyxFQUFFLGNBQWMsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO2lCQUN0RDthQUNGO1NBQ0YsQ0FBQztRQUVGLGFBQU0sQ0FBQyxlQUFlLENBQWtCLGdCQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDNUQsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7WUFDMUMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztTQUNqRCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7RmllbGQsIEZpZWxkRGVmfSBmcm9tICcuLi9zcmMvZmllbGRkZWYnO1xuaW1wb3J0IHtMb2NhbExvZ2dlcn0gZnJvbSAnLi4vc3JjL2xvZyc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vc3JjL2xvZyc7XG5pbXBvcnQge2ZpZWxkRGVmcywgbm9ybWFsaXplLCBOb3JtYWxpemVkU3BlYywgVG9wTGV2ZWwsIFRvcExldmVsU3BlY30gZnJvbSAnLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHtkZWZhdWx0Q29uZmlnLCBpbml0Q29uZmlnfSBmcm9tICcuLy4uL3NyYy9jb25maWcnO1xuXG4vLyBkZXNjcmliZSgnaXNTdGFja2VkKCknKSAtLSB0ZXN0ZWQgYXMgcGFydCBvZiBzdGFja09mZnNldCBpbiBzdGFjay50ZXN0LnRzXG5cbmRlc2NyaWJlKCdub3JtYWxpemUoKScsIGZ1bmN0aW9uICgpIHtcbiAgZGVzY3JpYmUoJ25vcm1hbGl6ZUZhY2V0ZWRVbml0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29udmVydCBzaW5nbGUgZXh0ZW5kZWQgc3BlYyB3aXRoIGNvbHVtbiBpbnRvIGEgY29tcG9zaXRlIHNwZWMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHNwZWM6IGFueSA9IHtcbiAgICAgICAgXCJuYW1lXCI6IFwiZmFjZXRlZFwiLFxuICAgICAgICBcIndpZHRoXCI6IDEyMyxcbiAgICAgICAgXCJoZWlnaHRcIjogMjM0LFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiZmFjZXRlZCBzcGVjXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcImNvbHVtblwiOiB7XCJmaWVsZFwiOiBcIk1QQUFfUmF0aW5nXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJXb3JsZHdpZGVfR3Jvc3NcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiVVNfRFZEX1NhbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBjb25maWcgPSBpbml0Q29uZmlnKHNwZWMuY29uZmlnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobm9ybWFsaXplKHNwZWMsIGNvbmZpZyksIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiZmFjZXRlZFwiLFxuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiZmFjZXRlZCBzcGVjXCIsXG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgICBcImZhY2V0XCI6IHtcbiAgICAgICAgICBcImNvbHVtblwiOiB7XCJmaWVsZFwiOiBcIk1QQUFfUmF0aW5nXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBcInNwZWNcIjoge1xuICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgXCJ3aWR0aFwiOiAxMjMsXG4gICAgICAgICAgXCJoZWlnaHRcIjogMjM0LFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiV29ybGR3aWRlX0dyb3NzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiVVNfRFZEX1NhbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY29udmVydCBzaW5nbGUgZXh0ZW5kZWQgc3BlYyB3aXRoIHJvdyBpbnRvIGEgY29tcG9zaXRlIHNwZWMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHNwZWM6IGFueSA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvbW92aWVzLmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwicm93XCI6IHtcImZpZWxkXCI6IFwiTVBBQV9SYXRpbmdcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIldvcmxkd2lkZV9Hcm9zc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJVU19EVkRfU2FsZXNcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgY29uc3QgY29uZmlnID0gaW5pdENvbmZpZyhzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG5vcm1hbGl6ZShzcGVjLCBjb25maWcpLCB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgICBcImZhY2V0XCI6IHtcbiAgICAgICAgICBcInJvd1wiOiB7XCJmaWVsZFwiOiBcIk1QQUFfUmF0aW5nXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBcInNwZWNcIjoge1xuICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJXb3JsZHdpZGVfR3Jvc3NcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJVU19EVkRfU2FsZXNcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbm9ybWFsaXplRmFjZXQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgbWVhbiBwb2ludCBhbmQgdmVydGljYWwgZXJyb3IgYmFyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoe1xuICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiQSBlcnJvciBiYXIgcGxvdCBzaG93aW5nIG1lYW4sIG1pbiwgYW5kIG1heCBpbiB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBpbiAyMDAwLlwiLFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwidHJhbnNmb3JtXCI6IFt7XCJmaWx0ZXJcIjogXCJkYXR1bS55ZWFyID09IDIwMDBcIn1dLFxuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIFwicm93XCI6IHtcImZpZWxkXCI6IFwiTVBBQV9SYXRpbmdcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBsYXllcjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIixcbiAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDJ9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG1hcms6ICdlcnJvci1iYXInLFxuICAgICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSwgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgZXJyb3IgYmFyIHBsb3Qgc2hvd2luZyBtZWFuLCBtaW4sIGFuZCBtYXggaW4gdGhlIFVTIHBvcHVsYXRpb24gZGlzdHJpYnV0aW9uIG9mIGFnZSBncm91cHMgaW4gMjAwMC5cIixcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgICBcInRyYW5zZm9ybVwiOiBbe1wiZmlsdGVyXCI6IFwiZGF0dW0ueWVhciA9PSAyMDAwXCJ9XSxcbiAgICAgICAgZmFjZXQ6IHtcbiAgICAgICAgICBcInJvd1wiOiB7XCJmaWVsZFwiOiBcIk1QQUFfUmF0aW5nXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbGF5ZXI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCIsXG4gICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiAyfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWF4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAvLyBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdub3JtYWxpemVMYXllcicsICgpID0+IHtcbiAgICBpdCgnY29ycmVjdGx5IHBhc3NlcyBzaGFyZWQgcHJvamVjdGlvbiBhbmQgZW5jb2RpbmcgdG8gY2hpbGRyZW4gb2YgbGF5ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdXRwdXQgPSBub3JtYWxpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIFwicHJvamVjdGlvblwiOiB7XCJ0eXBlXCI6IFwibWVyY2F0b3JcIn0sXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFnZVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcIm1hcmtcIjogXCJwb2ludFwifSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICAgICAge1wibWFya1wiOiBcInJ1bGVcIn0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICBcInRleHRcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG91dHB1dCwge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIGxheWVyOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcInR5cGVcIjogXCJtZXJjYXRvclwifSxcbiAgICAgICAgICAgIFwibWFya1wiOiBcInBvaW50XCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcInR5cGVcIjogXCJtZXJjYXRvclwifSxcbiAgICAgICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XCJ0eXBlXCI6IFwibWVyY2F0b3JcIn0sXG4gICAgICAgICAgICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgICAgICAgICBcInRleHRcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnY29ycmVjdGx5IG92ZXJyaWRlcyBzaGFyZWQgcHJvamVjdGlvbiBhbmQgZW5jb2RpbmcgYW5kIHRocm93cyB3YXJuaW5ncycsIGxvZy53cmFwKChsb2NhbExvZ2dlcjogTG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dCA9IG5vcm1hbGl6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcInR5cGVcIjogXCJtZXJjYXRvclwifSxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcInR5cGVcIjogXCJhbGJlcnNVc2FcIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIGRlZmF1bHRDb25maWcpO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnMubGVuZ3RoLCAyKTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5wcm9qZWN0aW9uT3ZlcnJpZGRlbih7XG4gICAgICAgIHBhcmVudFByb2plY3Rpb246IHtcInR5cGVcIjogXCJtZXJjYXRvclwifSxcbiAgICAgICAgcHJvamVjdGlvbjoge1widHlwZVwiOiBcImFsYmVyc1VzYVwifVxuICAgICAgfSkpO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMV0sIGxvZy5tZXNzYWdlLmVuY29kaW5nT3ZlcnJpZGRlbihbJ3gnXSkpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG91dHB1dCwge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIGxheWVyOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJwcm9qZWN0aW9uXCI6IHtcInR5cGVcIjogXCJhbGJlcnNVc2FcIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwicHJvamVjdGlvblwiOiB7XCJ0eXBlXCI6IFwibWVyY2F0b3JcIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCBwcm9kdWNlIGNvcnJlY3QgbGF5ZXJlZCBzcGVjcyBmb3IgbWVhbiBwb2ludCBhbmQgdmVydGljYWwgZXJyb3IgYmFyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIGxheWVyOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiAyfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWFyazogJ2Vycm9yLWJhcicsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJzaXplXCI6IHtcInZhbHVlXCI6IDV9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCBkZWZhdWx0Q29uZmlnKSwge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICAgIGxheWVyOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWVhblwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICBcImF4aXNcIjoge1widGl0bGVcIjogXCJwb3B1bGF0aW9uXCJ9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiAyfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtaW5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLFxuICAgICAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwicGVvcGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJtYXJrXCI6IFwidGlja1wiLFxuICAgICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYWdncmVnYXRlXCI6IFwibWluXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJwZW9wbGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYXhpc1wiOiB7XCJ0aXRsZVwiOiBcInBvcHVsYXRpb25cIn1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBcInNpemVcIjoge1widmFsdWVcIjogNX1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJhZ2dyZWdhdGVcIjogXCJtYXhcIixcbiAgICAgICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcInBlb3BsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIixcbiAgICAgICAgICAgICAgICAgICAgLy8gXCJheGlzXCI6IHtcInRpdGxlXCI6IFwicG9wdWxhdGlvblwifVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIFwic2l6ZVwiOiB7XCJ2YWx1ZVwiOiA1fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdub3JtYWxpemVPdmVybGF5JywgKCkgPT4ge1xuICAgIGl0KCdjb3JyZWN0bHkgbm9ybWFsaXplcyBsaW5lIHdpdGggb3ZlcmxheWVkIHBvaW50LicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsU3BlYyA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJvdmVybGF5XCI6IHtcImxpbmVcIjogdHJ1ZX19XG4gICAgICB9O1xuICAgICAgY29uc3Qgbm9ybWFsaXplZFNwZWMgPSBub3JtYWxpemUoc3BlYywgc3BlYy5jb25maWcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxUb3BMZXZlbDxOb3JtYWxpemVkU3BlYz4+KG5vcm1hbGl6ZWRTcGVjLCB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIixcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcInBvaW50XCIsIFwiZmlsbGVkXCI6IHRydWUsIFwic3R5bGVcIjogXCJwb2ludE92ZXJsYXlcIn0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJjb25maWdcIjoge1wib3ZlcmxheVwiOiB7XCJsaW5lXCI6IHRydWV9fVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG5vcm1hbGl6ZXMgZmFjZXRlZCBsaW5lIHBsb3RzIHdpdGggb3ZlcmxheWVkIHBvaW50LicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsU3BlYyA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInJvd1wiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm92ZXJsYXlcIjoge1wibGluZVwiOiB0cnVlfX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImZhY2V0XCI6IHtcbiAgICAgICAgICBcInJvd1wiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICB9LFxuICAgICAgICBcInNwZWNcIjoge1xuICAgICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJwb2ludFwiLCBcImZpbGxlZFwiOiB0cnVlLCBcInN0eWxlXCI6IFwicG9pbnRPdmVybGF5XCJ9LFxuICAgICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm92ZXJsYXlcIjoge1wibGluZVwiOiB0cnVlfX1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2NvcnJlY3RseSBub3JtYWxpemVzIGFyZWEgd2l0aCBvdmVybGF5IGxpbmUgYW5kIHBvaW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm92ZXJsYXlcIjoge1wiYXJlYVwiOiAnbGluZXBvaW50J319XG4gICAgICB9O1xuICAgICAgY29uc3Qgbm9ybWFsaXplZFNwZWMgPSBub3JtYWxpemUoc3BlYywgc3BlYy5jb25maWcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxUb3BMZXZlbDxOb3JtYWxpemVkU3BlYz4+KG5vcm1hbGl6ZWRTcGVjLCB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIixcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwiLCBcInN0eWxlXCI6IFwibGluZU92ZXJsYXlcIn0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJtYXJrXCI6IHtcInR5cGVcIjogXCJwb2ludFwiLCBcImZpbGxlZFwiOiB0cnVlLCBcInN0eWxlXCI6IFwicG9pbnRPdmVybGF5XCJ9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm92ZXJsYXlcIjoge1wiYXJlYVwiOiAnbGluZXBvaW50J319XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbm9ybWFsaXplcyBhcmVhIHdpdGggb3ZlcmxheSBsaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm92ZXJsYXlcIjoge1wiYXJlYVwiOiAnbGluZSd9fVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZWRTcGVjID0gbm9ybWFsaXplKHNwZWMsIHNwZWMuY29uZmlnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VG9wTGV2ZWw8Tm9ybWFsaXplZFNwZWM+Pihub3JtYWxpemVkU3BlYywge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsXCJmb3JtYXRcIjoge1widHlwZVwiOiBcImNzdlwifX0sXG4gICAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiBcImFyZWFcIixcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImxpbmVcIiwgXCJzdHlsZVwiOiBcImxpbmVPdmVybGF5XCJ9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm92ZXJsYXlcIjoge1wiYXJlYVwiOiAnbGluZSd9fVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnY29ycmVjdGx5IG5vcm1hbGl6ZXMgc3RhY2tlZCBhcmVhIHdpdGggb3ZlcmxheSBsaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9zdG9ja3MuY3N2XCIsIFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwicHJpY2VcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJvdmVybGF5XCI6IHtcImFyZWFcIjogJ2xpbmUnfX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInN5bWJvbFwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjoge1widHlwZVwiOiBcImxpbmVcIiwgXCJzdHlsZVwiOiBcImxpbmVPdmVybGF5XCJ9LFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzdGFja1wiOiBcInplcm9cIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJjb25maWdcIjoge1wib3ZlcmxheVwiOiB7XCJhcmVhXCI6ICdsaW5lJ319XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdjb3JyZWN0bHkgbm9ybWFsaXplcyBzdHJlYW1ncmFwaCB3aXRoIG92ZXJsYXkgbGluZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsU3BlYyA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLCBcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgICAgXCJtYXJrXCI6IFwiYXJlYVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInByaWNlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IFwiY2VudGVyXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9LFxuICAgICAgICBcImNvbmZpZ1wiOiB7XCJvdmVybGF5XCI6IHtcImFyZWFcIjogJ2xpbmUnfX1cbiAgICAgIH07XG4gICAgICBjb25zdCBub3JtYWxpemVkU3BlYyA9IG5vcm1hbGl6ZShzcGVjLCBzcGVjLmNvbmZpZyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsPFRvcExldmVsPE5vcm1hbGl6ZWRTcGVjPj4obm9ybWFsaXplZFNwZWMsIHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgICBcImxheWVyXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcIm1hcmtcIjogXCJhcmVhXCIsXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IFwiY2VudGVyXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwibWFya1wiOiB7XCJ0eXBlXCI6IFwibGluZVwiLCBcInN0eWxlXCI6IFwibGluZU92ZXJsYXlcIn0sXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IFwiY2VudGVyXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIFwiY29uZmlnXCI6IHtcIm92ZXJsYXlcIjoge1wiYXJlYVwiOiAnbGluZSd9fVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdub3JtYWxpemVSYW5nZWRVbml0U3BlYycsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBjb252ZXJ0IHkyIC0+IHkgaWYgdGhlcmUgaXMgbm8geSBpbiB0aGUgZW5jb2RpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcGVjOiBOb3JtYWxpemVkU3BlYyA9IHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInkyXCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ4MlwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtYXhcIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxOb3JtYWxpemVkU3BlYz4obm9ybWFsaXplKHNwZWMsIGRlZmF1bHRDb25maWcpLCB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ4MlwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtYXhcIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBkbyBub3RoaW5nIGlmIHRoZXJlIGlzIG5vIG1pc3NpbmcgeCBvciB5JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFNwZWMgPSB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9wb3B1bGF0aW9uLmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYWdlXCIsXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1pblwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ4MlwiOiB7XCJhZ2dyZWdhdGVcIjogXCJtYXhcIiwgXCJmaWVsZFwiOiBcInBlb3BsZVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbChub3JtYWxpemUoc3BlYywgZGVmYXVsdENvbmZpZyksIHNwZWMpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGNvbnZlcnQgeDIgLT4geCBpZiB0aGVyZSBpcyBubyB4IGluIHRoZSBlbmNvZGluZycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRTcGVjID0ge1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvcG9wdWxhdGlvbi5qc29uXCJ9LFxuICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieDJcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWluXCIsIFwiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInkyXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH07XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPE5vcm1hbGl6ZWRTcGVjPihub3JtYWxpemUoc3BlYywgZGVmYXVsdENvbmZpZyksIHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3BvcHVsYXRpb24uanNvblwifSxcbiAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhZ2VcIixcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWluXCIsIFwiZmllbGRcIjogXCJwZW9wbGVcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInkyXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1heFwiLCBcImZpZWxkXCI6IFwicGVvcGxlXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnZmllbGREZWZzKCknLCBmdW5jdGlvbigpIHtcbiAgaXQoJ3Nob3VsZCBnZXQgYWxsIG5vbi1kdXBsaWNhdGUgZmllbGREZWZzIGZyb20gYW4gZW5jb2RpbmcnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcGVjOiBhbnkgPSB7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVyczxGaWVsZERlZjxGaWVsZD4+KGZpZWxkRGVmcyhzcGVjKSwgW1xuICAgICAge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgZ2V0IGFsbCBub24tZHVwbGljYXRlIGZpZWxkRGVmcyBmcm9tIGFsbCBsYXllciBpbiBhIExheWVyU3BlYycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGxheWVyU3BlYzogYW55ID0ge1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvc3RvY2tzLmNzdlwiLFwiZm9ybWF0XCI6IHtcInR5cGVcIjogXCJjc3ZcIn19LFxuICAgICAgXCJsYXllclwiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiR29vZ2xlJ3Mgc3RvY2sgcHJpY2Ugb3ZlciB0aW1lLlwiLFxuICAgICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkdvb2dsZSdzIHN0b2NrIHByaWNlIG92ZXIgdGltZS5cIixcbiAgICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwicHJpY2VcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic3ltYm9sXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcIm1hcmtcIjoge1wiZmlsbGVkXCI6IHRydWV9fVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcblxuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnM8RmllbGREZWY8RmllbGQ+PihmaWVsZERlZnMobGF5ZXJTcGVjKSwgW1xuICAgICAge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAge1wiZmllbGRcIjogXCJzeW1ib2xcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGdldCBhbGwgbm9uLWR1cGxpY2F0ZSBmaWVsZERlZnMgZnJvbSBhbGwgbGF5ZXIgaW4gYSBMYXllclNwZWMgKG1lcmdpbmcgZHVwbGljYXRlIGZpZWxkcyB3aXRoIGRpZmZlcmVudCBzY2FsZSB0eXBlcyknLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBsYXllclNwZWM6IGFueSA9IHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL3N0b2Nrcy5jc3ZcIixcImZvcm1hdFwiOiB7XCJ0eXBlXCI6IFwiY3N2XCJ9fSxcbiAgICAgIFwibGF5ZXJcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkdvb2dsZSdzIHN0b2NrIHByaWNlIG92ZXIgdGltZS5cIixcbiAgICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJkYXRlXCIsXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJHb29nbGUncyBzdG9jayBwcmljZSBvdmVyIHRpbWUuXCIsXG4gICAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInByaWNlXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImRhdGVcIixcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLCBcInNjYWxlXCI6IHtcInR5cGVcIjogXCJwb3dcIn19XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XCJtYXJrXCI6IHtcImZpbGxlZFwiOiB0cnVlfX1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG5cbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzPEZpZWxkRGVmPEZpZWxkPj4oZmllbGREZWZzKGxheWVyU3BlYyksIFtcbiAgICAgIHtcImZpZWxkXCI6IFwiZGF0ZVwiLFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9LFxuICAgICAge1wiZmllbGRcIjogXCJwcmljZVwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgIF0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGdldCBhbGwgbm9uLWR1cGxpY2F0ZSBmaWVsZERlZnMgZnJvbSBmYWNldCBhbmQgbGF5ZXIgaW4gYSBGYWNldFNwZWMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBmYWNldFNwZWM6IGFueSA9IHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL21vdmllcy5qc29uXCJ9LFxuICAgICAgXCJmYWNldFwiOiB7XCJyb3dcIjoge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn19LFxuICAgICAgXCJzcGVjXCI6IHtcbiAgICAgICAgXCJtYXJrXCI6IFwicG9pbnRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiV29ybGR3aWRlX0dyb3NzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIlVTX0RWRF9TYWxlc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnM8RmllbGREZWY8RmllbGQ+PihmaWVsZERlZnMoZmFjZXRTcGVjKSwgW1xuICAgICAge1wiZmllbGRcIjogXCJNUEFBX1JhdGluZ1wiLFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICB7XCJmaWVsZFwiOiBcIldvcmxkd2lkZV9Hcm9zc1wiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIHtcImZpZWxkXCI6IFwiVVNfRFZEX1NhbGVzXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgXSk7XG4gIH0pO1xufSk7XG4iXX0=