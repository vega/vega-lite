/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var spec_1 = require("../src/spec");
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
            chai_1.assert.deepEqual(spec_1.normalize(spec), {
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
            chai_1.assert.deepEqual(spec_1.normalize(spec), {
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
                "transform": { "filter": "datum.year == 2000" },
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
            }), {
                "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                "transform": { "filter": "datum.year == 2000" },
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
                "transform": { "filter": "datum.year == 2000" },
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
            }), {
                "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                "transform": { "filter": "datum.year == 2000" },
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
    describe('normalizeErrorBar', function () {
        it('should produce correct layered specs for horizontal error bar', function () {
            chai_1.assert.deepEqual(spec_1.normalize({
                "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                "transform": { "filter": "datum.year == 2000" },
                mark: 'error-bar',
                encoding: {
                    "y": { "field": "age", "type": "ordinal" },
                    "x": {
                        "aggregate": "min",
                        "field": "people",
                        "type": "quantitative",
                        "axis": { "title": "population" }
                    },
                    "x2": {
                        "aggregate": "max",
                        "field": "people",
                        "type": "quantitative"
                    },
                    "size": { "value": 5 }
                }
            }), {
                "description": "A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.",
                "data": { "url": "data/population.json" },
                "transform": { "filter": "datum.year == 2000" },
                "layer": [
                    {
                        "mark": "rule",
                        "encoding": {
                            "y": { "field": "age", "type": "ordinal" },
                            "x": {
                                "aggregate": "min",
                                "field": "people",
                                "type": "quantitative",
                                "axis": { "title": "population" }
                            },
                            "x2": {
                                "aggregate": "max",
                                "field": "people",
                                "type": "quantitative"
                            }
                        }
                    },
                    {
                        "mark": "tick",
                        "encoding": {
                            "y": { "field": "age", "type": "ordinal" },
                            "x": {
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
                            "y": { "field": "age", "type": "ordinal" },
                            "x": {
                                "aggregate": "max",
                                "field": "people",
                                "type": "quantitative",
                            },
                            "size": { "value": 5 }
                        }
                    }
                ]
            });
        });
    });
    describe('normalizeOverlay', function () {
        describe('line', function () {
            it('should be normalized correctly', function () {
                var spec = {
                    "description": "Google's stock price over time.",
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "transform": { "filter": "datum[\"symbol\"]==='GOOG'" },
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" }
                    },
                    "config": { "overlay": { "line": true } }
                };
                var normalizedSpec = spec_1.normalize(spec);
                chai_1.assert.deepEqual(normalizedSpec, {
                    "description": "Google's stock price over time.",
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "transform": { "filter": "datum[\"symbol\"]==='GOOG'" },
                    "layer": [
                        {
                            "mark": "line",
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            }
                        },
                        {
                            "mark": "point",
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            },
                            "config": { "mark": { "filled": true } }
                        }
                    ]
                });
            });
        });
        describe('area', function () {
            it('with linepoint should be normalized correctly', function () {
                var spec = {
                    "description": "Google's stock price over time.",
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "transform": { "filter": "datum[\"symbol\"]==='GOOG'" },
                    "mark": "area",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" }
                    },
                    "config": { "overlay": { "area": 'linepoint' } }
                };
                var normalizedSpec = spec_1.normalize(spec);
                chai_1.assert.deepEqual(normalizedSpec, {
                    "description": "Google's stock price over time.",
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "transform": { "filter": "datum[\"symbol\"]==='GOOG'" },
                    "layer": [
                        {
                            "mark": "area",
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            }
                        },
                        {
                            "mark": "line",
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            }
                        },
                        {
                            "mark": "point",
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            },
                            "config": { "mark": { "filled": true } }
                        }
                    ]
                });
            });
            it('with linepoint should be normalized correctly', function () {
                var spec = {
                    "description": "Google's stock price over time.",
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "transform": { "filter": "datum[\"symbol\"]==='GOOG'" },
                    "mark": "area",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal" },
                        "y": { "field": "price", "type": "quantitative" }
                    },
                    "config": { "overlay": { "area": 'line' } }
                };
                var normalizedSpec = spec_1.normalize(spec);
                chai_1.assert.deepEqual(normalizedSpec, {
                    "description": "Google's stock price over time.",
                    "data": { "url": "data/stocks.csv", "format": { "type": "csv" } },
                    "transform": { "filter": "datum[\"symbol\"]==='GOOG'" },
                    "layer": [
                        {
                            "mark": "area",
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            }
                        },
                        {
                            "mark": "line",
                            "encoding": {
                                "x": { "field": "date", "type": "temporal" },
                                "y": { "field": "price", "type": "quantitative" }
                            }
                        }
                    ]
                });
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
        chai_1.assert.deepEqual(spec_1.normalize(spec), {
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
        chai_1.assert.deepEqual(spec_1.normalize(spec), spec);
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
        chai_1.assert.deepEqual(spec_1.normalize(spec), {
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
            "transform": { "filter": "datum.symbol==='GOOG'" },
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
            "transform": { "filter": "datum.symbol==='GOOG'" },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlYy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9zcGVjLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBRTVCLG9DQUFpRDtBQUVqRCw0RUFBNEU7QUFFNUUsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUN0QixRQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsRUFBRSxDQUFDLHVFQUF1RSxFQUFFO1lBQzFFLElBQU0sSUFBSSxHQUFRO2dCQUNoQixNQUFNLEVBQUUsU0FBUztnQkFDakIsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsYUFBYSxFQUFFLGNBQWM7Z0JBQzdCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztnQkFDbkMsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQztvQkFDcEQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQ3hELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztpQkFDdEQ7YUFDRixDQUFDO1lBRUYsYUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLEVBQUUsR0FBRztnQkFDWixRQUFRLEVBQUUsR0FBRztnQkFDYixNQUFNLEVBQUUsU0FBUztnQkFDakIsYUFBYSxFQUFFLGNBQWM7Z0JBQzdCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztnQkFDbkMsT0FBTyxFQUFFO29CQUNQLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQztp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