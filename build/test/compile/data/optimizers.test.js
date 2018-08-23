/* tslint:disable:quotemark */
import { assert } from 'chai';
import { DataFlowNode } from '../../../src/compile/data/dataflow';
import { ImputeNode } from '../../../src/compile/data/impute';
import { mergeIdenticalTransforms } from '../../../src/compile/data/optimizers';
describe('compile/data/optimizer', function () {
    it('should merge two impute nodes with identical transforms', function () {
        var transform = {
            impute: 'y',
            key: 'x',
            method: 'value',
            value: 200
        };
        var root = new DataFlowNode(null, 'root');
        var transform1 = new ImputeNode(root, transform);
        // @ts-ignore
        var transform2 = new ImputeNode(root, transform);
        mergeIdenticalTransforms(root);
        assert.deepEqual(root.children.length, 1);
        assert.deepEqual(root.children[0], transform1);
    });
});
//# sourceMappingURL=optimizers.test.js.map