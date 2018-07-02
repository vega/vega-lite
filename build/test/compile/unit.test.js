import { assert } from 'chai';
import { DETAIL, SHAPE, X } from '../../src/channel';
import * as log from '../../src/log';
import { BAR } from '../../src/mark';
import { QUANTITATIVE } from '../../src/type';
import { parseUnitModel } from '../util';
describe('UnitModel', function () {
    describe('initEncoding', function () {
        it('should drop unsupported channel and throws warning', log.wrap(function (localLogger) {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    shape: { field: 'a', type: 'quantitative' }
                }
            });
            assert.equal(model.encoding.shape, undefined);
            assert.equal(localLogger.warns[0], log.message.incompatibleChannel(SHAPE, BAR));
        }));
        it('should drop invalid channel and throws warning', log.wrap(function (localLogger) {
            var _model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    _y: { type: 'quantitative' }
                }
            }); // To make parseUnitModel accept the model with invalid encoding channel
            assert.equal(localLogger.warns[0], log.message.invalidEncodingChannel('_y'));
        }));
        it('should drop channel without field and value and throws warning', log.wrap(function (localLogger) {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    x: { type: 'quantitative' }
                }
            });
            assert.equal(model.encoding.x, undefined);
            assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: QUANTITATIVE }, X));
        }));
        it('should drop a fieldDef without field and value from the channel def list and throws warning', log.wrap(function (localLogger) {
            var model = parseUnitModel({
                mark: 'bar',
                encoding: {
                    detail: [
                        { field: 'a', type: 'ordinal' },
                        { type: 'quantitative' }
                    ]
                }
            });
            assert.deepEqual(model.encoding.detail, [
                { field: 'a', type: 'ordinal' }
            ]);
            assert.equal(localLogger.warns[0], log.message.emptyFieldDef({ type: QUANTITATIVE }, DETAIL));
        }));
    });
    describe('initAxes', function () {
        it('should not include properties of non-VlOnlyAxisConfig in config.axis', function () {
            var model = parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                    y: { field: 'b', type: 'ordinal' }
                },
                config: { axis: { domainWidth: 123 } }
            });
            assert.equal(model.axis(X)['domainWidth'], undefined);
        });
        it('it should have axis.offset = encode.x.axis.offset', function () {
            var model = parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', axis: { offset: 345 } },
                    y: { field: 'b', type: 'ordinal' }
                }
            });
            assert.equal(model.axis(X).offset, 345);
        });
    });
});
//# sourceMappingURL=unit.test.js.map