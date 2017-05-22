/* tslint:disable quotemark */

import {assert} from 'chai';
import {COLOR, SHAPE, SIZE} from '../../../src/channel';
import {geoshape} from '../../../src/compile/mark/geoshape';
import {parseUnitModel} from '../../util';

describe('Mark: Geoshape', function () {
  describe('with shape', function() {
    const model = parseUnitModel({
      "mark": "geoshape",
      "encoding": {
        "shape": {},
      }
    });

    const props = geoshape.encodeEntry(model);

    it('should do something', function() {
      assert.isTrue(true);
    });
  });

  describe('with color', function() {
    const model = parseUnitModel({
      "mark": "geoshape",
      "encoding": {
        "shape": {},
        "color": {},
      }
    });

    const props = geoshape.encodeEntry(model);

    it('should do something', function() {
      assert.isTrue(true);
    });
  });

  describe('with size', function() {
    const model = parseUnitModel({
      "mark": "geoshape",
      "encoding": {
        "shape": {},
        "size": {},
      }
    });

    const props = geoshape.encodeEntry(model);

    it('should do something', function() {
      assert.isTrue(true);
    });
  });
});
