import { TimeUnitTransform as VgTimeUnitTransform } from 'vega';
import { FormulaTransform as VgFormulaTransform } from 'vega';
import { FieldName } from '../../channeldef';
import { TimeUnitParams } from '../../timeunit';
import { TimeUnitTransform } from '../../transform';
import { Dict } from '../../util';
import { ModelWithField } from '../model';
import { DataFlowNode } from './dataflow';
export type TimeUnitComponent = (TimeUnitTransform | BinnedTimeUnitOffset) & {
    rectBandPosition?: number;
};
export interface BinnedTimeUnitOffset {
    timeUnit: TimeUnitParams;
    field: FieldName;
}
export declare class TimeUnitNode extends DataFlowNode {
    private timeUnits;
    clone(): TimeUnitNode;
    constructor(parent: DataFlowNode, timeUnits: Dict<TimeUnitComponent>);
    static makeFromEncoding(parent: DataFlowNode, model: ModelWithField): TimeUnitNode;
    static makeFromTransform(parent: DataFlowNode, t: TimeUnitTransform): TimeUnitNode;
    /**
     * Merge together TimeUnitNodes assigning the children of `other` to `this`
     * and removing `other`.
     */
    merge(other: TimeUnitNode): void;
    /**
     * Remove time units coming from the other node.
     */
    removeFormulas(fields: Set<string>): void;
    producedFields(): Set<string>;
    dependentFields(): Set<string>;
    hash(): string;
    assemble(): (VgFormulaTransform | VgTimeUnitTransform)[];
}
export declare const OFFSETTED_RECT_START_SUFFIX = "offsetted_rect_start";
export declare const OFFSETTED_RECT_END_SUFFIX = "offsetted_rect_end";
//# sourceMappingURL=timeunit.d.ts.map