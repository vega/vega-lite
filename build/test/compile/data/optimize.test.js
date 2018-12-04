/* tslint:disable:quotemark */
import { assert } from 'chai';
import { DataFlowNode, OutputNode } from '../../../src/compile/data/dataflow';
import { ParseNode } from '../../../src/compile/data/formatparse';
import { optimizeDataflow } from '../../../src/compile/data/optimize';
import { MergeParse } from '../../../src/compile/data/optimizers';
import { SourceNode } from '../../../src/compile/data/source';
describe('compile/data/optimize', function () {
    describe('mergeParse', function () {
        it('should merge non-conflicting ParseNodes', function () {
            var root = new DataFlowNode(null, 'root');
            // ts-ignore is used to suppress the noUnusedLocals error
            // @ts-ignore
            var parse1 = new ParseNode(root, { a: 'number', b: 'string' });
            // @ts-ignore
            var parse2 = new ParseNode(root, { b: 'string', c: 'boolean' });
            var optimizer = new MergeParse();
            optimizer.run(parse1);
            assert.deepEqual(root.children.length, 1);
            var mergedParseNode = root.children[0];
            assert.deepEqual(mergedParseNode.parse, { a: 'number', b: 'string', c: 'boolean' });
        });
        it('should not merge conflicting ParseNodes', function () {
            var root = new DataFlowNode(null, 'root');
            // @ts-ignore
            var parse1 = new ParseNode(root, { a: 'number', b: 'string' });
            // @ts-ignore
            var parse2 = new ParseNode(root, { a: 'boolean', d: 'date' });
            var optimizer = new MergeParse();
            optimizer.run(parse1);
            assert.deepEqual(root.children.length, 1);
            var mergedParseNode = root.children[0];
            assert.deepEqual(mergedParseNode.parse, { b: 'string', d: 'date' });
            var children = mergedParseNode.children;
            assert.deepEqual(children[0].parse, { a: 'number' });
            assert.deepEqual(children[1].parse, { a: 'boolean' });
        });
    });
    describe('optimizeDataFlow', function () {
        it('should move up common parse', function () {
            var source = new SourceNode(null);
            var parseOne = new ParseNode(source, { a: 'time', b: 'number' });
            var parseTwo = new ParseNode(source, { a: 'time', b: 'date' });
            // @ts-ignore
            var outputOne = new OutputNode(parseOne, 'foo', null, { foo: 1 });
            // @ts-ignore
            var outputTwo = new OutputNode(parseTwo, 'bar', null, { bar: 1 });
            optimizeDataflow({ sources: [source] });
            expect(source.children.length).toEqual(1);
            expect(source.children[0]).toBeInstanceOf(ParseNode);
            var commonParse = source.children[0];
            expect(commonParse.parse).toEqual({ a: 'time' });
            expect(commonParse.children.length).toEqual(2);
            expect(commonParse.children[0]).toBeInstanceOf(ParseNode);
            expect(commonParse.children[0]).toMatchObject(parseOne);
            expect(commonParse.children[1]).toBeInstanceOf(ParseNode);
            expect(commonParse.children[1]).toMatchObject(parseTwo);
        });
        it('should push parse up from lowest level first to avoid conflicting common parse', function () {
            var source = new SourceNode(null);
            var parseOne = new ParseNode(source, { a: 'time' });
            var parseTwo = new ParseNode(source, { b: 'number' });
            var parseThree = new ParseNode(parseTwo, { a: 'number' });
            // @ts-ignore
            var outputOne = new OutputNode(parseOne, 'foo', null, { foo: 1 });
            // @ts-ignore
            var outputTwo = new OutputNode(parseThree, 'bar', null, { bar: 1 });
            optimizeDataflow({ sources: [source] });
            expect(source.children.length).toEqual(1);
            expect(source.children[0]).toBeInstanceOf(ParseNode);
            var commonParse = source.children[0];
            expect(commonParse.parse).toEqual({ b: 'number' });
            expect(commonParse.children.length).toEqual(2);
            expect(commonParse.children[0]).toBeInstanceOf(ParseNode);
            expect(commonParse.children[1]).toBeInstanceOf(ParseNode);
            var p1 = commonParse.children[0];
            var p2 = commonParse.children[1];
            expect(p1.parse).toEqual({ a: 'time' });
            expect(p2.parse).toEqual({ a: 'number' });
        });
    });
});
//# sourceMappingURL=optimize.test.js.map