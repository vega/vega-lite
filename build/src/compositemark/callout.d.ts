import { Config } from '../config';
import { Encoding } from '../encoding';
import { MarkConfig } from '../mark';
import { GenericUnitSpec, NormalizedLayerSpec } from '../spec';
import { GenericCompositeMarkDef } from './common';
import { CompositeMarkDef } from './index';
export declare const CALLOUT: 'callout';
export declare type Callout = typeof CALLOUT;
export declare type CalloutPart = 'line' | 'label';
export declare const CALLOUT_PARTS: CalloutPart[];
export declare type CalloutPartsMinxins = {
    [part in CalloutPart]?: MarkConfig;
};
export interface CalloutConfig extends CalloutPartsMinxins {
    /**
     * Angle of callout line.
     * __Default value:__ `45`
     */
    angle?: number;
    /**
     * Offset distance between the data point and the callout line.
     * __Default value:__ `0`
     */
    lineOffset?: number;
    /**
     * Length of callout line.
     * __Default value:__ `30`
     */
    lineLength?: number;
    /**
     * Offset distance between callout line and label
     * __Default value:__ `2`
     */
    labelOffset?: number;
}
export declare const DEFAULT_CALLOUT_CONFIG: CalloutConfig;
export interface CalloutDef extends GenericCompositeMarkDef<Callout>, CalloutConfig {
}
export declare function isCalloutDef(markDef: CompositeMarkDef): markDef is CalloutDef;
export interface CalloutConfigMixins {
    /**
     * Callout Rule Config
     */
    callout?: CalloutConfig;
}
export declare function normalizeCallout(spec: GenericUnitSpec<Encoding<string>, Callout | CalloutDef>, config: Config): NormalizedLayerSpec;
