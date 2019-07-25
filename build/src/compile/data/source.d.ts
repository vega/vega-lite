import { Data } from '../../data';
import { VgData } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
export declare class SourceNode extends DataFlowNode {
    private _data;
    private _name;
    private _generator;
    constructor(data: Data);
    readonly data: Partial<VgData>;
    hasName(): boolean;
    readonly isGenerator: boolean;
    dataName: string;
    parent: DataFlowNode;
    remove(): void;
    hash(): string | number;
    assemble(): VgData;
}
//# sourceMappingURL=source.d.ts.map