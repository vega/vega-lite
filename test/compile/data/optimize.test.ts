/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataFlowNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {mergeParse} from '../../../src/compile/data/optimize';
import {moveParseUp} from '../../../src/compile/data/optimizers';
import {TimeUnitNode} from '../../../src/compile/data/timeunit';

describe('compile/data/optimize', () => {
  describe('mergeParse', () => {
    it('should merge non-conflicting ParseNodes', () => {
      const root = new DataFlowNode(null, 'root');
      // ts-ignore is used to suppress the noUnusedLocals error
      // @ts-ignore
      const parse1 = new ParseNode(root, {a: 'number', b: 'string'});
      // @ts-ignore
      const parse2 = new ParseNode(root, {b: 'string', c: 'boolean'});
      mergeParse(parse1);
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
      mergeParse(parse1);
      assert.deepEqual(root.children.length, 1);
      const mergedParseNode = root.children[0] as ParseNode;
      assert.deepEqual(mergedParseNode.parse, {b: 'string', d: 'date'});
      const children = mergedParseNode.children as [ParseNode];
      assert.deepEqual(children[0].parse, {a: 'number'});
      assert.deepEqual(children[1].parse, {a: 'boolean'});
    });
  });
  describe('moveParseUp', () => {
    it('should remove fields from ParseNode which intersect with output of TimeUnitNode', () => {
      const root = new DataFlowNode(null, 'root');
      // @ts-ignore
      const timeUnitNode = new TimeUnitNode(root, {a: {field: 'a', timeUnit: 'day', as: 'day_a'}});
      // @ts-ignore
      const parse = new ParseNode(timeUnitNode, {day_a: 'time', a: 'time'});
      moveParseUp(parse);
      expect(parse.producedFields()).toEqual({a: true});
    });
  });
});
