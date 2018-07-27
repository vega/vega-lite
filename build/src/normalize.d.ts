import { Config } from './config';
import { CompositeUnitSpec, ExtendedLayerSpec, FacetedCompositeUnitSpec, GenericSpec, NormalizedSpec, TopLevel, TopLevelSpec } from './spec';
export declare function normalizeTopLevelSpec(spec: TopLevelSpec | GenericSpec<CompositeUnitSpec, ExtendedLayerSpec> | FacetedCompositeUnitSpec, config: Config): TopLevel<NormalizedSpec>;
