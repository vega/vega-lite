import { Channel } from '../../channel';
import { UnitModel } from '../unit';
import { LegendComponent, LegendComponentIndex } from './component';
export declare function parseLegendComponent(model: UnitModel): LegendComponentIndex;
export declare function parseLegend(model: UnitModel, channel: Channel): LegendComponent;
