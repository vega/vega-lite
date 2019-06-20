import { Axis, AxisPart } from '../../axis';
import { FieldDefBase } from '../../fielddef';
import { Omit } from '../../util';
import { VgAxis } from '../../vega.schema';
import { Split } from '../split';
export declare type AxisComponentProps = Omit<VgAxis, 'title'> & {
    title: string | FieldDefBase<string>[];
};
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
