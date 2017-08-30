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
    constructor(formula: Dict<TimeUnitComponent>);
    static makeFromEncoding(model: ModelWithField): TimeUnitNode;
    static makeFromTransform(t: TimeUnitTransform): TimeUnitNode;
    merge(other: TimeUnitNode): void;
    producedFields(): {};
    dependentFields(): {};
    assemble(): VgFormulaTransform[];
}
