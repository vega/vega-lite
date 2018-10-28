import { draw } from '../../../src/compile/data/debug';
import { resetIdCounter } from '../../../src/util';
import { DataFlowNode } from './../../../src/compile/data/dataflow';
var dot = "digraph DataFlow {\n  rankdir = TB;\n  node [shape=record]\n    \"43\" [\n    label = <DataFlow>;\n    tooltip = \"[43]&#010;44\"\n  ]\n  \"45\" [\n    label = <DataFlow>;\n    tooltip = \"[45]&#010;46\"\n  ]\n\n  \"43\" -> \"45\"\n}";
describe('compile/data/debug', function () {
    describe('draw', function () {
        it('should draw simple dataflow graph', function () {
            resetIdCounter();
            var root = new DataFlowNode(null);
            // @ts-ignore
            var node = new DataFlowNode(root);
            expect(draw([root])).toBe(dot);
        });
    });
});
//# sourceMappingURL=debug.test.js.map