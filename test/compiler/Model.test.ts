/* tslint:disable:quotemark */

import {expect} from 'chai';

import {Model} from '../../src/compiler/Model';
import {X} from '../../src/channel';
import {POINT} from '../../src/mark';
import {TEMPORAL} from '../../src/type';

describe('Model', function() {
  describe('labelTemplate', function() {
    it('should get the right time template', function() {
      expect(new Model({
        mark: POINT,
        encoding: {
          x: {timeUnit: 'month', field:'a', type: TEMPORAL, axis: {shortTimeLabels: true}}
        }
      }).labelTemplate(X)).to.equal('month-abbrev');

      expect(new Model({
        mark: POINT,
        encoding: {
          x: {timeUnit: 'month', field:'a', type: TEMPORAL}
        }
      }).labelTemplate(X)).to.equal('month');

      expect(new Model({
        mark: POINT,
        encoding: {
          x: {timeUnit: 'day', field:'a', type: TEMPORAL, axis: {shortTimeLabels: true}}
        }
      }).labelTemplate(X)).to.equal('day-abbrev');

      expect(new Model({
        mark: POINT,
        encoding: {
          x: {timeUnit: 'day', field:'a', type: TEMPORAL}
        }
      }).labelTemplate(X)).to.equal('day');

      expect(new Model({
        mark: POINT,
        encoding: {
          x: {timeUnit: 'week', field:'a', type: TEMPORAL, axis: {shortTimeLabels: true}}
        }
      }).labelTemplate(X)).to.equal(null);
    });
  });

});
