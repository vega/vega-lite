import { Channel } from '../../channel';
import { UnitModel } from '../unit';
import { Model } from '../model';
import { LegendComponent, LegendComponentIndex } from './component';
export declare function parseLegendComponent(model: UnitModel): LegendComponentIndex;
export declare function parseLegend(model: UnitModel, channel: Channel): LegendComponent;
/**
 * Move legend from child up.
 */
export declare function moveSharedLegendUp(legendComponent: LegendComponent, child: Model, channel: Channel): void;
