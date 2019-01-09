import {Legend as VgLegend} from 'vega';
import {NonPositionScaleChannel} from '../../channel';
import {Legend} from '../../legend';
import {Split} from '../split';

export class LegendComponent extends Split<VgLegend> {}

export type LegendComponentIndex = {[P in NonPositionScaleChannel]?: LegendComponent};

export type LegendIndex = {[P in NonPositionScaleChannel]?: Legend};
