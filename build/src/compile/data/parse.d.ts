import { AncestorParse, DataComponent } from '.';
import { Data } from '../../data';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
import { SourceNode } from './source';
export declare function findSource(data: Data, sources: SourceNode[]): SourceNode;
/**
 * Parses a transform array into a chain of connected dataflow nodes.
 */
export declare function parseTransformArray(head: DataFlowNode, model: Model, ancestorParse: AncestorParse): DataFlowNode;
export declare function parseData(model: Model): DataComponent;
//# sourceMappingURL=parse.d.ts.map