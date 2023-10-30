import type { SignalRef } from 'vega';
import { FieldName } from '../channeldef';
import { Config } from '../config';
import { Encoding } from '../encoding';
import { ParameterPredicate } from '../predicate';
import { ExprRef } from '../expr';
import { Projection } from '../projection';
import { TopLevelSelectionParameter } from '../selection';
import { GenericSpec, NormalizedSpec } from '../spec';
import { GenericLayerSpec, NormalizedLayerSpec } from '../spec/layer';
import { GenericUnitSpec, NormalizedUnitSpec } from '../spec/unit';
import { Dict } from '../util';
import { RepeaterValue } from './repeater';
export type Normalize<S extends GenericSpec<any, any, any, any>, NS extends NormalizedSpec> = (spec: S, params: NormalizerParams) => NS;
export interface ExtraNormalizer<S extends GenericSpec<any, any, any, FieldName>, // Input type
O extends NormalizedSpec, // Output Type
SN extends GenericSpec<any, any, any, FieldName> = S> {
    name: string;
    hasMatchingType: (spec: GenericSpec<any, any, any, any>, config: Config) => spec is S;
    run(spec: S, params: NormalizerParams, normalize: Normalize<SN, O>): O;
}
export type NonFacetUnitNormalizer<S extends GenericUnitSpec<any, any>> = ExtraNormalizer<S, NormalizedUnitSpec | NormalizedLayerSpec, GenericUnitSpec<any, any> | GenericLayerSpec<any>>;
export type NormalizeLayerOrUnit = Normalize<GenericUnitSpec<any, any> | GenericLayerSpec<any>, NormalizedUnitSpec | NormalizedLayerSpec>;
export interface NormalizerParams {
    config: Config<SignalRef>;
    parentEncoding?: Encoding<FieldName>;
    parentProjection?: Projection<ExprRef>;
    repeater?: RepeaterValue;
    repeaterPrefix?: string;
    selections?: TopLevelSelectionParameter[];
    emptySelections?: Dict<boolean>;
    selectionPredicates?: Dict<ParameterPredicate[]>;
    path?: string[];
}
//# sourceMappingURL=base.d.ts.map