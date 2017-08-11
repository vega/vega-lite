import { VgSignal } from '../../vega.schema';
import { Model } from '../model';
import { ScaleComponent } from '../scale/component';
export declare function assembleLayoutSignals(model: Model): VgSignal[];
export declare function sizeSignals(model: Model, sizeType: 'width' | 'height'): VgSignal[];
export declare function sizeExpr(scaleName: string, scaleComponent: ScaleComponent, cardinality: string): string;
