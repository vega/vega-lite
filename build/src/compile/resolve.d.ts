import { ScaleChannel } from '../channel';
import { ResolveMapping, ResolveMode } from '../resolve';
import { Model } from './model';
export declare function defaultScaleResolve(channel: ScaleChannel, model: Model): ResolveMode;
export declare function parseGuideResolve(resolve: ResolveMapping, channel: ScaleChannel): ResolveMode;
