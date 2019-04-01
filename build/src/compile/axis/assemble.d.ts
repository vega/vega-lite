import { Axis as VgAxis, NewSignal } from 'vega';
import { Config } from '../../config';
import { Model } from '../model';
import { AxisComponent, AxisComponentIndex } from './component';
export declare function assembleAxis(axisCmpt: AxisComponent, kind: 'main' | 'grid', config: Config, opt?: {
    header: boolean;
}): VgAxis;
/**
 * Add axis signals so grid line works correctly
 * (Fix https://github.com/vega/vega-lite/issues/4226)
 */
export declare function assembleAxisSignals(model: Model): NewSignal[];
export declare function assembleAxes(axisComponents: AxisComponentIndex, config: Config): VgAxis[];
//# sourceMappingURL=assemble.d.ts.map