import { GraticuleTransform as VgGraticuleTransform } from 'vega';
import { GraticuleParams } from '../../data';
import { DataFlowNode } from './dataflow';
export declare class GraticuleNode extends DataFlowNode {
    private params;
    clone(): GraticuleNode;
    constructor(parent: DataFlowNode, params: true | GraticuleParams);
    dependentFields(): Set<string>;
    producedFields(): undefined;
    hash(): string;
    assemble(): VgGraticuleTransform;
}
//# sourceMappingURL=graticule.d.ts.map