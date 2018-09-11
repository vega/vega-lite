/* tslint:disable:quotemark */
import { assert } from 'chai';
import { Y } from '../../../src/channel';
import { parseLayerAxis, parseUnitAxis } from '../../../src/compile/axis/parse';
import { parseLayerModel, parseUnitModelWithScale } from '../../util';
describe('Axis', function () {
    // TODO: move this to model.test.ts
    describe('= true', function () {
        it('should produce default properties for axis', function () {
            var model1 = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    y: { type: 'quantitative', field: 'US_Gross', aggregate: 'sum' }
                },
                data: { url: 'data/movies.json' }
            });
            var model2 = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    y: { type: 'quantitative', field: 'US_Gross', aggregate: 'sum' }
                },
                data: { url: 'data/movies.json' }
            });
            assert.deepEqual(model1.axis(Y), model2.axis(Y));
        });
    });
    describe('parseUnitAxis', function () {
        it('should produce Vega grid', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: {
                        field: 'a',
                        type: 'quantitative',
                        axis: { grid: true, gridColor: 'blue', gridWidth: 20 }
                    }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.grid, true);
        });
        it('should produce Vega grid when axis config is specified.', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: {
                        field: 'a',
                        type: 'quantitative'
                    }
                },
                config: { axisX: { grid: true } }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].implicit.grid, true);
        });
        it('should produce axis component with grid=false', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: {
                        field: 'a',
                        type: 'quantitative',
                        axis: { grid: false, gridColor: 'blue', gridWidth: 20 }
                    }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.grid, false);
        });
        it('should ignore null scales', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    longitude: {
                        field: 'a',
                        type: 'quantitative'
                    },
                    latitude: {
                        field: 'b',
                        type: 'quantitative'
                    }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.isUndefined(axisComponent['x']);
            assert.isUndefined(axisComponent['y']);
        });
        it('should produce Vega grid axis = undefined axis if grid is disabled via config.axisX', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: {
                        field: 'a',
                        type: 'quantitative'
                    }
                },
                config: { axisX: { grid: false } }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.grid, undefined);
        });
        it('should produce Vega grid axis = undefined axis if grid is disabled via config.axis', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: {
                        field: 'a',
                        type: 'quantitative'
                    }
                },
                config: { axis: { grid: false } }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.grid, undefined);
        });
        it('should store the title value if title = null, "", or false', function () {
            for (var _i = 0, _a = [null, '', false]; _i < _a.length; _i++) {
                var val = _a[_i];
                var model = parseUnitModelWithScale({
                    mark: 'point',
                    encoding: {
                        x: {
                            field: 'a',
                            type: 'quantitative',
                            axis: { title: val } // Need to cast as false is not valid, but we want to fall back gracefully
                        }
                    }
                });
                var axisComponent = parseUnitAxis(model);
                assert.equal(axisComponent['x'].length, 1);
                assert.equal(axisComponent['x'][0].explicit.title, val);
            }
        });
        it('should store the fieldDef title value if title = null, "", or false', function () {
            for (var _i = 0, _a = [null, '', false]; _i < _a.length; _i++) {
                var val = _a[_i];
                var model = parseUnitModelWithScale({
                    mark: 'point',
                    encoding: {
                        x: {
                            field: 'a',
                            type: 'quantitative',
                            title: val // Need to cast as false is not valid, but we want to fall back gracefully
                        }
                    }
                });
                var axisComponent = parseUnitAxis(model);
                assert.equal(axisComponent['x'].length, 1);
                assert.equal(axisComponent['x'][0].explicit.title, val);
            }
        });
        it('should store fieldDef.title as explicit', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: {
                        field: 'a',
                        type: 'quantitative',
                        title: 'foo'
                    }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.title, 'foo');
        });
        it('should merge title of fieldDef and fieldDef2', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: {
                        field: 'a',
                        type: 'quantitative',
                        title: 'foo'
                    },
                    x2: {
                        field: 'b',
                        type: 'quantitative',
                        title: 'bar'
                    }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.title, 'foo, bar');
        });
        it('should use title of fieldDef2', function () {
            var model = parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: {
                        field: 'a',
                        type: 'quantitative'
                    },
                    x2: {
                        field: 'b',
                        type: 'quantitative',
                        title: 'bar'
                    }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.equal(axisComponent['x'][0].explicit.title, 'bar');
        });
        it('should store both x and x2 for ranged mark', function () {
            var model = parseUnitModelWithScale({
                mark: 'rule',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    x2: { field: 'a2', type: 'quantitative' }
                }
            });
            var axisComponent = parseUnitAxis(model);
            assert.equal(axisComponent['x'].length, 1);
            assert.deepEqual(axisComponent['x'][0].get('title'), [{ field: 'a' }, { field: 'a2' }]);
        });
    });
    describe('parseLayerAxis', function () {
        var globalRuleOverlay = parseLayerModel({
            layer: [
                {
                    mark: 'rule',
                    encoding: {
                        y: {
                            aggregate: 'mean',
                            field: 'a',
                            type: 'quantitative'
                        }
                    }
                },
                {
                    mark: 'line',
                    encoding: {
                        y: {
                            aggregate: 'mean',
                            field: 'a',
                            type: 'quantitative'
                        },
                        x: {
                            timeUnit: 'month',
                            type: 'temporal',
                            field: 'date'
                        }
                    }
                }
            ]
        });
        globalRuleOverlay.parseScale();
        globalRuleOverlay.parseLayoutSize();
        parseLayerAxis(globalRuleOverlay);
        it('correctly merges gridScale if one layer does not have one of the axis', function () {
            var axisComponents = globalRuleOverlay.component.axes;
            assert.equal(axisComponents.y.length, 1);
            assert.equal(axisComponents.y[0].get('gridScale'), 'x');
        });
        it('correctly merges similar title', function () {
            var axisComponents = globalRuleOverlay.component.axes;
            assert.deepEqual(axisComponents.y[0].get('title'), [{ aggregate: 'mean', field: 'a' }]);
        });
        it('correctly combines different title', function () {
            var model = parseLayerModel({
                $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
                data: { url: 'data/cars.json' },
                layer: [
                    {
                        mark: 'line',
                        encoding: {
                            x: { field: 'Cylinders', type: 'ordinal' },
                            y: {
                                aggregate: 'max',
                                field: 'Horsepower',
                                type: 'quantitative'
                            },
                            color: { value: 'darkred' }
                        }
                    },
                    {
                        data: { url: 'data/cars.json' },
                        mark: 'line',
                        encoding: {
                            x: { field: 'Cylinders', type: 'ordinal' },
                            y: {
                                aggregate: 'min',
                                field: 'Horsepower',
                                type: 'quantitative'
                            }
                        }
                    }
                ]
            });
            model.parseScale();
            parseLayerAxis(model);
            var axisComponents = model.component.axes;
            assert.deepEqual(axisComponents.y[0].get('title'), [
                { aggregate: 'max', field: 'Horsepower' },
                { aggregate: 'min', field: 'Horsepower' }
            ]);
        });
    });
});
//# sourceMappingURL=parse.test.js.map