import { VgAxis } from '../../vega.schema';
export interface AxisComponent {
    axes: VgAxis[];
    gridAxes: VgAxis[];
}
export interface AxisComponentIndex {
    x?: AxisComponent;
    y?: AxisComponent;
}
