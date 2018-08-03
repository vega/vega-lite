"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var rule_1 = require("../../../src/compile/mark/rule");
var util_1 = require("../../util");
describe('Mark: Rule', function () {
    describe('without encoding', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {}
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should not show anything', function () {
            chai_1.assert.isUndefined(props.x);
            chai_1.assert.isUndefined(props.y);
        });
    });
    describe('with x-only', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: { x: { field: 'a', type: 'quantitative' } }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create vertical rule that fits height', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'a' });
            chai_1.assert.deepEqual(props.y, { field: { group: 'height' } });
            chai_1.assert.deepEqual(props.y2, { value: 0 });
        });
    });
    describe('with y-only', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: { y: { field: 'a', type: 'quantitative' } }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create horizontal rule that fits height', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'a' });
            chai_1.assert.deepEqual(props.x, { value: 0 });
            chai_1.assert.deepEqual(props.x2, { field: { group: 'width' } });
        });
    });
    describe('with x and x2 only', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'quantitative' },
                x2: { field: 'a2', type: 'quantitative' }
            }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create horizontal rule on the axis', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'a' });
            chai_1.assert.deepEqual(props.x2, { scale: channel_1.X, field: 'a2' });
            chai_1.assert.deepEqual(props.y, {
                mult: 0.5,
                signal: 'height'
            });
        });
    });
    describe('with y and y2 only', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                y: { field: 'a', type: 'quantitative' },
                y2: { field: 'a2', type: 'quantitative' }
            }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create horizontal rules on the axis', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'a' });
            chai_1.assert.deepEqual(props.y2, { scale: channel_1.Y, field: 'a2' });
            chai_1.assert.deepEqual(props.x, {
                mult: 0.5,
                signal: 'width'
            });
        });
    });
    describe('with x, x2, and y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'quantitative' },
                x2: { field: 'a2', type: 'quantitative' },
                y: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create horizontal rules', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'a' });
            chai_1.assert.deepEqual(props.x2, { scale: channel_1.X, field: 'a2' });
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'b' });
        });
    });
    describe('with x, x2, y, and y2', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'quantitative' },
                x2: { field: 'a2', type: 'quantitative' },
                y: { field: 'b', type: 'quantitative' },
                y2: { field: 'b2', type: 'quantitative' }
            }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create oblique rules', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'a' });
            chai_1.assert.deepEqual(props.x2, { scale: channel_1.X, field: 'a2' });
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'b' });
            chai_1.assert.deepEqual(props.y2, { scale: channel_1.Y, field: 'b2' });
        });
    });
    describe('with x and y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'quantitative' },
                y: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create oblique rules', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'a' });
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'b' });
        });
    });
    describe('with y, y2, and x', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                y: { field: 'a', type: 'quantitative' },
                y2: { field: 'a2', type: 'quantitative' },
                x: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create vertical rules', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'a' });
            chai_1.assert.deepEqual(props.y2, { scale: channel_1.Y, field: 'a2' });
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'b' });
        });
    });
    describe('with nominal x, quantitative y with no y2', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                x: { field: 'a', type: 'ordinal' },
                y: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create vertical rule that emulates bar chart', function () {
            chai_1.assert.equal(model.markDef.orient, 'vertical');
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'a', band: 0.5 });
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'b' });
            chai_1.assert.deepEqual(props.y2, { scale: channel_1.Y, value: 0 });
        });
    });
    describe('with nominal y, quantitative x with no y2', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            mark: 'rule',
            encoding: {
                y: { field: 'a', type: 'ordinal' },
                x: { field: 'b', type: 'quantitative' }
            }
        });
        var props = rule_1.rule.encodeEntry(model);
        it('should create horizontal rule that emulates bar chart', function () {
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'b' });
            chai_1.assert.deepEqual(props.x2, { scale: channel_1.X, value: 0 });
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'a', band: 0.5 });
        });
    });
    describe('horizontal stacked rule with color', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var props = rule_1.rule.encodeEntry(model);
        it('should have the correct value for x, x2, and color', function () {
            chai_1.assert.deepEqual(props.x, { scale: 'x', field: 'sum_b_end' });
            chai_1.assert.deepEqual(props.x2, { scale: 'x', field: 'sum_b_start' });
            chai_1.assert.deepEqual(props.stroke, { scale: channel_1.COLOR, field: 'Origin' });
        });
    });
    describe('vertical stacked rule with color', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
        var props = rule_1.rule.encodeEntry(model);
        it('should have the correct value for y, y2, and color', function () {
            chai_1.assert.deepEqual(props.y, { scale: 'y', field: 'sum_b_end' });
            chai_1.assert.deepEqual(props.y2, { scale: 'y', field: 'sum_b_start' });
            chai_1.assert.deepEqual(props.stroke, { scale: channel_1.COLOR, field: 'Origin' });
        });
    });
});
//# sourceMappingURL=rule.test.js.map