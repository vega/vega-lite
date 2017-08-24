import { Model } from '../model';
import { DataFlowNode } from './dataflow';
import { DataComponent } from './index';
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export declare function parseTransformArray(model: Model): {
    first: DataFlowNode;
    last: DataFlowNode;
};
export declare function parseData(model: Model): DataComponent;
