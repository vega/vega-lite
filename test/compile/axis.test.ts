/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseUnitModel, parseModel} from '../util';
import * as axis from '../../src/compile/axis';
import {X, Y, COLUMN, ROW} from '../../src/channel';

describe('Axis', function() {
  // TODO: move this to model.test.ts
  describe('= true', function() {
    it('should produce default properties for axis', function() {
      const model1 = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true}
        },
        "data": {"url": "data/movies.json"}
      });

      const model2 = parseUnitModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}
        },
        "data": {"url": "data/movies.json"}
      });
      assert.deepEqual(model1.axis(Y), model2.axis(Y));
    });
  });

  describe('parseInnerAxis', function() {
    it('should produce a Vega inner axis object with correct type, scale and grid properties', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {
            field: "a",
            type: "quantitative",
            axis: {grid: true, gridColor: "blue", gridWidth: 20}
          }
        }
      });
      const def = axis.parseInnerAxis(X, model);
      assert.isObject(def);
      assert.equal(def.orient, 'bottom');
      assert.equal(def.scale, 'x');
      assert.deepEqual(def.encode.grid.update, {stroke: {value: "blue"}, strokeWidth: {value: 20}});
    });
  });

  describe('parseAxis', function() {
    it('should produce a Vega axis object with correct type and scale', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative"}
        }
      });
      const def = axis.parseAxis(X, model);
      assert.isObject(def);
      assert.equal(def.orient, 'bottom');
      assert.equal(def.scale, 'x');
    });

    it('should produce correct encode block if needed', () => {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", "axis": {"axisColor": "#0099ff"}}
        }
      });
      const def = axis.parseAxis(X, model);
      assert.equal(def.encode.axis.update.stroke.value, '#0099ff');
    });
  });

  describe('grid()', function () {
    it('should return specified orient', function () {
      const grid = axis.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative', axis:{grid: false}}
          }
        }), X);
      assert.deepEqual(grid, false);
    });

    it('should return true by default', function () {
      const grid = axis.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X);
      assert.deepEqual(grid, true);
    });

    it('should return undefined for COLUMN', function () {
      const grid = axis.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), COLUMN);
      assert.deepEqual(grid, undefined);
    });

    it('should return undefined for ROW', function () {
      const grid = axis.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), ROW);
      assert.deepEqual(grid, undefined);
    });
  });

  describe('zindex()', function () {
    it('should return undefined by default without grid defined', function () {
      const zindex = axis.zindex(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X, Y);
      assert.deepEqual(zindex, 1);
    });

    it('should return back by default with grid defined', function () {
      const zindex = axis.zindex(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X, {grid: true});
      assert.deepEqual(zindex, 0);
    });

    it('should return specified zindex', function () {
      const zindex = axis.zindex(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative', axis: {zindex: 2}}
          }
        }), X, {grid: true});
      assert.deepEqual(zindex, 2);
    });
  });

  describe('orient()', function () {
    it('should return specified orient', function () {
      const orient = axis.orient(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative', axis:{orient: 'bottom'}}
          }
        }), X);
      assert.deepEqual(orient, 'bottom');
    });

    it('should return bottom for x by default', function () {
      const orient = axis.orient(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X);
      assert.deepEqual(orient, 'bottom');
    });

    it('should return top for column by default', function () {
      const orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'},
            column: {field: 'a', type: 'nominal'}
          }
        }), COLUMN);
      assert.deepEqual(orient, 'top');
    });

    it('should return left for row by default', function () {
      const orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            row: {field: 'a', type: 'nominal'}
          }
        }), 'row');
      assert.deepEqual(orient, 'left');
    });

    it('should return left for y by default', function () {
      const orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a', type: 'quantitative'}
          }
        }), 'y');
      assert.deepEqual(orient, 'left');
    });
  });

  describe('tickCount', function() {
    it('should return undefined by default', function () {
      const tickCount = axis.tickCount(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a', type: 'quantitative'}
          }
        }), Y);
      assert.deepEqual(tickCount, undefined);
    });

    it('should return 5 by default', function () {
      const tickCount = axis.tickCount(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        }), X);
      assert.deepEqual(tickCount, 5);
    });

    it('should return specified tickCount', function () {
      const tickCount = axis.tickCount(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: 'quantitative', axis: {tickCount: 10}}
          }
        }), X);
      assert.deepEqual(tickCount, 10);
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      const title = axis.title(parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: 'a', type: 'quantitative', axis: {title: 'Custom'}}
        }
      }), X);
      assert.deepEqual(title, 'Custom');
    });

    it('should add return fieldTitle by default', function () {
      const title = axis.title(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", axis: {titleMaxLength: 3}}
          }
        }), X);
      assert.deepEqual(title, 'a');
    });

    it('should add return fieldTitle by default', function () {
      const title = axis.title(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", aggregate: 'sum', axis: {titleMaxLength: 10}}
          }
        }), X);
      assert.deepEqual(title, 'SUM(a)');
    });

    it('should add return fieldTitle by default and truncate', function () {
      const title = axis.title(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", aggregate: 'sum', axis: {titleMaxLength: 3}}
          }
        }), X);
      assert.deepEqual(title, 'SU…');
    });

    it('should add return fieldTitle by default and truncate', function () {
      const title = axis.title(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'abcdefghijkl', type: 'quantitative'}
          },
          config: {
            cell: {width: 60}
          }
        }), X);
      assert.deepEqual(title, 'abcdefghi…');
    });


    it('should add return fieldTitle by default and truncate', function () {
      const title = axis.title(parseUnitModel({
        height: 60,
        mark: "point",
        encoding: {
          y: {field: 'abcdefghijkl', type: 'quantitative'}
        }
      }), Y);
      assert.deepEqual(title, 'abcdefghi…');
    });
  });

  describe('values', () => {
    it('should return correct timestamp values for DateTimes', () => {
      const values = axis.values(parseModel({
        mark: "point",
        encoding: {
          y: {field: 'a', type: 'temporal', axis: {values: [{year: 1970}, {year: 1980}]}}
        }
      }), Y);

      assert.deepEqual(values, [
        new Date(1970, 0, 1).getTime(),
        new Date(1980, 0, 1).getTime()
      ]);
    });

    it('should simply return values for non-DateTime', () => {
      const values = axis.values(parseModel({
        mark: "point",
        encoding: {
          y: {field: 'a', type: 'quantitative', axis: {values: [1,2,3,4]}}
        }
      }), Y);

      assert.deepEqual(values, [1,2,3,4]);
    });
  });

  describe('encode.axis()', function() {
    it('axisColor should change axis\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {axisColor: '#fff'}}
        }
      });
        const axes = axis.encode.axis(model, X, {});
        assert.equal(axes.stroke.value, '#fff');
    });

    it('axisWidth should change axis\'s width', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {axisWidth: 2}}
        }
      });
        const axes = axis.encode.axis(model, X, {});
        assert.equal(axes.strokeWidth.value, 2);
    });
  });

  describe('encode.grid()', function(){
      it('gridColor should change grid\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {gridColor: '#fff'}}
        }
      });
        const axes = axis.encode.grid(model, X, {});
        assert.equal(axes.stroke.value, '#fff');
    });

    it('gridOpacity should change grid\'s opacity', function(){
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {grid: true, gridOpacity: 0.6}}
        }
      });
        const axes = axis.encode.grid(model, X, {});
        assert.equal(axes.strokeOpacity.value, 0.6);
    });

     it('gridWidth should change grid\'s width', function(){
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {grid: true, gridWidth: 2}}
        }
      });
        const axes = axis.encode.grid(model, X, {});
        assert.equal(axes.strokeWidth.value, 2);
    });

    it('gridDash should change grid\'s dash offset', function(){
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {grid: true, gridDash: [2]}}
        }
      });
        const axes = axis.encode.grid(model, X, {});
        assert.deepEqual(axes.strokeDashOffset.value, [2]);
    });
  });

  describe('encode.labels()', function () {
    it('should show labels by default', function () {
      const labels = axis.encode.labels(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal"}
          }
        }), X, {}, {orient: 'top'});
      assert.deepEqual(labels.text.signal, 'truncate(datum.value, 25)');
    });

    it('should hide labels if labels are set to false', function () {
      const labels = axis.encode.labels(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal", axis: {label: false}}
          }
        }), X, {}, null);
      assert.deepEqual(labels.text, '');
    });

    it('should rotate labels if labelAngle is defined', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {labelAngle: -45}}
        }
      });
      const labels = axis.encode.labels(model, X, {}, {});
      assert.equal(labels.angle.value, -45);
    });

    it('should rotate label', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });
      const labels = axis.encode.labels(model, X, {}, {});
      assert.equal(labels.angle.value, 270);
      assert.equal(labels.baseline.value, 'middle');
    });

    it('should also rotate labels if the channel is column', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          column: {field: "a", type: "temporal", timeUnit: "month", axis: {labelAngle: 270}}
        }
      });
      const labels = axis.encode.labels(model, COLUMN, {}, {});
      assert.equal(labels.angle.value, 270);
      assert.equal(labels.baseline.value, 'middle');
    });

    it('should have correct text.signal for quarter timeUnits', function () {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "quarter"}
        }
      });
      const labels = axis.encode.labels(model, X, {}, {});
      let expected = "'Q' + quarter(datum.value)";
      assert.equal(labels.text.signal, expected);
    });

    it('should have correct text.signal for yearquartermonth timeUnits', function () {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "yearquartermonth"}
        }
      });
      const labels = axis.encode.labels(model, X, {}, {});
      let expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
      assert.equal(labels.text.signal, expected);
    });

    it('tickLabelColor should change with axis\'s label\' color', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: 'quantitative', axis:{tickLabelColor: "blue"}}
        }
      });
      const labels = axis.encode.labels(model, X, {}, {});
      assert.equal(labels.fill.value, "blue");
    });

    it('tickLabelFont should change with axis\'s label\'s font', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: 'quantitative', axis:{tickLabelFont: "Helvetica Neue"}}
        }
      });
      const labels = axis.encode.labels(model, X, {}, {});
      assert.equal(labels.font.value, "Helvetica Neue");
    });

    it('tickLabelFontSize should change with axis\'s label\'s font size', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: 'quantitative', axis:{tickLabelFontSize: 20}}
        }
      });
      const labels = axis.encode.labels(model, X, {}, {});
      assert.equal(labels.fontSize.value, 20);
    });
  });

  describe('encode.ticks()', function() {
    it('tickColor should change axis\'s ticks\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {tickColor: '#123'}}
        }
      });
        const axes = axis.encode.ticks(model, X, {});
        assert.equal(axes.stroke.value, '#123');
    });

    it('tickWidth should change axis\'s ticks\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {tickWidth: 13}}
        }
      });
        const axes = axis.encode.ticks(model, X, {});
        assert.equal(axes.strokeWidth.value, 13);
    });
  });

  describe('encode.title()', function() {
    it('titleColor should change axis\'s title\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleColor: '#abc'}}
        }
      });
        const axes = axis.encode.title(model, X, {});
        assert.equal(axes.fill.value, '#abc');
    });

    it('titleFont should change axis\'s title\'s font', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleFont: 'anything'}}
        }
      });
        const axes = axis.encode.title(model, X, {});
        assert.equal(axes.font.value, 'anything');
    });

    it('titleFontSize should change axis\'s title\'s font size', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleFontSize: 56}}
        }
      });
        const axes = axis.encode.title(model, X, {});
        assert.equal(axes.fontSize.value, 56);
    });

    it('titleFontWeight should change axis\'s title\'s font weight', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleFontWeight: 'bold'}}
        }
      });
        const axes = axis.encode.title(model, X, {});
        assert.equal(axes.fontWeight.value, 'bold');
    });
  });
});
