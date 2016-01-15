/* tslint:disable:quotemark */

import {expect} from 'chai';

import {Model} from '../../src/compile/Model';
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
      }).timeFormat(X)).to.equal('%b');

      expect(new Model({
        mark: POINT,
        encoding: {
          x: {timeUnit: 'month', field:'a', type: TEMPORAL}
        }
      }).timeFormat(X)).to.equal('%B');

      expect(new Model({
        mark: POINT,
        encoding: {
          x: {timeUnit: 'week', field:'a', type: TEMPORAL, axis: {shortTimeLabels: true}}
        }
      }).timeFormat(X)).to.equal(undefined);
    });
  });
});
