import { Axis as VgAxis } from 'vega';
import { Axis, AxisPart } from '../../axis';
import { FieldDefBase } from '../../fielddef';
import { Omit } from '../../util';
import { Split } from '../split';
export interface AxisComponentProps extends Omit<VgAxis, 'title'> {
    title: string | FieldDefBase<string>[];
}
export declare class AxisComponent extends Split<AxisComponentProps> {
    readonly explicit: Partial<AxisComponentProps>;
    readonly implicit: Partial<AxisComponentProps>;
    mainExtracted: boolean;
    constructor(explicit?: Partial<AxisComponentProps>, implicit?: Partial<AxisComponentProps>, mainExtracted?: boolean);
    clone(): AxisComponent;
    hasAxisPart(part: AxisPart): boolean;
}
export interface AxisComponentIndex {
    x?: AxisComponent[];
    y?: AxisComponent[];
}
export interface AxisIndex {
    x?: Axis;
    y?: Axis;
}
