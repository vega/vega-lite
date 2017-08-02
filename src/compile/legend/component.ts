import {Legend} from '../..//legend';
import {NonspatialScaleChannel} from '../../channel';
import {VgLegend} from '../../vega.schema';
import {Split} from '../split';


export class LegendComponent extends Split<Partial<VgLegend>> {}

// Using Mapped Type to declare type (https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types)
export type LegendComponentIndex = {[P in NonspatialScaleChannel]?: LegendComponent};

export type LegendIndex = {[P in NonspatialScaleChannel]?: Legend};
