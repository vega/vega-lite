/* tslint:disable:quotemark */

import {assert} from 'chai';
import {parseModel} from '../util';
import {X} from '../../src/channel';

describe('Model', function() {
  describe('timeFormat()', function() {
    it('should get the right time template', function() {
      assert.equal(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }).timeFormat(X), '%b');

      assert.equal(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }).timeFormat(X), '%B');

      assert.equal(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }).timeFormat(X), undefined);
    });
  });
});
