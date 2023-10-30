import type { SignalRef } from 'vega';
import { Config } from '../config';
import { LayoutSizeMixins, NormalizedSpec, TopLevelSpec } from '../spec';
import { AutoSizeParams, AutosizeType, TopLevel } from '../spec/toplevel';
import { NormalizerParams } from './base';
export declare function normalize(spec: TopLevelSpec & LayoutSizeMixins, config?: Config<SignalRef>): TopLevel<NormalizedSpec> & LayoutSizeMixins;
/**
 * Normalize autosize and deal with width or height == "container".
 */
export declare function normalizeAutoSize(spec: TopLevel<NormalizedSpec>, sizeInfo: {
    autosize: AutosizeType | AutoSizeParams;
} & LayoutSizeMixins, config?: Config): AutoSizeParams;
export type { NormalizerParams };
//# sourceMappingURL=index.d.ts.map