import { VgData } from '../../vega.schema';
import { Model } from './../model';
import { DataFlowNode } from './dataflow';
export declare class SourceNode extends DataFlowNode {
    private _data;
    private _name;
    constructor(model: Model);
    readonly data: Partial<VgData>;
    hasName(): boolean;
    dataName: string;
    parent: DataFlowNode;
    remove(): void;
    /**
     * Return a unique identifir for this data source.
     */
    hash(): string;
    assemble(): VgData;
}
