import {draw} from '../../../src/compile/data/debug';
import {DataFlowNode} from './../../../src/compile/data/dataflow';

describe('compile/data/debug', () => {
  describe('draw', () => {
    it('should draw simple dataflow graph', () => {
      const node = new DataFlowNode(null);
      expect(draw([node])).toBeTruthy();
    });
  });
});
