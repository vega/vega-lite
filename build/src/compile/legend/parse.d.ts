import { NonspatialScaleChannel } from '../../channel';
import { Model } from '../model';
import { UnitModel } from '../unit';
import { LegendComponent, LegendComponentIndex } from './component';
export declare function parseUnitLegend(model: UnitModel): LegendComponentIndex;
export declare function parseLegendForChannel(model: UnitModel, channel: NonspatialScaleChannel): LegendComponent;
export declare function parseNonUnitLegend(model: Model): void;
export declare function mergeLegendComponent(mergedLegend: LegendComponent, childLegend: LegendComponent): LegendComponent;
