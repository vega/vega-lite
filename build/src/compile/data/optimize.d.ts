import { DataComponent } from './index';
export declare const FACET_SCALE_PREFIX = "scale_";
export declare const MAX_OPTIMIZATION_RUNS = 5;
export declare function isTrue(x: boolean): boolean;
/**
 * Optimizes the dataflow of the passed in data component.
 */
export declare function optimizeDataflow(data: DataComponent): void;
