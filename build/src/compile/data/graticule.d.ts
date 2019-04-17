import { GraticuleParams } from '../../data';
import { VgGraticuleTransform } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
export declare class GraticuleNode extends DataFlowNode {
    private params;
    clone(): GraticuleNode;
    constructor(parent: DataFlowNode, params: true | GraticuleParams);
    assemble(): VgGraticuleTransform;
}
//# sourceMappingURL=graticule.d.ts.map