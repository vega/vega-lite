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
    constructor(bins: Dict<BinComponent>);
    static makeBinFromEncoding(model: ModelWithField): BinNode;
    /**
     * Creates a bin node from BinTransform.
     * The optional parameter should provide
     */
    static makeFromTransform(t: BinTransform, params: {
        model: Model;
    } | {
        signal?: string;
        extentSignal?: string;
    }): BinNode;
    merge(other: BinNode): void;
    producedFields(): {};
    dependentFields(): {};
    assemble(): VgTransform[];
}
