import {Legend} from '../..//legend';
import {NonPositionScaleChannel} from '../../channel';
import {VgLegend} from '../../vega.schema';
import {Split} from '../split';


export class LegendComponent extends Split<VgLegend> {}

// Using Mapped Type to declare type (https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types)
export type LegendComponentIndex = {[P in NonPositionScaleChannel]?: LegendComponent};

export type LegendIndex = {[P in NonPositionScaleChannel]?: Legend};
