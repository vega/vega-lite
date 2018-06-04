/* tslint:disable:quotemark */

import {assert} from 'chai';
import {ImputeTransformNode} from '../../../src/compile/data/impute';
import {Transform} from '../../../src/transform';

describe('compile/data/impute', () => {
  it('should return a proper vg transform', () => {
    const transform: Transform= {
      impute: 'y',
      key: 'x',
      method: 'value',
      value: 200
    };
    const impute = new ImputeTransformNode(null, transform);
    assert.deepEqual(impute.assemble(), {
      type: 'impute',
      field: 'y',
      key: 'x',
      method: 'value',
      value: 200
    });
  });

  it('should use keyvals and mean correctly', () => {
    const transform: Transform= {
      impute: 'y',
      key: 'x',
      keyvals: [2, 3],
      method: 'mean'
    };
    const impute = new ImputeTransformNode(null, transform);
    assert.deepEqual(impute.assemble(), {
      type: 'impute',
      field: 'y',
      key: 'x',
      keyvals: [2, 3],
      method: 'mean'
    });
  });

  it('should handle every property correctly', () => {
    const transform: Transform= {
      impute: 'y',
      key: 'x',
      keyvals: [3, 5],
      method: 'max',
      groupby: ['a', 'b']

    };
    const impute = new ImputeTransformNode(null, transform);
    assert.deepEqual(impute.assemble(), {
      type: 'impute',
      field: 'y',
      key: 'x',
      keyvals: [3, 5],
      method: 'max',
      groupby: ['a','b']
    });
  });
});
