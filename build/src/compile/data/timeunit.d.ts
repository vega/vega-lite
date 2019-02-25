import { TimeUnit } from '../../timeunit';
import { TimeUnitTransform } from '../../transform';
import { Dict } from '../../util';
import { VgFormulaTransform } from '../../vega.schema';
import { ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
export interface TimeUnitComponent {
    as: string;
    timeUnit: TimeUnit;
    field: string;
}
export declare class TimeUnitNode extends DataFlowNode {
    private formula;
    clone(): TimeUnitNode;
    constructor(parent: DataFlowNode, formula: Dict<TimeUnitComponent>);
    static makeFromEncoding(parent: DataFlowNode, model: ModelWithField): TimeUnitNode;
    static makeFromTransform(parent: DataFlowNode, t: TimeUnitTransform): TimeUnitNode;
    merge(other: TimeUnitNode): void;
    producedFields(): Set<string>;
    dependentFields(): Set<string>;
    hash(): string;
    assemble(): VgFormulaTransform[];
}
