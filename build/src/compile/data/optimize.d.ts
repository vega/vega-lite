import { DataComponent } from '.';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare const FACET_SCALE_PREFIX = "scale_";
export declare const MAX_OPTIMIZATION_RUNS = 5;
/**
 * Iterates over a dataflow graph and checks whether all links are consistent.
 */
export declare function checkLinks(nodes: readonly DataFlowNode[]): boolean;
/**
 * Optimizes the dataflow of the passed in data component.
 */
export declare function optimizeDataflow(data: DataComponent, model: Model): void;
//# sourceMappingURL=optimize.d.ts.map