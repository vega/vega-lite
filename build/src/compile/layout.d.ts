import { Channel } from '../channel';
import { StringSet } from '../util';
import { VgData } from '../vega.schema';
import { FacetModel } from './facet';
import { LayerModel } from './layer';
import { Model } from './model';
import { UnitModel } from './unit';
export interface LayoutComponent {
    width: SizeComponent;
    height: SizeComponent;
}
export interface Formula {
    as: string;
    expr: string;
}
export interface SizeComponent {
    /** Where to pull data from */
    source: string;
    /** Field that we need to calculate distinct */
    distinct: StringSet;
    /** Array of formulas */
    formula: Formula[];
}
export declare function assembleLayout(model: Model, layoutData: VgData[]): VgData[];
export declare function parseUnitLayout(model: UnitModel): LayoutComponent;
export declare function unitSizeExpr(model: UnitModel, channel: Channel): string;
export declare function parseFacetLayout(model: FacetModel): LayoutComponent;
export declare function parseLayerLayout(model: LayerModel): LayoutComponent;
export declare function cardinalityExpr(model: Model, channel: Channel): string;
