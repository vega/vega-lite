import {expect} from 'chai';

import * as axis from '../../src/compiler/axis';
import {Model} from '../../src/compiler/Model';

describe('Axis', function() {
  var stats = {a: {distinct: 5}, b: {distinct: 32}},
    layout = {
      cellWidth: 60,  // default characterWidth = 6
      cellHeight: 60
    };

  describe('(X) for Time Data', function() {
    var field = 'a',
      timeUnit = 'month',
      encoding = new Model({
        marktype: 'line',
        encoding: {
          x: {name: field, type: 'temporal', timeUnit: timeUnit}
        }
      });
    var _axis = axis.def('x', encoding, {
      width: 200,
      height: 200,
      cellWidth: 200,
      cellHeight: 200,
      x: {
        axisTitleOffset: 60
      },
      y: {
        axisTitleOffset: 60
      }
    }, stats);

    //FIXME decouple the test here

    it('should use custom label', function() {
      expect(_axis.properties.labels.text.scale).to.equal('time-'+ timeUnit);
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
      var orient = axis.orient(new Model({
          encoding: {
            x: {name: 'a', axis:{orient: 'bottom'}}
          }
        }), 'x', {}, stats);
      expect(orient).to.eql('bottom');
    });

    it('should return undefined by default', function () {
      var orient = axis.orient(new Model({
          encoding: {
            x: {name: 'a'}
          }
        }), 'x', {}, stats);
      expect(orient).to.eql(undefined);
    });

    it('should return top for COL', function () {
      var orient = axis.orient(new Model({
          encoding: {
            x: {name: 'a'},
            col: {name: 'a'}
          }
        }), 'col', {}, stats);
      expect(orient).to.eql('top');
    });

    it('should return top for X with high cardinality, ordinal Y', function () {
      var orient = axis.orient(new Model({
          encoding: {
            x: {name: 'a'},
            y: {name: 'b', type: 'ordinal'}
          }
        }), 'x', {}, stats);
      expect(orient).to.eql('top');
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var title = axis.title(new Model({
          encoding: {
            x: {name: 'a', axis: {title: 'Custom'}}
          }
        }), 'x', layout);
      expect(title).to.eql('Custom');
    });

    it('should add return fieldTitle by default', function () {
      var title = axis.title(new Model({
          encoding: {
            x: {name: 'a', type: 'Q', axis: {titleMaxLength: 3}}
          }
        }), 'x', layout);
      expect(title).to.eql('a');
    });

    it('should add return fieldTitle by default', function () {
      var title = axis.title(new Model({
          encoding: {
            x: {name: 'a', type: 'Q', aggregate: 'sum', axis: {titleMaxLength: 10}}
          }
        }), 'x', layout);
      expect(title).to.eql('SUM(a)');
    });

    it('should add return fieldTitle by default and truncate', function () {
      var title = axis.title(new Model({
          encoding: {
            x: {name: 'a', type: 'Q', aggregate: 'sum', axis: {titleMaxLength: 3}}
          }
        }), 'x', layout);
      expect(title).to.eql('SU…');
    });


    it('should add return fieldTitle by default and truncate', function () {
      var title = axis.title(new Model({
          encoding: {
            x: {name: 'abcdefghijkl'}
          }
        }), 'x', layout);
      expect(title).to.eql('abcdefghi…');
    });
  });

  describe('titleOffset()', function () {
    // FIXME(kanitw): Jul 19, 2015 - write test
  });
});
