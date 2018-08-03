"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var config_1 = require("../src/config");
var log = tslib_1.__importStar(require("../src/log"));
var spec_1 = require("../src/spec");
// describe('isStacked()') -- tested as part of stackOffset in stack.test.ts
describe('normalize()', function () {
    describe('normalizeFacetedUnit', function () {
        it('should convert single extended spec with column into a composite spec', function () {
            var spec = {
                name: 'faceted',
                width: 123,
                height: 234,
                description: 'faceted spec',
                data: { url: 'data/movies.json' },
                mark: 'point',
                encoding: {
                    column: { field: 'MPAA_Rating', type: 'ordinal' },
                    x: { field: 'Worldwide_Gross', type: 'quantitative' },
                    y: { field: 'US_DVD_Sales', type: 'quantitative' }
                }
            };
            var config = config_1.initConfig(spec.config);
            chai_1.assert.deepEqual(spec_1.normalize(spec, config), {
                name: 'faceted',
                description: 'faceted spec',
                data: { url: 'data/movies.json' },
                facet: {
                    column: { field: 'MPAA_Rating', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    width: 123,
                    height: 234,
                    encoding: {
                        x: { field: 'Worldwide_Gross', type: 'quantitative' },
                        y: { field: 'US_DVD_Sales', type: 'quantitative' }
                    }
                }
            });
        });
        it('should convert single extended spec with row into a composite spec', function () {
            var spec = {
                data: { url: 'data/movies.json' },
                mark: 'point',
                encoding: {
                    row: { field: 'MPAA_Rating', type: 'ordinal' },
                    x: { field: 'Worldwide_Gross', type: 'quantitative' },
                    y: { field: 'US_DVD_Sales', type: 'quantitative' }
                }
            };
            var config = config_1.initConfig(spec.config);
            chai_1.assert.deepEqual(spec_1.normalize(spec, config), {
                data: { url: 'data/movies.json' },
                facet: {
                    row: { field: 'MPAA_Rating', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'Worldwide_Gross', type: 'quantitative' },
                        y: { field: 'US_DVD_Sales', type: 'quantitative' }
                    }
                }
            });
        });
    });
    describe('normalizeFacet', function () {
        it('should produce correct layered specs for mean point and vertical error bar', function () {
            chai_1.assert.deepEqual(spec_1.normalize({
                description: 'A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.',
                data: { url: 'data/population.json' },
                transform: [{ calculate: "(datum.sex==1) ? 'Men':'Women'", as: 'sex' }],
                facet: { row: { field: 'sex', type: 'ordinal' } },
                spec: {
                    layer: [
                        {
                            mark: 'errorbar',
                            encoding: {
                                x: { field: 'age', type: 'ordinal' },
                                y: { field: 'people', type: 'quantitative' }
                            }
                        },
                        {
                            mark: { type: 'point', opacity: 1, filled: true },
                            encoding: {
                                x: { field: 'age', type: 'ordinal' },
                                y: { field: 'people', type: 'quantitative', aggregate: 'mean' }
                            }
                        }
                    ]
                }
            }, config_1.defaultConfig), {
                description: 'A error bar plot showing mean, min, and max in the US population distribution of age groups in 2000.',
                data: {
                    url: 'data/population.json'
                },
                transform: [
                    {
                        calculate: "(datum.sex==1) ? 'Men':'Women'",
                        as: 'sex'
                    }
                ],
                facet: {
                    row: {
                        field: 'sex',
                        type: 'ordinal'
                    }
                },
                spec: {
                    layer: [
                        {
                            transform: [
                                {
                                    aggregate: [
                                        { op: 'stderr', field: 'people', as: 'extent_people' },
                                        { op: 'mean', field: 'people', as: 'center_people' }
                                    ],
                                    groupby: ['age']
                                },
                                {
                                    calculate: 'datum.center_people + datum.extent_people',
                                    as: 'upper_people'
                                },
                                {
                                    calculate: 'datum.center_people - datum.extent_people',
                                    as: 'lower_people'
                                }
                            ],
                            layer: [
                                {
                                    mark: { type: 'rule', style: 'errorbar-rule' },
                                    encoding: {
                                        y: {
                                            field: 'lower_people',
                                            type: 'quantitative',
                                            title: 'people'
                                        },
                                        y2: { field: 'upper_people', type: 'quantitative' },
                                        x: { field: 'age', type: 'ordinal', title: 'age' }
                                    }
                                }
                            ]
                        },
                        {
                            mark: { type: 'point', opacity: 1, filled: true },
                            encoding: {
                                x: { field: 'age', type: 'ordinal' },
                                y: { field: 'people', type: 'quantitative', aggregate: 'mean' }
                            }
                        }
                    ]
                }
            });
        });
    });
    describe('normalizeLayer', function () {
        it('correctly passes shared projection and encoding to children of layer', function () {
            var output = spec_1.normalize({
                data: { url: 'data/population.json' },
                projection: { type: 'mercator' },
                encoding: {
                    x: { field: 'age', type: 'ordinal' }
                },
                layer: [
                    { mark: 'point' },
                    {
                        layer: [
                            { mark: 'rule' },
                            {
                                mark: 'text',
                                encoding: {
                                    text: { field: 'a', type: 'nominal' }
                                }
                            }
                        ]
                    }
                ]
            }, config_1.defaultConfig);
            chai_1.assert.deepEqual(output, {
                data: { url: 'data/population.json' },
                layer: [
                    {
                        projection: { type: 'mercator' },
                        mark: 'point',
                        encoding: {
                            x: { field: 'age', type: 'ordinal' }
                        }
                    },
                    {
                        layer: [
                            {
                                projection: { type: 'mercator' },
                                mark: 'rule',
                                encoding: {
                                    x: { field: 'age', type: 'ordinal' }
                                }
                            },
                            {
                                projection: { type: 'mercator' },
                                mark: 'text',
                                encoding: {
                                    x: { field: 'age', type: 'ordinal' },
                                    text: { field: 'a', type: 'nominal' }
                                }
                            }
                        ]
                    }
                ]
            });
        });
        it('correctly overrides shared projection and encoding and throws warnings', log.wrap(function (localLogger) {
            var output = spec_1.normalize({
                data: { url: 'data/population.json' },
                projection: { type: 'mercator' },
                encoding: {
                    x: { field: 'age', type: 'ordinal' }
                },
                layer: [
                    {
                        projection: { type: 'albersUsa' },
                        mark: 'rule'
                    },
                    {
                        mark: 'text',
                        encoding: {
                            x: { field: 'a', type: 'nominal' }
                        }
                    }
                ]
            }, config_1.defaultConfig);
            chai_1.assert.equal(localLogger.warns.length, 2);
            chai_1.assert.equal(localLogger.warns[0], log.message.projectionOverridden({
                parentProjection: { type: 'mercator' },
                projection: { type: 'albersUsa' }
            }));
            chai_1.assert.equal(localLogger.warns[1], log.message.encodingOverridden(['x']));
            chai_1.assert.deepEqual(output, {
                data: { url: 'data/population.json' },
                layer: [
                    {
                        projection: { type: 'albersUsa' },
                        mark: 'rule',
                        encoding: {
                            x: { field: 'age', type: 'ordinal' }
                        }
                    },
                    {
                        projection: { type: 'mercator' },
                        mark: 'text',
                        encoding: {
                            x: { field: 'a', type: 'nominal' }
                        }
                    }
                ]
            });
        }));
    });
    describe('normalizePathOverlay', function () {
        it('correctly normalizes line with overlayed point.', function () {
            var spec = {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                mark: 'line',
                encoding: {
                    x: { field: 'date', type: 'temporal' },
                    y: { field: 'price', type: 'quantitative' }
                },
                config: { line: { point: {} } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                layer: [
                    {
                        mark: 'line',
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    },
                    {
                        mark: { type: 'point', opacity: 1, filled: true },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    }
                ],
                config: { line: { point: {} } }
            });
        });
        it('correctly normalizes line with transparent point overlayed.', function () {
            var spec = {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                mark: { type: 'line', point: 'transparent' },
                encoding: {
                    x: { field: 'date', type: 'temporal' },
                    y: { field: 'price', type: 'quantitative' }
                }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                layer: [
                    {
                        mark: 'line',
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    },
                    {
                        mark: { type: 'point', opacity: 0, filled: true },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    }
                ]
            });
        });
        it('correctly normalizes line with point overlayed via mark definition.', function () {
            var spec = {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                mark: { type: 'line', point: { color: 'red' } },
                encoding: {
                    x: { field: 'date', type: 'temporal' },
                    y: { field: 'price', type: 'quantitative' }
                }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                layer: [
                    {
                        mark: 'line',
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    },
                    {
                        mark: { type: 'point', opacity: 1, filled: true, color: 'red' },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    }
                ]
            });
        });
        it('correctly normalizes faceted line plots with overlayed point.', function () {
            var spec = {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                mark: 'line',
                encoding: {
                    row: { field: 'symbol', type: 'nominal' },
                    x: { field: 'date', type: 'temporal' },
                    y: { field: 'price', type: 'quantitative' }
                },
                config: { line: { point: {} } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                facet: {
                    row: { field: 'symbol', type: 'nominal' }
                },
                spec: {
                    layer: [
                        {
                            mark: 'line',
                            encoding: {
                                x: { field: 'date', type: 'temporal' },
                                y: { field: 'price', type: 'quantitative' }
                            }
                        },
                        {
                            mark: { type: 'point', opacity: 1, filled: true },
                            encoding: {
                                x: { field: 'date', type: 'temporal' },
                                y: { field: 'price', type: 'quantitative' }
                            }
                        }
                    ]
                },
                config: { line: { point: {} } }
            });
        });
        it('correctly normalizes area with overlay line and point', function () {
            var spec = {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                mark: 'area',
                encoding: {
                    x: { field: 'date', type: 'temporal' },
                    y: { field: 'price', type: 'quantitative' }
                },
                config: { area: { line: {}, point: {} } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                layer: [
                    {
                        mark: { type: 'area', opacity: 0.7 },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    },
                    {
                        mark: { type: 'line' },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    },
                    {
                        mark: { type: 'point', opacity: 1, filled: true },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    }
                ],
                config: { area: { line: {}, point: {} } }
            });
        });
        it('correctly normalizes interpolated area with overlay line', function () {
            var spec = {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                mark: { type: 'area', interpolate: 'monotone' },
                encoding: {
                    x: { field: 'date', type: 'temporal' },
                    y: { field: 'price', type: 'quantitative' }
                },
                config: { area: { line: {} } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                layer: [
                    {
                        mark: { type: 'area', opacity: 0.7, interpolate: 'monotone' },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    },
                    {
                        mark: { type: 'line', interpolate: 'monotone' },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    }
                ],
                config: { area: { line: {} } }
            });
        });
        it('correctly normalizes area with disabled overlay point and line.', function () {
            for (var _i = 0, _a = [null, false]; _i < _a.length; _i++) {
                var overlay = _a[_i];
                var spec = {
                    data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                    mark: { type: 'area', point: overlay, line: overlay },
                    encoding: {
                        x: { field: 'date', type: 'temporal' },
                        y: { field: 'price', type: 'quantitative' }
                    }
                };
                var normalizedSpec = spec_1.normalize(spec, spec.config);
                chai_1.assert.deepEqual(normalizedSpec, {
                    data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                    mark: 'area',
                    encoding: {
                        x: { field: 'date', type: 'temporal' },
                        y: { field: 'price', type: 'quantitative' }
                    }
                });
            }
        });
        it('correctly normalizes area with overlay point and line disabled in config.', function () {
            for (var _i = 0, _a = [null, false]; _i < _a.length; _i++) {
                var overlay = _a[_i];
                var spec = {
                    data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                    mark: { type: 'area' },
                    encoding: {
                        x: { field: 'date', type: 'temporal' },
                        y: { field: 'price', type: 'quantitative' }
                    },
                    config: {
                        area: { point: overlay, line: overlay }
                    }
                };
                var normalizedSpec = spec_1.normalize(spec, spec.config);
                chai_1.assert.deepEqual(normalizedSpec, {
                    data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                    mark: 'area',
                    encoding: {
                        x: { field: 'date', type: 'temporal' },
                        y: { field: 'price', type: 'quantitative' }
                    },
                    config: {
                        area: { point: overlay, line: overlay }
                    }
                });
            }
        });
        it('correctly normalizes stacked area with overlay line', function () {
            var spec = {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                mark: 'area',
                encoding: {
                    x: { field: 'date', type: 'temporal' },
                    y: { aggregate: 'sum', field: 'price', type: 'quantitative' },
                    color: { field: 'symbol', type: 'nominal' }
                },
                config: { area: { line: {} } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                layer: [
                    {
                        mark: { type: 'area', opacity: 0.7 },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { aggregate: 'sum', field: 'price', type: 'quantitative' },
                            color: { field: 'symbol', type: 'nominal' }
                        }
                    },
                    {
                        mark: { type: 'line' },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { aggregate: 'sum', field: 'price', type: 'quantitative', stack: 'zero' },
                            color: { field: 'symbol', type: 'nominal' }
                        }
                    }
                ],
                config: { area: { line: {} } }
            });
        });
        it('correctly normalizes streamgraph with overlay line', function () {
            var spec = {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                mark: 'area',
                encoding: {
                    x: { field: 'date', type: 'temporal' },
                    y: { aggregate: 'sum', field: 'price', type: 'quantitative', stack: 'center' },
                    color: { field: 'symbol', type: 'nominal' }
                },
                config: { area: { line: {} } }
            };
            var normalizedSpec = spec_1.normalize(spec, spec.config);
            chai_1.assert.deepEqual(normalizedSpec, {
                data: { url: 'data/stocks.csv', format: { type: 'csv' } },
                layer: [
                    {
                        mark: { type: 'area', opacity: 0.7 },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { aggregate: 'sum', field: 'price', type: 'quantitative', stack: 'center' },
                            color: { field: 'symbol', type: 'nominal' }
                        }
                    },
                    {
                        mark: { type: 'line' },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { aggregate: 'sum', field: 'price', type: 'quantitative', stack: 'center' },
                            color: { field: 'symbol', type: 'nominal' }
                        }
                    }
                ],
                config: { area: { line: {} } }
            });
        });
    });
    describe('normalizeRangedUnitSpec', function () {
        it('should convert y2 -> y if there is no y in the encoding', function () {
            var spec = {
                data: { url: 'data/population.json' },
                mark: 'rule',
                encoding: {
                    y2: { field: 'age', type: 'ordinal' },
                    x: { aggregate: 'min', field: 'people', type: 'quantitative' },
                    x2: { aggregate: 'max', field: 'people', type: 'quantitative' }
                }
            };
            chai_1.assert.deepEqual(spec_1.normalize(spec, config_1.defaultConfig), {
                data: { url: 'data/population.json' },
                mark: 'rule',
                encoding: {
                    y: { field: 'age', type: 'ordinal' },
                    x: { aggregate: 'min', field: 'people', type: 'quantitative' },
                    x2: { aggregate: 'max', field: 'people', type: 'quantitative' }
                }
            });
        });
        it('should do nothing if there is no missing x or y', function () {
            var spec = {
                data: { url: 'data/population.json' },
                mark: 'rule',
                encoding: {
                    y: { field: 'age', type: 'ordinal' },
                    x: { aggregate: 'min', field: 'people', type: 'quantitative' },
                    x2: { aggregate: 'max', field: 'people', type: 'quantitative' }
                }
            };
            chai_1.assert.deepEqual(spec_1.normalize(spec, config_1.defaultConfig), spec);
        });
        it('should convert x2 -> x if there is no x in the encoding', function () {
            var spec = {
                data: { url: 'data/population.json' },
                mark: 'rule',
                encoding: {
                    x2: { field: 'age', type: 'ordinal' },
                    y: { aggregate: 'min', field: 'people', type: 'quantitative' },
                    y2: { aggregate: 'max', field: 'people', type: 'quantitative' }
                }
            };
            chai_1.assert.deepEqual(spec_1.normalize(spec, config_1.defaultConfig), {
                data: { url: 'data/population.json' },
                mark: 'rule',
                encoding: {
                    x: { field: 'age', type: 'ordinal' },
                    y: { aggregate: 'min', field: 'people', type: 'quantitative' },
                    y2: { aggregate: 'max', field: 'people', type: 'quantitative' }
                }
            });
        });
    });
});
//# sourceMappingURL=normalize.test.js.map