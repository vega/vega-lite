/* tslint:disable:quotemark */

import {expect} from 'chai';

import {parseModel} from '../util';
import * as axis from '../../src/compile/axis';
import {X, COLUMN} from '../../src/channel';

describe('Axis', function() {
  describe('= true', function() {
    it('should produce default properties for axis', function() {
      const model1 = parseModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum", "axis": true}
        },
        "data": {"url": "data/movies.json"}
      });

      const model2 = parseModel({
        "mark": "bar",
        "encoding": {
          "y": {"type": "quantitative", "field": 'US_Gross', "aggregate": "sum"}
        },
        "data": {"url": "data/movies.json"}
      });
      expect(model1.spec().encoding.y.axis).to.eql(model2.spec().encoding.y.axis);
    });
  });

  describe('(X) for Time Data', function() {
    var encoding = parseModel({
        mark: "line",
        encoding: {
          x: {field: "a", type: "temporal", timeUnit: "month"}
        }
      });
    var _axis = axis.compileAxis(X, encoding);

    // FIXME decouple the test here

    it('should use custom format', function() {
      expect(_axis.format).to.equal('%B');
    });
    it('should rotate label', function() {
      expect(_axis.properties.labels.angle.value).to.equal(270);
    });
  });


  describe('grid()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });

  describe('orient()', function () {
    it('should return specified orient', function () {
      var orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', axis:{orient: 'bottom'}}
          }
        }), X);
      expect(orient).to.eql('bottom');
    });

    it('should return undefined by default', function () {
      var orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'}
          }
        }), X);
      expect(orient).to.eql(undefined);
    });

    it('should return top for COL', function () {
      var orient = axis.orient(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a'},
            column: {field: 'a'}
          }
        }), COLUMN);
      expect(orient).to.eql('top');
    });
  });

  describe('labels()', function () {
    it('should show labels by default', function () {
      var labels = axis.properties.labels(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal"}
          }
        }), X, {}, {orient: 'top'});
      expect(labels.text.template).to.eql('{{ datum.data | truncate:25}}');
    });

    it('should hide labels if labels are set to false', function () {
      var labels = axis.properties.labels(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "ordinal", axis: {labels: false}}
          }
        }), X, {}, null);
      expect(labels.text).to.eql('');
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', axis: {title: 'Custom'}}
          }
        }), X);
      expect(title).to.eql('Custom');
    });

    it('should add return fieldTitle by default', function () {
      var title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", axis: {titleMaxLength: 3}}
          }
        }), X);
      expect(title).to.eql('a');
    });

    it('should add return fieldTitle by default', function () {
      var title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", aggregate: 'sum', axis: {titleMaxLength: 10}}
          }
        }), X);
      expect(title).to.eql('SUM(a)');
    });

    it('should add return fieldTitle by default and truncate', function () {
      var title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'a', type: "quantitative", aggregate: 'sum', axis: {titleMaxLength: 3}}
          }
        }), X);
      expect(title).to.eql('SU…');
    });


    it('should add return fieldTitle by default and truncate', function () {
      var title = axis.title(parseModel({
          mark: "point",
          encoding: {
            x: {field: 'abcdefghijkl'}
          },
          config: {
            cell: {width: 60}
          }
        }), X);
      expect(title).to.eql('abcdefghi…');
    });
  });

  describe('titleOffset()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });
});
