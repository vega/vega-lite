"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
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
                "width": 123,
                "height": 234,
                "name": "faceted",
                "description": "faceted spec",
                "data": { "url": "data/movies.json" },
                "facet": {
                    "column": { "field": "MPAA_Rating", "type": "ordinal" }
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
            chai_1.assert.deepEqual(spec_1.normalize(spec, spec.config), {
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
        it('should produce correct layered specs for mean point and vertical error bar', function () {
            chai_1.assert.deepEqual(spec_1.normalize({
                "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                "transform": [{ "filter": "datum.year == 2000" }],
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
                "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                "transform": [{ "filter": "datum.year == 2000" }],
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
                        "mark": { "type": "point", "filled": true, "role": "pointOverlay" },
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
                            "mark": { "type": "point", "filled": true, "role": "pointOverlay" },
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
                        "mark": { "type": "line", "role": "lineOverlay" },
                        "encoding": {
                            "x": { "field": "date", "type": "temporal" },
                            "y": { "field": "price", "type": "quantitative" }
                        }
                    },
                    {
                        "mark": { "type": "point", "filled": true, "role": "pointOverlay" },
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
                        "mark": { "type": "line", "role": "lineOverlay" },
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
                        "mark": { "type": "line", "role": "lineOverlay" },
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
                        "mark": { "type": "line", "role": "lineOverlay" },
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
        chai_1.assert.deepEqual(spec_1.fieldDefs(spec), [
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
        chai_1.assert.deepEqual(spec_1.fieldDefs(layerSpec), [
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
        chai_1.assert.deepEqual(spec_1.fieldDefs(layerSpec), [
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
        chai_1.assert.deepEqual(spec_1.fieldDefs(facetSpec), [
            { "field": "MPAA_Rating", "type": "ordinal" },
            { "field": "Worldwide_Gross", "type": "quantitative" },
            { "field": "US_DVD_Sales", "type": "quantitative" }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9zcGVjLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBSTVCLG9DQUEyRztBQUMzRywwQ0FBa0U7QUFFbEUsNEVBQTRFO0FBRTVFLFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1FBQy9CLEVBQUUsQ0FBQyx1RUFBdUUsRUFBRTtZQUMxRSxJQUFNLElBQUksR0FBUTtnQkFDaEIsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLE9BQU8sRUFBRSxHQUFHO2dCQUNaLFFBQVEsRUFBRSxHQUFHO2dCQUNiLGFBQWEsRUFBRSxjQUFjO2dCQUM3QixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7Z0JBQ25DLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFVBQVUsRUFBRTtvQkFDVixRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUM7b0JBQ3BELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUN4RCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7aUJBQ3REO2FBQ0YsQ0FBQztZQUNGLElBQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZDLGFBQU0sQ0FBQyxTQUFTLENBQWtFLGdCQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUN6RyxPQUFPLEVBQUUsR0FBRztnQkFDWixRQUFRLEVBQUUsR0FBRztnQkFDYixNQUFNLEVBQUUsU0FBUztnQkFDakIsYUFBYSxFQUFFLGNBQWM7Z0JBQzdCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFB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