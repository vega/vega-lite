import { BinParams } from '../../bin';
import { BinTransform } from '../../transform';
import { Dict } from '../../util';
import { VgTransform } from '../../vega.schema';
import { Model, ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
export interface BinComponent {
    bin: BinParams;
    field: string;
    extentSignal?: string;
    signal?: string;
    as: string[];
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
    merge(other: BinNode): void;
    producedFields(): Set<string>;
    dependentFields(): Set<string>;
    hash(): string;
    assemble(): VgTransform[];
}
