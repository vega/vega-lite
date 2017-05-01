import { Bin } from '../../bin';
import { Dict } from '../../util';
import { VgTransform } from '../../vega.schema';
import { ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
export interface BinComponent {
    bin: Bin;
    field: string;
    extentSignal: string;
    signal: string;
    as: string[];
    formula?: string;
    formulaAs?: string;
}
export declare class BinNode extends DataFlowNode {
    private bins;
    clone(): BinNode;
    constructor(bins: Dict<BinComponent>);
    static make(model: ModelWithField): BinNode;
    merge(other: BinNode): void;
    producedFields(): {};
    dependentFields(): {};
    assemble(): VgTransform[];
}
