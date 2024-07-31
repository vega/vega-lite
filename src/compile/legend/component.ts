import {Legend as VgLegend, LegendType} from 'vega';
import {NonPositionScaleChannel} from '../../channel';
import {COMMON_LEGEND_PROPERTY_INDEX, LegendInternal} from '../../legend';
import {Flag, keys} from '../../util';
import {Split} from '../split';

/** Update LegendType to support a third value (discrete), which is needed for discrete gradient legends
 * https://github.com/vega/vega/blob/main/packages/vega-parser/src/parsers/legend.js */
export type FullLegendType = LegendType | 'discrete';

/** Update LegendType to support a third value (discrete), which is needed for discrete gradient legends
 * https://github.com/vega/vega/blob/main/packages/vega-parser/src/parsers/legend.js */
export type FullVgLegend = Omit<VgLegend, 'type'> & {
  /**
   * The type of legend to include. One of `"symbol"` for discrete symbol legends, `"gradient"` for a continuous color gradient, or `"discrete"` for a discrete color gradient.
   * If gradient is used only the fill, stroke, and length scale parameters are considered. If unspecified, the type will be inferred based on the scale parameters used and their backing scale types.
   * TODO: Remove FullLegendType override after base type in VgLegend is updated */
  type?: FullLegendType;
};

export type LegendComponentProps = FullVgLegend & {
  labelExpr?: string;
  selections?: string[];
  disable?: boolean;
};

const LEGEND_COMPONENT_PROPERTY_INDEX: Flag<keyof LegendComponentProps> = {
  ...COMMON_LEGEND_PROPERTY_INDEX,
  disable: 1,
  labelExpr: 1,
  selections: 1,
  // channel scales
  opacity: 1,
  shape: 1,
  stroke: 1,
  fill: 1,
  size: 1,
  strokeWidth: 1,
  strokeDash: 1,
  // encode
  encode: 1
};

export const LEGEND_COMPONENT_PROPERTIES = keys(LEGEND_COMPONENT_PROPERTY_INDEX);

export class LegendComponent extends Split<LegendComponentProps> { }

export type LegendComponentIndex = Partial<Record<NonPositionScaleChannel, LegendComponent>>;

export type LegendInternalIndex = Partial<Record<NonPositionScaleChannel, LegendInternal>>;
