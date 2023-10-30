import { RegressionTransform as VgRegressionTransform } from 'vega';
import { RegressionTransform } from '../../transform';
import { DataFlowNode } from './dataflow';
/**
 * A class for regression transform nodes
 */
export declare class RegressionTransformNode extends DataFlowNode {
    private transform;
    clone(): RegressionTransformNode;
    constructor(parent: DataFlowNode, transform: RegressionTransform);
    dependentFields(): Set<string>;
    producedFields(): Set<string>;
    hash(): string;
    assemble(): VgRegressionTransform;
}
//# sourceMappingURL=regression.d.ts.map