import { TimeUnit } from '../../timeunit';
import { Dict } from '../../util';
import { VgFormulaTransform } from '../../vega.schema';
import { Model } from '../model';
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
    static make(model: Model): TimeUnitNode;
    merge(other: TimeUnitNode): void;
    producedFields(): {};
    dependentFields(): {};
    assemble(): VgFormulaTransform[];
}
