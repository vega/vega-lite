import { VgSignal } from '../../vega.schema';
import { Model } from '../model';
export declare function assembleLayoutSignals(model: Model): VgSignal[];
export declare function sizeSignals(model: Model, sizeType: 'width' | 'height'): VgSignal[];
