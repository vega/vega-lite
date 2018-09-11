/* tslint:disable quotemark */
import { assert } from 'chai';
import { COLOR, X, Y } from '../../../src/channel';
import { rule } from '../../../src/compile/mark/rule';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark: Rule', function () {
    describe('without encoding', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {}
        });
        var props = rule.encodeEntry(model);
        it('should not show anything', function () {
            assert.isUndefined(props.x);
            assert.isUndefined(props.y);
        });
    });
    describe('with x-only', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: { x: { field: 'a', type: 'quantitative' } }
        });
        var props = rule.encodeEntry(model);
        it('should create vertical rule that fits height', function () {
            assert.deepEqual(props.x, { scale: X, field: 'a' });
            assert.deepEqual(props.y, { field: { group: 'height' } });
            assert.deepEqual(props.y2, { value: 0 });
        });
    });
    describe('with y-only', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: { y: { field: 'a', type: 'quantitative' } }
        });
        var props = rule.encodeEntry(model);
        it('should create horizontal rule that fits height', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'a' });
            assert.deepEqual(props.x, { value: 0 });
            assert.deepEqual(props.x2, { field: { group: 'width' } });
        });
    });
    describe('with x and x2 only', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'quantitative' },
                x2: { field: 'a2', type: 'quantitative' }
            }
        });
        var props = rule.encodeEntry(model);
        it('should create horizontal rule on the axis', function () {
            assert.deepEqual(props.x, { scale: X, field: 'a' });
            assert.deepEqual(props.x2, { scale: X, field: 'a2' });
            assert.deepEqual(props.y, {
                mult: 0.5,
                signal: 'height'
            });
        });
    });
    describe('with y and y2 only', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                y: { field: 'a', type: 'quantitative' },
                y2: { field: 'a2', type: 'quantitative' }
            }
        });
        var props = rule.encodeEntry(model);
        it('should create horizontal rules on the axis', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'a' });
            assert.deepEqual(props.y2, { scale: Y, field: 'a2' });
            assert.deepEqual(props.x, {
                mult: 0.5,
                signal: 'width'
            });
        });
    });
    describe('with x, x2, and y', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'quantitative' },
                x2: { field: 'a2', type: 'quantitative' },
                y: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule.encodeEntry(model);
        it('should create horizontal rules', function () {
            assert.deepEqual(props.x, { scale: X, field: 'a' });
            assert.deepEqual(props.x2, { scale: X, field: 'a2' });
            assert.deepEqual(props.y, { scale: Y, field: 'b' });
        });
    });
    describe('with x, x2, y, and y2', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'quantitative' },
                x2: { field: 'a2', type: 'quantitative' },
                y: { field: 'b', type: 'quantitative' },
                y2: { field: 'b2', type: 'quantitative' }
            }
        });
        var props = rule.encodeEntry(model);
        it('should create oblique rules', function () {
            assert.deepEqual(props.x, { scale: X, field: 'a' });
            assert.deepEqual(props.x2, { scale: X, field: 'a2' });
            assert.deepEqual(props.y, { scale: Y, field: 'b' });
            assert.deepEqual(props.y2, { scale: Y, field: 'b2' });
        });
    });
    describe('with x and y', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'quantitative' },
                y: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule.encodeEntry(model);
        it('should create oblique rules', function () {
            assert.deepEqual(props.x, { scale: X, field: 'a' });
            assert.deepEqual(props.y, { scale: Y, field: 'b' });
        });
    });
    describe('with y, y2, and x', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                y: { field: 'a', type: 'quantitative' },
                y2: { field: 'a2', type: 'quantitative' },
                x: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule.encodeEntry(model);
        it('should create vertical rules', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'a' });
            assert.deepEqual(props.y2, { scale: Y, field: 'a2' });
            assert.deepEqual(props.x, { scale: X, field: 'b' });
        });
    });
    describe('with nominal x, quantitative y with no y2', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'ordinal' },
                y: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule.encodeEntry(model);
        it('should create vertical rule that emulates bar chart', function () {
            assert.equal(model.markDef.orient, 'vertical');
            assert.deepEqual(props.x, { scale: X, field: 'a', band: 0.5 });
            assert.deepEqual(props.y, { scale: Y, field: 'b' });
            assert.deepEqual(props.y2, { scale: Y, value: 0 });
        });
    });
    describe('with nominal y, quantitative x with no y2', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                y: { field: 'a', type: 'ordinal' },
                x: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule.encodeEntry(model);
        it('should create horizontal rule that emulates bar chart', function () {
            assert.equal(model.markDef.orient, 'horizontal');
            assert.deepEqual(props.x, { scale: X, field: 'b' });
            assert.deepEqual(props.x2, { scale: X, value: 0 });
            assert.deepEqual(props.y, { scale: Y, field: 'a', band: 0.5 });
        });
    });
    describe('horizontal stacked rule with color', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                y: { field: 'a', type: 'ordinal' },
                x: { aggregate: 'sum', field: 'b', type: 'quantitative' },
                color: { field: 'Origin', type: 'nominal' }
            },
            config: {
                stack: 'zero',
                invalidValues: null
            }
        });
        var props = rule.encodeEntry(model);
        it('should have the correct value for x, x2, and color', function () {
            assert.deepEqual(props.x, { scale: 'x', field: 'sum_b_end' });
            assert.deepEqual(props.x2, { scale: 'x', field: 'sum_b_start' });
            assert.deepEqual(props.stroke, { scale: COLOR, field: 'Origin' });
        });
    });
    describe('vertical stacked rule with color', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'ordinal' },
                y: { aggregate: 'sum', field: 'b', type: 'quantitative' },
                color: { field: 'Origin', type: 'nominal' }
            },
            config: {
                stack: 'zero',
                invalidValues: null
            }
        });
        var props = rule.encodeEntry(model);
        it('should have the correct value for y, y2, and color', function () {
            assert.deepEqual(props.y, { scale: 'y', field: 'sum_b_end' });
            assert.deepEqual(props.y2, { scale: 'y', field: 'sum_b_start' });
            assert.deepEqual(props.stroke, { scale: COLOR, field: 'Origin' });
        });
    });
});
//# sourceMappingURL=rule.test.js.map