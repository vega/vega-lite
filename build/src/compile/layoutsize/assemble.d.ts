import { NewSignal } from 'vega';
import { Model } from '../model';
import { ScaleComponent } from '../scale/component';
export declare function assembleLayoutSignals(model: Model): NewSignal[];
export declare function sizeSignals(model: Model, sizeType: 'width' | 'height'): NewSignal[];
export declare function sizeExpr(scaleName: string, scaleComponent: ScaleComponent, cardinality: string): string;
