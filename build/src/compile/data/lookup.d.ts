import { LookupTransform as VgLookupTransform } from 'vega';
import { LookupTransform } from '../../transform';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare class LookupNode extends DataFlowNode {
    readonly transform: LookupTransform;
    readonly secondary: string;
    clone(): LookupNode;
    constructor(parent: DataFlowNode, transform: LookupTransform, secondary: string);
    static make(parent: DataFlowNode, model: Model, transform: LookupTransform, counter: number): LookupNode;
    dependentFields(): Set<string>;
    producedFields(): Set<string>;
    hash(): string;
    assemble(): VgLookupTransform;
}
//# sourceMappingURL=lookup.d.ts.map