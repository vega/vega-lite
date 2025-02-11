import {Legend as VgLegend} from 'vega';
import {NonPositionScaleChannel} from '../../channel.js';
import {COMMON_LEGEND_PROPERTY_INDEX, LegendInternal} from '../../legend.js';
import {Flag, keys} from '../../util.js';
import {Split} from '../split.js';

export type LegendComponentProps = VgLegend & {
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
  encode: 1,
};

export const LEGEND_COMPONENT_PROPERTIES = keys(LEGEND_COMPONENT_PROPERTY_INDEX);

export class LegendComponent extends Split<LegendComponentProps> {}

export type LegendComponentIndex = Partial<Record<NonPositionScaleChannel, LegendComponent>>;

export type LegendInternalIndex = Partial<Record<NonPositionScaleChannel, LegendInternal>>;
