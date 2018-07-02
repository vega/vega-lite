/* tslint:disable:quotemark */

import {assert} from 'chai';
import * as properties from '../../../src/compile/axis/properties';
import {labelAlign, labelAngle, labelBaseline} from '../../../src/compile/axis/properties';
import {TimeUnit} from '../../../src/timeunit';
import {parseUnitModelWithScale} from '../../util';

describe('compile/axis', () => {
  describe('grid()', function () {
    it('should return true by default for continuous scale that is not binned', function () {
      const grid = properties.grid('linear', {field: 'a', type: 'quantitative'});
      assert.deepEqual(grid, true);
    });

    it('should return false by default for binned field', function () {
      const grid = properties.grid('linear', {bin: true, field: 'a', type: 'quantitative'});
      assert.deepEqual(grid, false);
    });

    it('should return false by default for a discrete scale', function () {
      const grid = properties.grid('point', {field: 'a', type: 'quantitative'});
      assert.deepEqual(grid, false);
    });
  });

  describe('orient()', function () {
    it('should return bottom for x by default', function () {
      const orient = properties.orient('x');
      assert.deepEqual(orient, 'bottom');
    });

    it('should return left for y by default', function () {
      const orient = properties.orient('y');
      assert.deepEqual(orient, 'left');
    });
  });

  describe('tickCount', function () {
    it('should return undefined by default for a binned field', () => {
      const tickCount = properties.tickCount('x', {bin: {maxbins: 10}, field: 'a', type: 'quantitative'}, 'linear', {signal: 'a'});
      assert.deepEqual(tickCount, {signal: 'ceil(a/20)'});
    });

    for (const timeUnit of ['month', 'hours', 'day', 'quarter'] as TimeUnit[]) {
      it(`should return undefined by default for a temporal field with timeUnit=${timeUnit}`, () => {
        const tickCount = properties.tickCount('x', {timeUnit, field: 'a', type: 'temporal'}, 'linear', {signal: 'a'});
        assert.isUndefined(tickCount);
      });
    }

    it('should return size/40 by default for linear scale', () => {
      const tickCount = properties.tickCount('x', {field: 'a', type: 'quantitative'}, 'linear', {signal: 'a'});
      assert.deepEqual(tickCount, {signal: 'ceil(a/40)'});
    });

    it('should return undefined by default for log scale', function () {
      const tickCount = properties.tickCount('x', {field: 'a', type: 'quantitative'}, 'log', undefined);
      assert.deepEqual(tickCount, undefined);
    });

    it('should return undefined by default for point scale', function () {
      const tickCount = properties.tickCount('x', {field: 'a', type: 'quantitative'}, 'point', undefined);
      assert.deepEqual(tickCount, undefined);
    });
  });

  describe('title()', function () {
    it('should add return fieldTitle by default', function () {
      const title = properties.title(3, {field: 'a', type: "quantitative"}, {});
      assert.deepEqual(title, 'a');
    });

    it('should add return fieldTitle by default', function () {
      const title = properties.title(10, {aggregate: 'sum', field: 'a', type: "quantitative"}, {});
      assert.deepEqual(title, 'Sum of a');
    });

    it('should add return fieldTitle by default and truncate', function () {
      const title = properties.title(3, {aggregate: 'sum', field: 'a', type: "quantitative"}, {});
      assert.deepEqual(title, 'Su…');
    });
  });

  describe('values', () => {
    it('should return correct timestamp values for DateTimes', () => {
      const values = properties.values({values: [{year: 1970}, {year: 1980}]}, null, {field: 'a', type: 'temporal'}, "x");

      assert.deepEqual(values, [
        {"signal": "datetime(1970, 0, 1, 0, 0, 0, 0)"},
        {"signal": "datetime(1980, 0, 1, 0, 0, 0, 0)"}
      ]);
    });

    it('should simply return values for non-DateTime', () => {
      const values = properties.values({values: [1, 2, 3, 4]}, null, {field: 'a', type: 'quantitative'}, "x");
      assert.deepEqual(values, [1, 2, 3, 4]);
    });

    it('should simply drop values when domain is specified', () => {
      const model1 = parseUnitModelWithScale({
        "mark": "bar",
        "encoding": {
          "y": {
            "type": "quantitative",
            "field": 'US_Gross',
            "scale": {"domain": [-1, 2]},
            "bin": {"extent": [0, 1]}
          }
        },
        "data": {"url": "data/movies.json"}
      });
      const values = properties.values({}, model1, model1.fieldDef("y"), "y");

      assert.deepEqual(values, undefined);
    });
  });

  describe('labelAngle', () => {
    const axisModel = parseUnitModelWithScale({
      "mark": "bar",
      "encoding": {
        "y": {
          "type": "quantitative",
          "field": 'US_Gross',
          "scale": {"domain": [-1, 2]},
          "bin": {"extent": [0, 1]},
          "axis": {"labelAngle": 600}
        }
      },
      "data": {"url": "data/movies.json"}
    });

    const configModel = parseUnitModelWithScale({
      "config": {"axis": {"labelAngle": 500}},
      "mark": "bar",
      "encoding": {
        "y": {
          "type": "quantitative",
          "field": 'US_Gross',
          "scale": {"domain": [-1, 2]},
          "bin": {"extent": [0, 1]}
        }
      },
      "data": {"url": "data/movies.json"}
    });

    const defaultModel = parseUnitModelWithScale({
      "data": {
        "values": [
          {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
          {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
          {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
        ]
      },
      "mark": "bar",
      "encoding": {
        "x": {"field": "a", "type": "ordinal"},
        "y": {"field": "b", "type": "quantitative"}
      }
    });

    const bothModel = parseUnitModelWithScale({
      "config": {"axis": {"labelAngle": 500}},
      "mark": "bar",
      "encoding": {
        "y": {
          "type": "quantitative",
          "field": 'US_Gross',
          "scale": {"domain": [-1, 2]},
          "bin": {"extent": [0, 1]},
          "axis": {"labelAngle": 600}
        }
      },
      "data": {"url": "data/movies.json"}
    });

    const neitherModel = parseUnitModelWithScale({
      "mark": "bar",
      "encoding": {
        "y": {
          "type": "quantitative",
          "field": 'US_Gross',
          "scale": {"domain": [-1, 2]},
          "bin": {"extent": [0, 1]}
        }
      },
      "data": {"url": "data/movies.json"}
    });

    it('should return the correct labelAngle from the axis definition', () => {
      assert.deepEqual(240, labelAngle(axisModel, axisModel.axis('y'), 'y', axisModel.fieldDef('y')));
    });

    it('should return the correct labelAngle from the axis config definition', () => {
      assert.deepEqual(140, labelAngle(configModel, configModel.axis('y'), 'y', configModel.fieldDef('y')));
    });

    it('should return the correct default labelAngle when not specified', () => {
      assert.deepEqual(270, labelAngle(defaultModel, defaultModel.axis('x'), 'x', defaultModel.fieldDef('x')));
    });

    it('should return the labelAngle declared in the axis when both the axis and axis config have labelAngle', () => {
      assert.deepEqual(240, labelAngle(bothModel, bothModel.axis('y'), 'y', bothModel.fieldDef('y')));
    });

    it('should return undefined when there is no default and no specified labelAngle', () => {
      assert.deepEqual(undefined, labelAngle(neitherModel, neitherModel.axis('y'), 'y', neitherModel.fieldDef('y')));
    });
  });

  describe('labelAlign', () => {
    describe('horizontal orients', () => {
      it('360 degree check for horizonatal orients return to see if they orient properly', () => {
        assert.equal(labelAlign(0, 'top'), 'center');
        assert.equal(labelAlign(15, 'top'), 'right');
        assert.equal(labelAlign(30, 'top'), 'right');
        assert.equal(labelAlign(45, 'top'), 'right');
        assert.equal(labelAlign(60, 'top'), 'right');
        assert.equal(labelAlign(75, 'top'), 'right');
        assert.equal(labelAlign(90, 'top'), 'right');
        assert.equal(labelAlign(105, 'top'), 'right');
        assert.equal(labelAlign(120, 'top'), 'right');
        assert.equal(labelAlign(135, 'top'), 'right');
        assert.equal(labelAlign(150, 'top'), 'right');
        assert.equal(labelAlign(165, 'top'), 'right');
        assert.equal(labelAlign(180, 'top'), 'center');
        assert.equal(labelAlign(195, 'bottom'), 'right');
        assert.equal(labelAlign(210, 'bottom'), 'right');
        assert.equal(labelAlign(225, 'bottom'), 'right');
        assert.equal(labelAlign(240, 'bottom'), 'right');
        assert.equal(labelAlign(255, 'bottom'), 'right');
        assert.equal(labelAlign(270, 'bottom'), 'right');
        assert.equal(labelAlign(285, 'bottom'), 'right');
        assert.equal(labelAlign(300, 'bottom'), 'right');
        assert.equal(labelAlign(315, 'bottom'), 'right');
        assert.equal(labelAlign(330, 'bottom'), 'right');
        assert.equal(labelAlign(345, 'bottom'), 'right');
      });
      it('360 degree check for vertical orients return to see if they orient properly', () => {
        assert.equal(labelAlign(0, 'left'), 'right');
        assert.equal(labelAlign(15, 'left'), 'right');
        assert.equal(labelAlign(30, 'left'), 'right');
        assert.equal(labelAlign(45, 'left'), 'right');
        assert.equal(labelAlign(60, 'left'), 'right');
        assert.equal(labelAlign(75, 'left'), 'right');
        assert.equal(labelAlign(90, 'left'), 'center');
        assert.equal(labelAlign(105, 'left'), 'left');
        assert.equal(labelAlign(120, 'left'), 'left');
        assert.equal(labelAlign(135, 'left'), 'left');
        assert.equal(labelAlign(150, 'left'), 'left');
        assert.equal(labelAlign(165, 'left'), 'left');
        assert.equal(labelAlign(180, 'left'), 'left');
        assert.equal(labelAlign(195, 'right'), 'right');
        assert.equal(labelAlign(210, 'right'), 'right');
        assert.equal(labelAlign(225, 'right'), 'right');
        assert.equal(labelAlign(240, 'right'), 'right');
        assert.equal(labelAlign(255, 'right'), 'right');
        assert.equal(labelAlign(270, 'right'), 'center');
        assert.equal(labelAlign(285, 'right'), 'left');
        assert.equal(labelAlign(300, 'right'), 'left');
        assert.equal(labelAlign(315, 'right'), 'left');
        assert.equal(labelAlign(330, 'right'), 'left');
        assert.equal(labelAlign(345, 'right'), 'left');
      });
      it('should return undefined if angle is undefined', () => {
        assert.deepEqual(labelAlign(undefined, 'left'), undefined);
      });
    });
  });

  describe('labelBaseline', () => {
    it('is middle for perpendiculars horizontal orients', () => {
      assert.deepEqual(labelBaseline(90, 'top'), 'middle');
      assert.deepEqual(labelBaseline(270, 'bottom'), 'middle');
    });


    it('is top for bottom orients for 1st and 4th quadrants', () => {
      assert.deepEqual(labelBaseline(45, 'bottom'), 'top');
      assert.deepEqual(labelBaseline(180, 'top'), 'top');
    });

    it('is bottom for bottom orients for 2nd and 3rd quadrants', () => {
      assert.deepEqual(labelBaseline(100, 'bottom'), 'middle');
      assert.deepEqual(labelBaseline(260, 'bottom'), 'middle');
    });

    it('is middle for 0 and 180 horizontal orients', () => {
      assert.deepEqual(labelBaseline(0, 'left'), 'middle');
      assert.deepEqual(labelBaseline(180, 'right'), 'middle');
    });


    it('is top for bottom orients for 1st and 2nd quadrants', () => {
      assert.deepEqual(labelBaseline(80, 'left'), 'top');
      assert.deepEqual(labelBaseline(100, 'left'), 'top');
    });

    it('is bottom for bottom orients for 3rd and 4th quadrants', () => {
      assert.deepEqual(labelBaseline(280, 'left'), 'bottom');
      assert.deepEqual(labelBaseline(260, 'left'), 'bottom');
    });

    it('is bottom for bottom orients for 3rd and 4th quadrants', () => {
      assert.deepEqual(labelBaseline(280, 'left'), 'bottom');
      assert.deepEqual(labelBaseline(260, 'left'), 'bottom');
    });

    it('should return undefined if angle is undefined', () => {
      assert.deepEqual(labelBaseline(undefined, 'left'), undefined);
    });
  });
});
