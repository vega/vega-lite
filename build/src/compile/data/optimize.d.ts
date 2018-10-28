import { DataFlowNode } from './dataflow';
import { DataComponent } from './index';
import { BottomUpOptimizer } from './optimizer';
import * as optimizers from './optimizers';
export declare const FACET_SCALE_PREFIX = "scale_";
export declare const MAX_OPTIMIZATION_RUNS = 5;
/**
 * Inserts an Intermediate ParseNode containing all non-conflicting Parse fields and removes the empty ParseNodes
 */
export declare class MergeParse extends BottomUpOptimizer {
    run(node: DataFlowNode): optimizers.OptimizerFlags;
}
export declare function isTrue(x: boolean): boolean;
/**
 * Optimizes the dataflow of the passed in data component.
 */
export declare function optimizeDataflow(data: DataComponent): void;
