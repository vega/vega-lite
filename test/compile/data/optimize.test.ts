/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {mergeParse} from '../../../src/compile/data/optimize';

describe('compile/data/optimize', () => {
  describe('mergeParse', () => {
    it('should merge non-conflicting ParseNodes', () => {
      const root = new DataFlowNode(null, 'root');
      const parse1 = new ParseNode(root, {a: 'number', b: 'string'});
      const parse2 = new ParseNode(root, {c: 'boolean', d: 'date'});
      mergeParse(root);
      assert.deepEqual(root.children.length, 1);
      const mergedParseNode = root.children[0] as ParseNode;
      assert.deepEqual(mergedParseNode.parse, {a: 'number', b: 'string', c: 'boolean', d: 'date'});
    });

    it('should not merge conflicting ParseNodes', () => {
      const root = new DataFlowNode(null, 'root');
      const parse1 = new ParseNode(root, {a: 'number', b: 'string'});
      const parse2 = new ParseNode(root, {a: 'boolean', d: 'date'});
      mergeParse(root);
      assert.deepEqual(root.children.length, 2);
      assert.deepEqual(root.children[0], parse1);
      assert.deepEqual(root.children[1], parse2);
    });
  });
});
