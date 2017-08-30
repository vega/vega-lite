import { NonspatialScaleChannel } from '../../channel';
import { Model } from '../model';
import { UnitModel } from '../unit';
import { LegendComponent } from './component';
export declare function parseLegend(model: Model): void;
export declare function parseLegendForChannel(model: UnitModel, channel: NonspatialScaleChannel): LegendComponent;
export declare function mergeLegendComponent(mergedLegend: LegendComponent, childLegend: LegendComponent): LegendComponent;
