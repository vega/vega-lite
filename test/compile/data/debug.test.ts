import {draw} from '../../../src/compile/data/debug';
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

describe('compile/data/debug', () => {
  describe('draw', () => {
    it('should draw simple dataflow graph', () => {
      resetIdCounter();

      const root = new DataFlowNode(null);
      // @ts-ignore
      const node = new DataFlowNode(root);
      expect(draw([root])).toBe(dot);
    });
  });
});
