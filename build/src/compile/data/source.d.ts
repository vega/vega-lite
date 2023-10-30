import { Data } from '../../data';
import { VgData } from '../../vega.schema';
import { DataFlowNode } from './dataflow';
export declare class SourceNode extends DataFlowNode {
    private _data;
    private _name;
    private _generator;
    constructor(data: Data);
    dependentFields(): Set<string>;
    producedFields(): undefined;
    get data(): Partial<VgData>;
    hasName(): boolean;
    get isGenerator(): boolean;
    get dataName(): string;
    set dataName(name: string);
    set parent(parent: DataFlowNode);
    remove(): void;
    hash(): string | number;
    assemble(): VgData;
}
//# sourceMappingURL=source.d.ts.map