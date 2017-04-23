import {VgAxis} from '../../vega.schema';
export interface AxisComponent {
  axes: VgAxis[];
  gridAxes: VgAxis[];
}

export interface AxesComponent {
  x?: AxisComponent;
  y?: AxisComponent;
}
