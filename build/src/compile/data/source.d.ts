import { Data } from '../../data';
import { VgData } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
export declare class SourceNode extends DataFlowNode {
    private _data;
    private _name;
    constructor(data: Data);
    readonly data: Partial<VgData>;
    hasName(): boolean;
    dataName: string;
    parent: DataFlowNode;
    remove(): void;
    hash(): string | number;
    assemble(): VgData;
}
