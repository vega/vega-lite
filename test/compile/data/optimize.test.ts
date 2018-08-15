/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataFlowNode, OutputNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {mergeParse, optimizeDataflow} from '../../../src/compile/data/optimize';
import {moveParseUp} from '../../../src/compile/data/optimizers';
import {SourceNode} from '../../../src/compile/data/source';
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
  describe('optimizeDataFlow', () => {
    it('should push up parse keeping type in order of hierarchy', () => {
      const source = new SourceNode(null);
      const parseOne = new ParseNode(source, {a: 'number'}); // @ts-ignore
      const parseTwo = new ParseNode(source, {b: 'number'});
      const parseThree = new ParseNode(parseTwo, {a: 'date'});
      // @ts-ignore
      const outputOne = new OutputNode(parseOne, 'foo', null, {foo: 1});
      // @ts-ignore
      const outputTwo = new OutputNode(parseThree, 'bar', null, {bar: 1});

      optimizeDataflow({sources: {source: source}} as any);

      expect(source.children.length).toEqual(1);
      expect(source.children[0]).toBeInstanceOf(ParseNode);

      const commonParse = source.children[0] as ParseNode;
      expect(commonParse.parse).toEqual({a: 'date', b: 'number'});

      expect(commonParse.children.length).toEqual(2);
      expect(commonParse.children[0]).toBeInstanceOf(OutputNode);
      expect(commonParse.children[1]).toBeInstanceOf(OutputNode);
    });
  });
});
