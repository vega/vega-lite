import {BinNode} from '../../../src/compile/data/bin.js';
import {dotString, printDebugDataflow} from '../../../src/compile/data/debug.js';
import {checkLinks} from '../../../src/compile/data/optimize.js';
import {SourceNode} from '../../../src/compile/data/source.js';
import {resetIdCounter} from '../../../src/util.js';
import {PlaceholderDataFlowNode} from './util.js';
import {vi} from 'vitest';

const dot = `digraph DataFlow {
  rankdir = TB;
  node [shape=record]
    "43" [
    label = <PlaceholderDataFlow>;
    tooltip = "[43]&#010;44"
  ]
  "45" [
    label = <PlaceholderDataFlow>;
    tooltip = "[45]&#010;46"
  ]

  "43" -> "45"
}`;
const dot2 = `digraph DataFlow {
  rankdir = TB;
  node [shape=record]
    "43" [
    label = <PlaceholderDataFlow<br/><i>foo</i>>;
    tooltip = "[43]&#010;44"
  ]
  "45" [
    label = <PlaceholderDataFlow<br/><i>bar</i>>;
    tooltip = "[45]&#010;46"
  ]

  "43" -> "45"
}`;

const dot3 = `digraph DataFlow {
  rankdir = TB;
  node [shape=record]
    "43" [
    label = <Source<br/><i>foo.bar</i>>;
    tooltip = "[43]&#010;foo.bar"
  ]\n\n  \n}`;

const dot4 = `digraph DataFlow {
  rankdir = TB;
  node [shape=record]
    "43" [
    label = <PlaceholderDataFlow>;
    tooltip = "[43]&#010;44"
  ]
  "45" [
    label = <Bin<br/><font color="grey" point-size="10">IN:</font> foo<br/><font color="grey" point-size="10">OUT:</font> bar, bar_end>;
    tooltip = "[45]&#010;Bin {foo:{as:[[bar,bar_end]],bin:{},field:foo}}"
  ]

  "43" -> "45"
}`;

describe('compile/data/debug', () => {
  describe('draw', () => {
    it('should draw simple dataflow graph', () => {
      resetIdCounter();

      const root = new PlaceholderDataFlowNode(null);
      new PlaceholderDataFlowNode(root);
      expect(dotString([root])).toBe(dot);
    });
    it('should print node debugName when defined', () => {
      resetIdCounter();

      const root = new PlaceholderDataFlowNode(null, 'foo');
      new PlaceholderDataFlowNode(root, 'bar');
      expect(dotString([root])).toBe(dot2);
    });
    it('should print node.data.url when defined', () => {
      resetIdCounter();

      const root = new SourceNode({url: 'foo.bar'});
      expect(dotString([root])).toBe(dot3);
    });
    it('should print dependent and produced field', () => {
      resetIdCounter();

      const root = new PlaceholderDataFlowNode(null);
      new BinNode(root, {foo: {field: 'foo', as: [['bar', 'bar_end']], bin: {}}});
      expect(dotString([root])).toBe(dot4);
    });
  });
  describe('checkLinks', () => {
    it('should return false when given inconsistent data flow', () => {
      resetIdCounter();
      const root = new PlaceholderDataFlowNode(null);
      const node = new PlaceholderDataFlowNode(root);
      node.parent = null;
      expect(checkLinks([root])).toBe(false);
    });
    it('should return false with more complicated inconsistent data flow', () => {
      resetIdCounter();
      const root = new PlaceholderDataFlowNode(null);
      const node = new PlaceholderDataFlowNode(root);
      const node2 = new PlaceholderDataFlowNode(node);
      node2.parent = null;
      expect(checkLinks([root])).toBe(false);
    });
  });
  describe('debug', () => {
    it('should print simple dataflow graph', () => {
      resetIdCounter();
      const root = new PlaceholderDataFlowNode(null, 'foo');
      const node = new PlaceholderDataFlowNode(root, 'bar');

      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      printDebugDataflow(root);
      expect(consoleMock).toHaveBeenCalledWith('PlaceholderDataFlowNode(foo) -> PlaceholderDataFlowNode (bar)');
      expect(consoleMock).toHaveBeenCalledWith(root);
      expect(consoleMock).toHaveBeenCalledWith('PlaceholderDataFlowNode(bar) -> ');
      expect(consoleMock).toHaveBeenCalledWith(node);
    });
  });
});
