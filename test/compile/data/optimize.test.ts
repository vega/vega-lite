import {DataFlowNode, OutputNode} from '../../../src/compile/data/dataflow';
import {ParseNode} from '../../../src/compile/data/formatparse';
import {optimizeDataflow} from '../../../src/compile/data/optimize';
import {MergeParse} from '../../../src/compile/data/optimizers';
import {SourceNode} from '../../../src/compile/data/source';

describe('compile/data/optimize', () => {
  describe('mergeParse', () => {
    it('should merge non-conflicting ParseNodes', () => {
      const root = new DataFlowNode(null, 'root');
      const parse1 = new ParseNode(root, {a: 'number', b: 'string'});
      new ParseNode(root, {b: 'string', c: 'boolean'});
      const optimizer = new MergeParse();
      optimizer.run(parse1);
      expect(root.children.length).toEqual(1);
      const mergedParseNode = root.children[0] as ParseNode;
      expect(mergedParseNode.parse).toEqual({a: 'number', b: 'string', c: 'boolean'});
    });

    it('should not merge conflicting ParseNodes', () => {
      const root = new DataFlowNode(null, 'root');
      const parse1 = new ParseNode(root, {a: 'number', b: 'string'});
      new ParseNode(root, {a: 'boolean', d: 'date'});
      const optimizer = new MergeParse();
      optimizer.run(parse1);
      expect(root.children.length).toEqual(1);
      const mergedParseNode = root.children[0] as ParseNode;
      expect(mergedParseNode.parse).toEqual({b: 'string', d: 'date'});
      const children = mergedParseNode.children as [ParseNode, ParseNode];
      expect(children[0].parse).toEqual({a: 'number'});
      expect(children[1].parse).toEqual({a: 'boolean'});
    });

    it('should merge when there is no parse node', () => {
      const root = new DataFlowNode(null, 'root');
      const parse = new ParseNode(root, {a: 'number', b: 'string'});
      const parseChild = new DataFlowNode(parse);
      const otherChild = new DataFlowNode(root);
      const optimizer = new MergeParse();
      optimizer.run(parse);
      expect(root.children.length).toEqual(1);
      const mergedParseNode = root.children[0] as ParseNode;
      expect(mergedParseNode.parse).toEqual({a: 'number', b: 'string'});
      const children = mergedParseNode.children;
      expect(children).toHaveLength(2);
      expect(children[0]).toEqual(otherChild);
      expect(children[1]).toEqual(parseChild);
    });
  });

  describe('optimizeDataFlow', () => {
    it('should move up common parse', () => {
      const source = new SourceNode(null);
      const parseOne = new ParseNode(source, {a: 'time', b: 'number'});
      const parseTwo = new ParseNode(source, {a: 'time', b: 'date'});
      new OutputNode(parseOne, 'foo', null, {foo: 1});
      new OutputNode(parseTwo, 'bar', null, {bar: 1});

      optimizeDataflow({sources: [source]} as any, null);

      expect(source.children).toHaveLength(1);
      expect(source.children[0]).toBeInstanceOf(ParseNode);

      const commonParse = source.children[0] as ParseNode;
      expect(commonParse.parse).toEqual({a: 'time'});
      expect(commonParse.children).toHaveLength(2);

      expect(commonParse.children[0]).toBeInstanceOf(ParseNode);
      expect(commonParse.children[0]).toEqual(parseOne);

      expect(commonParse.children[1]).toBeInstanceOf(ParseNode);
      expect(commonParse.children[1]).toEqual(parseTwo);
    });

    it('should push parse up from lowest level first to avoid conflicting common parse', () => {
      const source = new SourceNode(null);
      const parseOne = new ParseNode(source, {a: 'time'});
      const parseTwo = new ParseNode(source, {b: 'number'});
      const parseThree = new ParseNode(parseTwo, {a: 'number'});
      new OutputNode(parseOne, 'foo', null, {foo: 1});
      new OutputNode(parseThree, 'bar', null, {bar: 1});

      optimizeDataflow({sources: [source]} as any, null);

      expect(source.children).toHaveLength(1);
      expect(source.children[0]).toBeInstanceOf(ParseNode);

      const commonParse = source.children[0] as ParseNode;
      expect(commonParse.parse).toEqual({b: 'number'});

      expect(commonParse.children).toHaveLength(2);
      expect(commonParse.children[0]).toBeInstanceOf(ParseNode);
      expect(commonParse.children[1]).toBeInstanceOf(ParseNode);

      const p1 = commonParse.children[0] as ParseNode;
      const p2 = commonParse.children[1] as ParseNode;

      expect(p1.parse).toEqual({a: 'time'});
      expect(p2.parse).toEqual({a: 'number'});
    });
  });
});
