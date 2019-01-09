import { SignalRef } from 'vega';
import { Channel } from '../../channel';
import { VgRange, VgScale } from '../../vega.schema';
import { Model } from '../model';
import { SignalRefComponent } from '../signal';
export declare function assembleScales(model: Model): VgScale[];
export declare function assembleScalesForModel(model: Model): VgScale[];
export declare function assembleScaleRange(scaleRange: VgRange<SignalRefComponent>, scaleName: string, model: Model, channel: Channel): VgRange<SignalRef>;
