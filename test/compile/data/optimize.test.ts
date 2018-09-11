/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {mergeParse} from '../../../src/compile/data/optimize';

describe('compile/data/optimize', () => {
  describe('mergeParse', () => {
    it('should merge non-conflicting ParseNodes', () => {
      const root = new DataFlowNode(null, 'root');
      // ts-ignore is used to suppress the noUnusedLocals error
      // @ts-ignore
      const parse1 = new ParseNode(root, {a: 'number', b: 'string'});
      // @ts-ignore
      const parse2 = new ParseNode(root, {b: 'string', c: 'boolean'});
      mergeParse(root);
      assert.deepEqual(root.children.length, 1);
      const mergedParseNode = root.children[0] as ParseNode;
      assert.deepEqual(mergedParseNode.parse, {a: 'number', b: 'string', c: 'boolean'});
    });

    it('should not merge conflicting ParseNodes', () => {
      const root = new DataFlowNode(null, 'root');
      // @ts-ignore
      const parse1 = new ParseNode(root, {a: 'number', b: 'string'});
      // @ts-ignore
      const parse2 = new ParseNode(root, {a: 'boolean', d: 'date'});
      mergeParse(root);
      assert.deepEqual(root.children.length, 1);
      const mergedParseNode = root.children[0] as ParseNode;
      assert.deepEqual(mergedParseNode.parse, {b: 'string', d: 'date'});
      const children = mergedParseNode.children as [ParseNode, ParseNode];
      assert.deepEqual(children[0].parse, {a: 'number'});
      assert.deepEqual(children[1].parse, {a: 'boolean'});
    });
  });
});
