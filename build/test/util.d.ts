import { FacetModel } from '../src/compile/facet';
import { LayerModel } from '../src/compile/layer';
import { Model } from '../src/compile/model';
import { UnitModel } from '../src/compile/unit';
import { ExtendedSpec, FacetSpec, LayerSpec, UnitSpec } from '../src/spec';
export declare function parseModel(inputSpec: ExtendedSpec): Model;
export declare function parseUnitModel(spec: UnitSpec): UnitModel;
export declare function parseLayerModel(spec: LayerSpec): LayerModel;
export declare function parseFacetModel(spec: FacetSpec): FacetModel;
