import { NonPositionScaleChannel } from '../../channel';
import { Model } from '../model';
import { UnitModel } from '../unit';
import { LegendComponent } from './component';
export declare function parseLegend(model: Model): Partial<Record<"fill" | "stroke" | "angle" | "color" | "fillOpacity" | "opacity" | "strokeOpacity" | "strokeWidth" | "size" | "strokeDash" | "shape", LegendComponent>>;
export declare function parseLegendForChannel(model: UnitModel, channel: NonPositionScaleChannel): LegendComponent;
export declare function mergeLegendComponent(mergedLegend: LegendComponent, childLegend: LegendComponent): LegendComponent;
//# sourceMappingURL=parse.d.ts.map