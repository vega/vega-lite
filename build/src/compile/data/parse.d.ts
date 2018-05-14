import { Model } from '../model';
import { DataFlowNode } from './dataflow';
import { AncestorParse, DataComponent } from './index';
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export declare function parseTransformArray(head: DataFlowNode, model: Model, ancestorParse: AncestorParse): DataFlowNode;
export declare function parseData(model: Model): DataComponent;
