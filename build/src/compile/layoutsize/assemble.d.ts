import { InitSignal, NewSignal } from 'vega';
import { Model } from '../model';
import { ScaleComponent } from '../scale/component';
import { LayoutSizeType } from './component';
export declare function assembleLayoutSignals(model: Model): NewSignal[];
export declare function sizeSignals(model: Model, sizeType: LayoutSizeType): (NewSignal | InitSignal)[];
export declare function sizeExpr(scaleName: string, scaleComponent: ScaleComponent, cardinality: string): string;
//# sourceMappingURL=assemble.d.ts.map