import { Axis as VgAxis } from 'vega';
import { Config } from '../../config';
import { AxisComponent, AxisComponentIndex } from './component';
export declare function assembleAxis(axisCmpt: AxisComponent, kind: 'main' | 'grid', config: Config, opt?: {
    header: boolean;
}): VgAxis;
export declare function assembleAxes(axisComponents: AxisComponentIndex, config: Config): VgAxis[];
