/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ImputeNode} from '../../../src/compile/data/impute';
import {mergeIdenticalTransforms} from '../../../src/compile/data/optimizers';
import {Transform} from '../../../src/transform';

describe('compile/data/optimizer', () => {
  it('should merge two impute nodes with identical transforms', () => {
    const transform: Transform = {
      impute: 'y',
      key: 'x',
      method: 'value',
      value: 200
    };
    const root = new DataFlowNode(null, 'root');
    const transform1 = new ImputeNode(root, transform);
    // @ts-ignore
    const transform2 = new ImputeNode(root, transform);
    mergeIdenticalTransforms(root);
    assert.deepEqual(root.children.length, 1);
    assert.deepEqual(root.children[0], transform1);
  });
});
