import { PositionScaleChannel } from '../../channel';
import { LayerModel } from '../layer';
import { UnitModel } from '../unit';
import { AxisComponentIndex, AxisComponentPart } from './component';
export declare function parseUnitAxis(model: UnitModel): AxisComponentIndex;
export declare function parseLayerAxis(model: LayerModel): void;
/**
 * Make an inner axis for showing grid for shared axis.
 */
export declare function parseGridAxis(channel: PositionScaleChannel, model: UnitModel): AxisComponentPart;
export declare function parseMainAxis(channel: PositionScaleChannel, model: UnitModel): AxisComponentPart;
