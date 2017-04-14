import { Channel } from '../../channel';
import { Dict } from '../../util';
import { VgLegend } from '../../vega.schema';
import { UnitModel } from '../unit';
export declare function parseLegendComponent(model: UnitModel): Dict<VgLegend>;
export declare function parseLegend(model: UnitModel, channel: Channel): VgLegend;
