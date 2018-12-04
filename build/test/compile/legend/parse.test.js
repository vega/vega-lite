/* tslint:disable:quotemark */
import { assert } from 'chai';
import { COLOR, FILLOPACITY, OPACITY, SHAPE, SIZE, STROKEOPACITY, STROKEWIDTH } from '../../../src/channel';
import * as legendParse from '../../../src/compile/legend/parse';
import { parseLegend } from '../../../src/compile/legend/parse';
import { isFieldDef } from '../../../src/fielddef';
import { GEOJSON } from '../../../src/type';
import { parseLayerModel, parseUnitModelWithScale } from '../../util';
describe('compile/legend', function () {
    describe('parseUnitLegend()', function () {
        it("should not produce a Vega legend object on channel 'shape' with type 'geojson'", function () {
            var spec = {
                mark: 'geoshape',
                data: { url: 'data/income.json' },
                transform: [
                    {
                        lookup: 'id',
                        from: {
                            data: {
                                url: 'data/us-10m.json',
                                format: { type: 'topojson', feature: 'states' }
                            },
                            key: 'id'
                        },
                        as: 'geo'
                    }
                ],
                encoding: {
                    shape: { field: 'geo', type: 'geojson' }
                }
            };
            var unitModel = parseUnitModelWithScale(spec);
            var channelDef = unitModel.encoding[SHAPE];
            assert.isTrue(isFieldDef(channelDef));
            if (isFieldDef(channelDef)) {
                assert.equal(channelDef.type, GEOJSON);
            }
            parseLegend(unitModel);
            var legendComp = unitModel.component.legends;
            assert.isUndefined(legendComp[SHAPE]);
        });
    });
    describe('parseLegendForChannel()', function () {
        it('should produce a Vega legend object with correct type and scale for color', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'nominal' },
                    color: { field: 'a', type: 'quantitative' }
                }
            });
            var def = legendParse.parseLegendForChannel(model, COLOR).combine();
            assert.isObject(def);
            assert.equal(def.title, 'a');
            assert.equal(def.stroke, 'color');
        });
        it('should produce no legend title when title is null, "", or false', function () {
            for (var _i = 0, _a = [null, '', false]; _i < _a.length; _i++) {
                var val = _a[_i];
                var model = parseUnitModelWithScale({
                    mark: 'point',
                    encoding: {
                        x: { field: 'a', type: 'nominal' },
                        color: {
                            field: 'a',
                            type: 'quantitative',
                            legend: { title: val } // Need to cast as false is not valid, but we want to fall back gracefully
                        }
                    }
                });
                var def = legendParse.parseLegendForChannel(model, COLOR).combine();
                assert.doesNotHaveAnyKeys(def, ['title']);
            }
        });
        it('should store fieldDef.title as explicit', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'nominal' },
                    color: {
                        field: 'a',
                        type: 'quantitative',
                        legend: { title: 'foo' } // Need to cast as false is not valid, but we want to fall back gracefully
                    }
                }
            });
            var def = legendParse.parseLegendForChannel(model, COLOR).combine();
            assert.equal(def.title, 'foo');
        });
        [SIZE, STROKEWIDTH, SHAPE, OPACITY, FILLOPACITY, STROKEOPACITY].forEach(function (channel) {
            it("should produce a Vega legend object with correct type and scale for " + channel, function () {
                var spec = {
                    mark: 'point',
                    encoding: {
                        x: { field: 'a', type: 'nominal' }
                    }
                };
                spec.encoding[channel] = { field: 'a', type: 'nominal' };
                var model = parseUnitModelWithScale(spec);
                var def = legendParse.parseLegendForChannel(model, channel).combine();
                var channelDef = model.encoding[channel];
                if (isFieldDef(channelDef)) {
                    assert.notEqual(channelDef.type, GEOJSON);
                }
                if (channel !== OPACITY) {
                    assert.equal(def.encode.symbols.update.opacity.value, 0.7);
                }
                else {
                    assert.isUndefined(def.encode.symbols.update.opacity);
                }
                assert.isObject(def);
                assert.equal(def.title, 'a');
            });
        });
    });
    describe('parseNonUnitLegend()', function () {
        it('should correctly merge orient by favoring explicit orient', function () {
            var model = parseLayerModel({
                $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
                description: "Google's stock price over time.",
                data: { url: 'data/stocks.csv' },
                layer: [
                    {
                        mark: 'line',
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' },
                            color: { field: 'symbol', type: 'nominal' }
                        }
                    },
                    {
                        mark: { type: 'point', filled: true },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' },
                            color: { field: 'symbol', type: 'nominal', legend: { orient: 'left' } }
                        }
                    }
                ]
            });
            model.parseScale();
            model.parseLegend();
            assert.equal(model.component.legends.color.explicit.orient, 'left');
        });
        it('should correctly merge legend that exists only on one plot', function () {
            var model = parseLayerModel({
                $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
                description: "Google's stock price over time.",
                data: { url: 'data/stocks.csv' },
                layer: [
                    {
                        mark: 'line',
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' }
                        }
                    },
                    {
                        mark: { type: 'point', filled: true },
                        encoding: {
                            x: { field: 'date', type: 'temporal' },
                            y: { field: 'price', type: 'quantitative' },
                            color: { field: 'symbol', type: 'nominal' }
                        }
                    }
                ]
            });
            model.parseScale();
            model.parseLegend();
            assert.isOk(model.component.legends.color);
            assert.isUndefined(model.children[0].component.legends.color);
            assert.isUndefined(model.children[1].component.legends.color);
        });
    });
});
//# sourceMappingURL=parse.test.js.map