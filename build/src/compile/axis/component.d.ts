import { Axis } from '../../axis';
import { VgAxis } from '../../vega.schema';
import { Split } from '../split';
export declare class AxisComponentPart extends Split<Partial<VgAxis>> {
}
export interface AxisComponent {
    main?: AxisComponentPart;
    grid?: AxisComponentPart;
}
export interface AxisComponentIndex {
    x?: AxisComponent[];
    y?: AxisComponent[];
}
export interface AxisIndex {
    x?: Axis;
    y?: Axis;
}
