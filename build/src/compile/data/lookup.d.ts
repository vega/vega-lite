import { LookupTransform } from '../../transform';
import { VgLookupTransform } from '../../vega.schema';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare class LookupNode extends DataFlowNode {
    readonly transform: LookupTransform;
    readonly secondary: string;
    clone(): LookupNode;
    constructor(parent: DataFlowNode, transform: LookupTransform, secondary: string);
    static make(parent: DataFlowNode, model: Model, transform: LookupTransform, counter: number): LookupNode;
    producedFields(): Set<string>;
    hash(): string;
    assemble(): VgLookupTransform;
}
