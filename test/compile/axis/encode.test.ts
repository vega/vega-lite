/* tslint:disable:quotemark */

import {assert} from 'chai';

import {parseUnitModel, parseModel} from '../../util';
import * as encode from '../../../src/compile/axis/encode';


describe('compile/axis', () => {
  describe('encode.domain()', function() {
    it('axisColor should change axis\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {axisColor: '#fff'}}
        }
      });
        const axes = encode.domain(model, 'x', {});
        assert.equal(axes.stroke.value, '#fff');
    });

    it('axisWidth should change axis\'s width', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {axisWidth: 2}}
        }
      });
        const axes = encode.domain(model, 'x', {});
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
        const axes = encode.grid(model, 'x', {});
        assert.equal(axes.stroke.value, '#fff');
    });

    it('gridOpacity should change grid\'s opacity', function(){
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {grid: true, gridOpacity: 0.6}}
        }
      });
        const axes = encode.grid(model, 'x', {});
        assert.equal(axes.strokeOpacity.value, 0.6);
    });

     it('gridWidth should change grid\'s width', function(){
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {grid: true, gridWidth: 2}}
        }
      });
        const axes = encode.grid(model, 'x', {});
        assert.equal(axes.strokeWidth.value, 2);
    });

    it('gridDash should change grid\'s dash offset', function(){
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {grid: true, gridDash: [2]}}
        }
      });
        const axes = encode.grid(model, 'x', {});
        assert.deepEqual(axes.strokeDashOffset.value, [2]);
    });
  });

  describe('encode.labels()', function () {
    it('should show truncated labels by default', function () {
      const labels = encode.labels(parseUnitModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal"}
          }
        }), 'x', {}, {orient: 'top'});
      assert.deepEqual(labels.text.signal, 'truncate(datum.value, 25)');
    });

    it('should rotate labels if labelAngle is defined', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {labelAngle: -45}}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
      assert.equal(labels.angle.value, -45);
    });

    it('should rotate label', function() {
      const model = parseUnitModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
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
      const labels = encode.labels(model, 'column', {}, {});
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
      const labels = encode.labels(model, 'x', {}, {});
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
      const labels = encode.labels(model, 'x', {}, {});
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
      const labels = encode.labels(model, 'x', {}, {});
      assert.equal(labels.fill.value, "blue");
    });

    it('tickLabelFont should change with axis\'s label\'s font', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: 'quantitative', axis:{tickLabelFont: "Helvetica Neue"}}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
      assert.equal(labels.font.value, "Helvetica Neue");
    });

    it('tickLabelFontSize should change with axis\'s label\'s font size', function() {
      const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: 'quantitative', axis:{tickLabelFontSize: 20}}
        }
      });
      const labels = encode.labels(model, 'x', {}, {});
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
        const axes = encode.ticks(model, 'x', {});
        assert.equal(axes.stroke.value, '#123');
    });

    it('tickWidth should change axis\'s ticks\'s color', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {tickWidth: 13}}
        }
      });
        const axes = encode.ticks(model, 'x', {});
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
        const axes = encode.title(model, 'x', {});
        assert.equal(axes.fill.value, '#abc');
    });

    it('titleFont should change axis\'s title\'s font', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleFont: 'anything'}}
        }
      });
        const axes = encode.title(model, 'x', {});
        assert.equal(axes.font.value, 'anything');
    });

    it('titleFontSize should change axis\'s title\'s font size', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleFontSize: 56}}
        }
      });
        const axes = encode.title(model, 'x', {});
        assert.equal(axes.fontSize.value, 56);
    });

    it('titleFontWeight should change axis\'s title\'s font weight', function() {
        const model = parseModel({
        mark: "point",
        encoding: {
          x: {field: "a", type: "quantitative", axis: {titleFontWeight: 'bold'}}
        }
      });
        const axes = encode.title(model, 'x', {});
        assert.equal(axes.fontWeight.value, 'bold');
    });
  });
});
