import type {SignalRef} from 'vega';
import {FieldName} from '../channeldef.js';
import {Config} from '../config.js';
import {Encoding} from '../encoding.js';
import {ParameterPredicate} from '../predicate.js';
import {ExprRef} from '../expr.js';
import {Projection} from '../projection.js';
import {TopLevelSelectionParameter} from '../selection.js';
import {GenericSpec, NormalizedSpec} from '../spec/index.js';
import {GenericLayerSpec, NormalizedLayerSpec} from '../spec/layer.js';
import {GenericUnitSpec, NormalizedUnitSpec} from '../spec/unit.js';
import {Dict} from '../util.js';
import {RepeaterValue} from './repeater.js';

export type Normalize<S extends GenericSpec<any, any, any, any>, NS extends NormalizedSpec> = (
  spec: S,
  params: NormalizerParams,
) => NS;

export interface ExtraNormalizer<
  S extends GenericSpec<any, any, any, FieldName>, // Input type
  O extends NormalizedSpec, // Output Type
  SN extends GenericSpec<any, any, any, FieldName> = S, // input to additional normalization
> {
  name: string;
  hasMatchingType: (spec: GenericSpec<any, any, any, any>, config: Config) => spec is S;

  run(spec: S, params: NormalizerParams, normalize: Normalize<SN, O>): O;
}

export type NonFacetUnitNormalizer<S extends GenericUnitSpec<any, any>> = ExtraNormalizer<
  S,
  NormalizedUnitSpec | NormalizedLayerSpec,
  GenericUnitSpec<any, any> | GenericLayerSpec<any>
>;

export type NormalizeLayerOrUnit = Normalize<
  GenericUnitSpec<any, any> | GenericLayerSpec<any>,
  NormalizedUnitSpec | NormalizedLayerSpec
>;

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
