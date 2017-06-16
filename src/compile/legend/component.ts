import {Legend} from '../..//legend';
import {NonspatialScaleChannel} from '../../channel';
import {VgLegend} from '../../vega.schema';


export type LegendComponent = VgLegend;

export type LegendComponentIndex = {[P in NonspatialScaleChannel]?: LegendComponent};

export type LegendIndex = {[P in NonspatialScaleChannel]?: Legend};
