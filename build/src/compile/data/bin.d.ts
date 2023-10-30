import { Transforms as VgTransform } from 'vega';
import { BinParams } from '../../bin';
import { FieldName } from '../../channeldef';
import { BinTransform } from '../../transform';
import { Dict } from '../../util';
import { Model, ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
export declare function getBinSignalName(model: Model, field: string, bin: boolean | BinParams): string;
export interface BinComponent {
    bin: BinParams;
    field: FieldName;
    extentSignal?: string;
    signal?: string;
    span?: string;
    /** Pairs of strings of the names of start and end signals */
    as: [string, string][];
    formula?: string;
    formulaAs?: string;
}
export declare class BinNode extends DataFlowNode {
    private bins;
    clone(): BinNode;
    constructor(parent: DataFlowNode, bins: Dict<BinComponent>);
    static makeFromEncoding(parent: DataFlowNode, model: ModelWithField): BinNode;
    /**
     * Creates a bin node from BinTransform.
     * The optional parameter should provide
     */
    static makeFromTransform(parent: DataFlowNode, t: BinTransform, model: Model): BinNode;
    /**
     * Merge bin nodes. This method either integrates the bin config from the other node
     * or if this node already has a bin config, renames the corresponding signal in the model.
     */
    merge(other: BinNode, renameSignal: (s1: string, s2: string) => void): void;
    producedFields(): Set<string>;
    dependentFields(): Set<string>;
    hash(): string;
    assemble(): VgTransform[];
}
//# sourceMappingURL=bin.d.ts.map