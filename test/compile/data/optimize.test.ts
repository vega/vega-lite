/* tslint:disable:quotemark */

import {assert} from 'chai';
import {DataFlowNode, OutputNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {mergeParse, optimizeDataflow} from '../../../src/compile/data/optimize';
import {SourceNode} from '../../../src/compile/data/source';

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
      const timeUnitNode = new TimeUnitNode(root, {a: {field: 'a', timeUnit: 'day', as: 'day_a'}});
      const parse = new ParseNode(timeUnitNode, {day_a: 'time', a: 'time'});

      moveParseUp(parse);
      expect(parse.producedFields()).toEqual({a: true});
    });
  });
  describe('optimizeDataFlow', () => {
    it('should push up common parse', () => {
      const source = new SourceNode(null);
      // @ts-ignore
      const parseOne = new ParseNode(source, {a: 'time', b: 'number'});
      // @ts-ignore
      const parseTwo = new ParseNode(source, {a: 'time', b: 'date'});
      // @ts-ignore
      const outputOne = new OutputNode(parseOne, 'foo', null, {foo: 1});
      // @ts-ignore
      const outputTwo = new OutputNode(parseTwo, 'bar', null, {bar: 1});

      optimizeDataflow({sources: {source: source}} as any);

      expect(source.children.length).toEqual(1);
      expect(source.children[0]).toBeInstanceOf(ParseNode);

      const commonParse = source.children[0] as ParseNode;
      expect(commonParse.parse).toEqual({a: 'time'});
      expect(commonParse.children.length).toEqual(2);

      expect(commonParse.children[0]).toBeInstanceOf(ParseNode);
      expect(commonParse.children[0]).toMatchObject(parseOne);

      expect(commonParse.children[1]).toBeInstanceOf(ParseNode);
      expect(commonParse.children[1]).toMatchObject(parseTwo);
    });
    it('should push parse up from lowest level first to avoid conflicting common parse', () => {
      const source = new SourceNode(null);
      const parseOne = new ParseNode(source, {a: 'time'});
      const parseTwo = new ParseNode(source, {b: 'number'});
      const parseThree = new ParseNode(parseTwo, {a: 'number'});
      // @ts-ignore
      const outputOne = new OutputNode(parseOne, 'foo', null, {foo: 1});
      // @ts-ignore
      const outputTwo = new OutputNode(parseThree, 'bar', null, {bar: 1});

      optimizeDataflow({sources: {source: source}} as any);

      expect(source.children.length).toEqual(1);
      expect(source.children[0]).toBeInstanceOf(ParseNode);

      const commonParse = source.children[0] as ParseNode;
      expect(commonParse.parse).toEqual({b: 'number'});

      expect(commonParse.children.length).toEqual(2);
      expect(commonParse.children[0]).toBeInstanceOf(ParseNode);
      expect(commonParse.children[1]).toBeInstanceOf(ParseNode);

      const p1 = commonParse.children[0] as ParseNode;
      const p2 = commonParse.children[0] as ParseNode;

      expect(p1.parse).toEqual({a: 'time'});
      expect(p2.parse).toEqual({a: 'number'});
    });
  });
});
