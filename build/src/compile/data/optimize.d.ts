import { DataFlowNode } from './dataflow';
import { DataComponent } from './index';
export declare const FACET_SCALE_PREFIX = "scale_";
/**
 * Inserts an Intermediate ParseNode containing all non-conflicting Parse fields and removes the empty ParseNodes
 */
export declare function mergeParse(node: DataFlowNode): void;
/**
 * Optimizes the dataflow of the passed in data component.
 */
export declare function optimizeDataflow(dataComponent: DataComponent): void;
