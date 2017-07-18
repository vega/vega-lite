import { VgSignal } from '../../vega.schema';
import { Model } from '../model';
export declare function assembleLayoutSignals(model: Model): VgSignal[];
export declare function sizeExpr(model: Model, sizeType: 'width' | 'height'): string;
