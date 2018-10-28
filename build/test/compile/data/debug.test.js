import { draw } from '../../../src/compile/data/debug';
import { DataFlowNode } from './../../../src/compile/data/dataflow';
describe('compile/data/debug', function () {
    describe('draw', function () {
        it('should draw simple dataflow graph', function () {
            var node = new DataFlowNode(null);
            expect(draw([node])).toBeTruthy();
        });
    });
});
//# sourceMappingURL=debug.test.js.map