import { Scale } from '../../scale';
import { VgScale } from '../../vega.schema';
import { Model } from '../model';
export declare const NON_TYPE_DOMAIN_RANGE_VEGA_SCALE_PROPERTIES: (keyof (Scale | VgScale))[];
export declare function parseScale(model: Model): void;
export declare function parseScaleCore(model: Model): void;
