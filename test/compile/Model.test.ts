/* tslint:disable:quotemark */

import {expect} from 'chai';
import {parseModel} from '../util';
import {X} from '../../src/channel';

describe('Model', function() {
  describe('timeFormat()', function() {
    it('should get the right time template', function() {
      expect(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }).timeFormat(X)).to.equal('%b');

      expect(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'month', field:'a', type: "temporal"}
        }
      }).timeFormat(X)).to.equal('%B');

      expect(parseModel({
        mark: "point",
        encoding: {
          x: {timeUnit: 'week', field:'a', type: "temporal", axis: {shortTimeLabels: true}}
        }
      }).timeFormat(X)).to.equal(undefined);
    });
  });
});
