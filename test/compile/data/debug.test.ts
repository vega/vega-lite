import {checkLinks, draw, debug} from '../../../src/compile/data/debug';
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

describe('compile/data/debug', () => {
  describe('draw', () => {
    it('should draw simple dataflow graph', () => {
      resetIdCounter();

      const root = new DataFlowNode(null);
      // @ts-ignore
      const node = new DataFlowNode(root);
      expect(draw([root])).toBe(dot);
    });
    it('should print node debugName when defined', () => {
      resetIdCounter();
      const root = new DataFlowNode(null, 'foo');
      // @ts-ignore
      const node = new DataFlowNode(root, 'bar');
      expect(draw([root])).toBe(dot2);
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
