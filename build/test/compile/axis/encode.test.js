/* tslint:disable:quotemark */
import { assert } from 'chai';
import * as encode from '../../../src/compile/axis/encode';
import { parseUnitModelWithScale } from '../../util';
describe('compile/axis/encode', function () {
    describe('encode.labels()', function () {
        it('should not rotate label for temporal field by default', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            assert.isUndefined(labels.angle);
        });
        it('should do not rotate label for temporal field if labelAngle is specified in axis config', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                },
                config: { axisX: { labelAngle: 90 } }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            assert.isUndefined(labels.angle);
        });
        it('should have correct text.signal for quarter timeUnits', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'quarter' }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value)";
            assert.equal(labels.text.signal, expected);
        });
        it('should have correct text.signal for yearquartermonth timeUnits', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'yearquartermonth' }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
            assert.equal(labels.text.signal, expected);
        });
    });
});
//# sourceMappingURL=encode.test.js.map