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
          x:
          {field: "a",
           type: "quantitative",
           axis: {grid: true, gridColor: "blue", gridWidth: 20}
          }
        }
      });
      const def = axis.parseInnerAxis(X, model);
      assert.isObject(def);
      assert.equal(def.type, 'x');
      assert.equal(def.scale, 'x');
      assert.deepEqual(def.properties.grid, {stroke: {value: "blue"}, strokeWidth: {value: 20}});
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
      assert.equal(def.type, 'x');
      assert.equal(def.scale, 'x');
    });
  });

  describe('grid()', function () {
    it('should return specified orient', function () {
      const grid = axis.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', axis:{grid: false}}
          }
        }), X);
      assert.deepEqual(grid, false);
    });

    it('should return true by default', function () {
      const grid = axis.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'}
          }
        }), X);
      assert.deepEqual(grid, true);
    });

    it('should return undefined for COLUMN', function () {
      const grid = axis.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'}
          }
        }), COLUMN);
      assert.deepEqual(grid, undefined);
    });

    it('should return undefined for ROW', function () {
      const grid = axis.grid(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'}
          }
        }), ROW);
      assert.deepEqual(grid, undefined);
    });
  });

  describe('layer()', function () {
    it('should return undefined by default without grid defined', function () {
      const layer = axis.layer(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'}
          }
        }), X, Y);
      assert.deepEqual(layer, undefined);
    });

    it('should return back by default with grid defined', function () {
      const layer = axis.layer(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'}
          }
        }), X, {grid: true});
      assert.deepEqual(layer, "back");
    });

    it('should return specified layer', function () {
      const layer = axis.layer(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', axis: {layer: "front"}}
          }
        }), X, {grid: true});
      assert.deepEqual(layer, "front");
    });
  });

  describe('orient()', function () {
    it('should return specified orient', function () {
      const orient = axis.orient(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', axis:{orient: 'bottom'}}
          }
        }), X);
      assert.deepEqual(orient, 'bottom');
    });

    it('should return undefined by default', function () {
      const orient = axis.orient(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a'}
          }
        }), X);
      assert.deepEqual(orient, undefined);
    });

    it('should return top for COL', function () {
      const orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'},
            column: {field: 'a'}
          }
        }), COLUMN);
      assert.deepEqual(orient, 'top');
    });
  });

  describe('ticks', function() {
    it('should return undefined by default', function () {
      const ticks = axis.ticks(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a'}
          }
        }), Y);
      assert.deepEqual(ticks, undefined);
    });

    it('should return 5 by default', function () {
      const ticks = axis.ticks(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'}
          }
        }), X);
      assert.deepEqual(ticks, 5);
    });

    it('should return specified ticks', function () {
      const ticks = axis.ticks(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', axis: {ticks: 10}}
          }
        }), X);
      assert.deepEqual(ticks, 10);
    });
  });

  describe('tickSize', function() {
    it('should return undefined by default', function () {
      const tickSize = axis.tickSize(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a'}
          }
        }), Y);
      assert.deepEqual(tickSize, undefined);
    });

    it('should return specified ticks', function () {
      const tickSize = axis.tickSize(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a', axis: {tickSize: 10}}
          }
        }), Y);
      assert.deepEqual(tickSize, 10);
    });
  });

  describe('tickSizeEnd', function() {
    it('should return undefined by default', function () {
      const tickSizeEnd = axis.tickSizeEnd(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a'}
          }
        }), Y);
      assert.deepEqual(tickSizeEnd, undefined);
    });

    it('should return specified ticks', function () {
      const tickSizeEnd = axis.tickSizeEnd(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a', axis: {tickSizeEnd: 5}}
          }
        }), Y);
      assert.deepEqual(tickSizeEnd, 5);
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      const title = axis.title(parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: 'a', axis: {title: 'Custom'}}
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
            x: {field: 'abcdefghijkl'}
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
          y: {field: 'abcdefghijkl'}
        }
      }), Y);
      assert.deepEqual(title, 'abcdefghi…');
    });
  });

  describe('titleOffset', function() {
    it('should return undefined by default', function () {
      const titleOffset = axis.titleOffset(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a'}
          }
        }), Y);
      assert.deepEqual(titleOffset, undefined);
    });

    it('should return specified ticks', function () {
      const titleOffset = axis.titleOffset(parseModel({
          mark: "point",
          encoding: {
            y: {field: 'a', axis: {tickSize: 10, titleOffset: 15}}
          }
        }), Y);
      assert.deepEqual(titleOffset, 15);
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

  describe('properties.axis()', function() {
    it('axisColor should change axis\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {axisColor: '#fff'}}
        }
      });
        const axes = axis.properties.axis(model, X, {});
        assert.equal(axes.stroke.value, '#fff');
    });

    it('axisWidth should change axis\'s width', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {axisWidth: 2}}
        }
      });
        const axes = axis.properties.axis(model, X, {});
        assert.equal(axes.strokeWidth.value, 2);
    });
  });

  describe('properties.grid()', function(){
      it('gridColor should change grid\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {gridColor: '#fff'}}
        }
      });
        const axes = axis.properties.grid(model, X, {});
        assert.equal(axes.stroke.value, '#fff');
    });

    it('gridOpacity should change grid\'s opacity', function(){
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {grid: true, gridOpacity: 0.6}}
        }
      });
        const axes = axis.properties.grid(model, X, {});
        assert.equal(axes.strokeOpacity.value, 0.6);
    });

     it('gridWidth should change grid\'s width', function(){
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {grid: true, gridWidth: 2}}
        }
      });
        const axes = axis.properties.grid(model, X, {});
        assert.equal(axes.strokeWidth.value, 2);
    });

    it('gridDash should change grid\'s dash offset', function(){
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {grid: true, gridDash: [2]}}
        }
      });
        const axes = axis.properties.grid(model, X, {});
        assert.deepEqual(axes.strokeDashOffset.value, [2]);
    });
  });

  describe('properties.labels()', function () {
    it('should show labels by default', function () {
      const labels = axis.properties.labels(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal"}
          }
        }), X, {}, {orient: 'top'});
      assert.deepEqual(labels.text.template, '{{ datum["data"] | truncate:25 }}');
    });

    it('should hide labels if labels are set to false', function () {
      const labels = axis.properties.labels(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal", axis: {labels: false}}
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
      const labels = axis.properties.labels(model, X, {}, {});
      assert.equal(labels.angle.value, -45);
    });

    it('should rotate label', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });
      const labels = axis.properties.labels(model, X, {}, {type: 'x'});
      assert.equal(labels.angle.value, 270);
      assert.equal(labels.baseline.value, 'middle');
    });

    it('should have correct text.template for quarter timeUnits', function () {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "quarter"}
        }
      });
      const labels = axis.properties.labels(model, X, {}, {type: 'x'});
      let quarterPrefix = 'Q';
      let expected = quarterPrefix + '{{datum["data"] | quarter}}';
      assert.deepEqual(labels.text.template, expected);
    });

    it('should have correct text.template for yearquartermonth timeUnits', function () {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "yearquartermonth"}
        }
      });
      const labels = axis.properties.labels(model, X, {}, {type: 'x'});
      let quarterPrefix = 'Q';
      let expected = quarterPrefix + '{{datum["data"] | quarter}} {{datum["data"] | time:\'%b %Y\'}}';
      assert.deepEqual(labels.text.template, expected);
    });

    it('tickLabelColor should change with axis\'s label\' color', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", axis:{tickLabelColor: "blue"}}
        }
      });
      const labels = axis.properties.labels(model, X, {}, {});
      assert.equal(labels.fill.value, "blue");
    });

    it('tickLabelFont should change with axis\'s label\'s font', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", axis:{tickLabelFont: "Helvetica Neue"}}
        }
      });
      const labels = axis.properties.labels(model, X, {}, {});
      assert.equal(labels.font.value, "Helvetica Neue");
    });

    it('tickLabelFontSize should change with axis\'s label\'s font size', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", axis:{tickLabelFontSize: 20}}
        }
      });
      const labels = axis.properties.labels(model, X, {}, {});
      assert.equal(labels.fontSize.value, 20);
    });
  });

  describe('properties.ticks()', function() {
    it('tickColor should change axis\'s ticks\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {tickColor: '#123'}}
        }
      });
        const axes = axis.properties.ticks(model, X, {});
        assert.equal(axes.stroke.value, '#123');
    });

    it('tickWidth should change axis\'s ticks\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {tickWidth: 13}}
        }
      });
        const axes = axis.properties.ticks(model, X, {});
        assert.equal(axes.strokeWidth.value, 13);
    });
  });

  describe('properties.title()', function() {
    it('titleColor should change axis\'s title\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleColor: '#abc'}}
        }
      });
        const axes = axis.properties.title(model, X, {});
        assert.equal(axes.fill.value, '#abc');
    });

    it('titleFont should change axis\'s title\'s font', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleFont: 'anything'}}
        }
      });
        const axes = axis.properties.title(model, X, {});
        assert.equal(axes.font.value, 'anything');
    });

    it('titleFontSize should change axis\'s title\'s font size', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleFontSize: 56}}
        }
      });
        const axes = axis.properties.title(model, X, {});
        assert.equal(axes.fontSize.value, 56);
    });

    it('titleFontWeight should change axis\'s title\'s font weight', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleFontWeight: 'bold'}}
        }
      });
        const axes = axis.properties.title(model, X, {});
        assert.equal(axes.fontWeight.value, 'bold');
    });
  });
});
