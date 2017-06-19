import { VgSignal } from '../../vega.schema';
import { LayerModel } from '../layer';
import { UnitModel } from '../unit';
export declare function assembleLayoutLayerSignals(model: LayerModel): VgSignal[];
export declare function layerSizeExpr(model: LayerModel, sizeType: 'width' | 'height'): string;
export declare function assembleLayoutUnitSignals(model: UnitModel): VgSignal[];
export declare function unitSizeExpr(model: UnitModel, sizeType: 'width' | 'height'): string;
