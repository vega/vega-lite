import {BinNode} from '../../../src/compile/data/bin';
import {checkLinks, debug, draw} from '../../../src/compile/data/debug';
import {SourceNode} from '../../../src/compile/data/source';
import {resetIdCounter} from '../../../src/util';
import {DataFlowNode} from './../../../src/compile/data/dataflow';

const dot = `digraph DataFlow {
  rankdir = TB;
  node [shape=record]
    "43" [
    label = <DataFlow>;
    tooltip = "[43]&#010;44"
  ]
  "45" [
    label = <DataFlow>;
    tooltip = "[45]&#010;46"
  ]

  "43" -> "45"
}`;
const dot2 = `digraph DataFlow {
  rankdir = TB;
  node [shape=record]
    "43" [
    label = <DataFlow<br/><i>foo</i>>;
    tooltip = "[43]&#010;44"
  ]
  "45" [
    label = <DataFlow<br/><i>bar</i>>;
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
    label = <DataFlow>;
    tooltip = "[43]&#010;44"
  ]
  "45" [
    label = <Bin<br/><font color="grey" point-size="10">IN:</font> foo<br/><font color="grey" point-size="10">OUT:</font> bar>;
    tooltip = "[45]&#010;Bin {foo:{as:[bar],bin:{},field:foo}}"
  ]

  "43" -> "45"
}`;

describe('compile/data/debug', () => {
  describe('draw', () => {
    it('should draw simple dataflow graph', () => {
      resetIdCounter();

      const root = new DataFlowNode(null);
      new DataFlowNode(root);
      expect(draw([root])).toBe(dot);
    });
    it('should print node debugName when defined', () => {
      resetIdCounter();

      const root = new DataFlowNode(null, 'foo');
      new DataFlowNode(root, 'bar');
      expect(draw([root])).toBe(dot2);
    });
    it('should print node.data.url when defined', () => {
      resetIdCounter();

      const root = new SourceNode({url: 'foo.bar'});
      expect(draw([root])).toBe(dot3);
    });
    it('should print dependent and produced field', () => {
      resetIdCounter();

      const root = new DataFlowNode(null);
      new BinNode(root, {foo: {field: 'foo', as: [['bar', 'bar_end']], bin: {}}});
      expect(draw([root])).toBe(dot4);
    });
  });
  describe('checkLinks', () => {
    it('should return false when given inconsistent data flow', () => {
      resetIdCounter();
      const root = new DataFlowNode(null);
      const node = new DataFlowNode(root);
      node.parent = null;
      expect(checkLinks([root])).toBe(false);
    });
    it('should return false with more complicated inconsistent data flow', () => {
      resetIdCounter();
      const root = new DataFlowNode(null);
      const node = new DataFlowNode(root);
      const node2 = new DataFlowNode(node);
      node2.parent = null;
      expect(checkLinks([root])).toBe(false);
    });
  });
  describe('debug', () => {
    it('should print simple dataflow graph', () => {
      resetIdCounter();
      const root = new DataFlowNode(null, 'foo');
      const node = new DataFlowNode(root, 'bar');
      console.log = jest.fn();
      debug(root);
      expect(console.log).toHaveBeenCalledWith('DataFlowNode(foo) -> DataFlowNode (bar)');
      expect(console.log).toHaveBeenCalledWith(root);
      expect(console.log).toHaveBeenCalledWith('DataFlowNode(bar) -> ');
      expect(console.log).toHaveBeenCalledWith(node);
    });
  });
});
