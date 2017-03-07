import { UnitModel } from '../src/compile/unit';
import { FacetModel } from '../src/compile/facet';
import { LayerModel } from '../src/compile/layer';
import { UnitSpec, FacetSpec, LayerSpec, ExtendedSpec } from '../src/spec';
import { Model } from '../src/compile/model';
export declare function parseModel(inputSpec: ExtendedSpec): Model;
export declare function parseUnitModel(spec: UnitSpec): UnitModel;
export declare function parseLayerModel(spec: LayerSpec): LayerModel;
export declare function parseFacetModel(spec: FacetSpec): FacetModel;
