/* tslint:disable:quotemark */

import {assert} from 'chai';
import {FlattenTransformNode} from '../../../src/compile/data/flatten';
import {Transform} from '../../../src/transform';

describe('compile/data/flatten', () => {
  describe('FlattenTransformNode', () => {
    it ('should return a proper vg transform', () => {
      const transform: Transform = {
        flatten: ['a', 'b'],
        as: ['a', 'b']
      };
      const flatten = new FlattenTransformNode(null, transform);
      assert.deepEqual(flatten.assemble(), {
        type: 'flatten',
        fields: ['a','b'],
        as: ['a','b']
      });
    });

    it ('should handle missing "as" field', () => {
      const transform: Transform = {
        flatten: ['a', 'b']
      };
      const flatten = new FlattenTransformNode(null, transform);
      assert.deepEqual(flatten.assemble(), {
        type: 'flatten',
        fields: ['a','b'],
        as: ['a','b']
      });
    });

    it ('should handle partial "as" field', () => {
      const transform: Transform = {
        flatten: ['a', 'b'],
        as: ['A']
      };
      const flatten = new FlattenTransformNode(null, transform);
      assert.deepEqual(flatten.assemble(), {
        type: 'flatten',
        fields: ['a','b'],
        as: ['A','b']
      });
    });

    it ('should return proper produced fields', () => {
      const transform: Transform = {
        flatten: ['a', 'b']
      };
      const flatten = new FlattenTransformNode(null, transform);
      assert.deepEqual(flatten.producedFields(), {'a': true, 'b': true});
    });
  });
});
