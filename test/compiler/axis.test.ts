import {expect} from 'chai';

import * as axis from '../../src/compiler/axis';
import {Model} from '../../src/compiler/Model';
import {POINT, LINE} from '../../src/mark';
import {X, COLUMN} from '../../src/channel';
import {TEMPORAL, QUANTITATIVE, ORDINAL} from '../../src/type';
import * as vl from '../../src/vl';

describe('Axis', function() {
  describe('=true', function() {
    it('should produce default properties for axis', function() {
      const spec1 = vl.compile({
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'}
        }
      });
      const spec2 = vl.compile({
        mark: 'point',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative', axis: true},
          y: {field: 'Miles_per_Gallon', type: 'quantitative', axis: true}
        }
      });
      expect(spec1).to.eql(spec2);
    });
  });

  describe('(X) for Time Data', function() {
    var field = 'a',
      timeUnit = 'month',
      encoding = new Model({
        mark: LINE,
        encoding: {
          x: {field: field, type: TEMPORAL, timeUnit: timeUnit}
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
      var orient = axis.orient(new Model({
          mark: POINT,
          encoding: {
            x: {field: 'a', axis:{orient: 'bottom'}}
          }
        }), X);
      expect(orient).to.eql('bottom');
    });

    it('should return undefined by default', function () {
      var orient = axis.orient(new Model({
          mark: POINT,
          encoding: {
            x: {field: 'a'}
          }
        }), X);
      expect(orient).to.eql(undefined);
    });

    it('should return top for COL', function () {
      var orient = axis.orient(new Model({
          mark: POINT,
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
      var labels = axis.properties.labels(new Model({
          mark: POINT,
          encoding: {
            x: {field: 'a', type: ORDINAL}
          }
        }), X, {}, {orient: 'top'});
      expect(labels.text.template).to.eql('{{ datum.data | truncate:25}}');
    });

    it('should hide labels if labels are set to false', function () {
      var labels = axis.properties.labels(new Model({
          mark: POINT,
          encoding: {
            x: {field: 'a', type: ORDINAL, axis: {labels: false}}
          }
        }), X, {}, null);
      expect(labels.text).to.eql('');
    });
  });

  describe('title()', function () {
    it('should add explicitly specified title', function () {
      var title = axis.title(new Model({
          mark: POINT,
          encoding: {
            x: {field: 'a', axis: {title: 'Custom'}}
          }
        }), X);
      expect(title).to.eql('Custom');
    });

    it('should add return fieldTitle by default', function () {
      var title = axis.title(new Model({
          mark: POINT,
          encoding: {
            x: {field: 'a', type: QUANTITATIVE, axis: {titleMaxLength: 3}}
          }
        }), X);
      expect(title).to.eql('a');
    });

    it('should add return fieldTitle by default', function () {
      var title = axis.title(new Model({
          mark: POINT,
          encoding: {
            x: {field: 'a', type: QUANTITATIVE, aggregate: 'sum', axis: {titleMaxLength: 10}}
          }
        }), X);
      expect(title).to.eql('SUM(a)');
    });

    it('should add return fieldTitle by default and truncate', function () {
      var title = axis.title(new Model({
          mark: POINT,
          encoding: {
            x: {field: 'a', type: QUANTITATIVE, aggregate: 'sum', axis: {titleMaxLength: 3}}
          }
        }), X);
      expect(title).to.eql('SU…');
    });


    it('should add return fieldTitle by default and truncate', function () {
      var title = axis.title(new Model({
          mark: POINT,
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
