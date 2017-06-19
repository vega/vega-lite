import { Channel, NonspatialScaleChannel } from '../../channel';
import { Model } from '../model';
import { UnitModel } from '../unit';
import { LegendComponent, LegendComponentIndex } from './component';
export declare function parseLegendComponent(model: UnitModel): LegendComponentIndex;
export declare function parseLegend(model: UnitModel, channel: NonspatialScaleChannel): LegendComponent;
/**
 * Move legend from child up.
 */
export declare function moveSharedLegendUp(legendComponent: LegendComponent, child: Model, channel: Channel): void;
