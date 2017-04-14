import { FacetModel } from '../src/compile/facet';
import { LayerModel } from '../src/compile/layer';
import { Model } from '../src/compile/model';
import { UnitModel } from '../src/compile/unit';
import { ExtendedSpec, FacetSpec, LayerSpec, TopLevel, UnitSpec } from '../src/spec';
export declare function parseModel(inputSpec: TopLevel<ExtendedSpec>): Model;
export declare function parseUnitModel(spec: TopLevel<UnitSpec>): UnitModel;
export declare function parseLayerModel(spec: TopLevel<LayerSpec>): LayerModel;
export declare function parseFacetModel(spec: TopLevel<FacetSpec>): FacetModel;
