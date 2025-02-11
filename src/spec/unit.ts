import {FieldName} from '../channeldef.js';
import {CompositeEncoding, FacetedCompositeEncoding} from '../compositemark/index.js';
import {Encoding} from '../encoding.js';
import {ExprRef} from '../expr.js';
import {AnyMark, Mark, MarkDef} from '../mark.js';
import {Projection} from '../projection.js';
import {SelectionParameter} from '../selection.js';
import {hasProperty} from '../util.js';
import {Field} from './../channeldef.js';
import {BaseSpec, DataMixins, FrameMixins, GenericCompositionLayout, ResolveMixins} from './base.js';
import {TopLevel, TopLevelParameter} from './toplevel.js';
/**
 * Base interface for a unit (single-view) specification.
 */
export interface GenericUnitSpec<E extends Encoding<any>, M, P = SelectionParameter> extends BaseSpec {
  /**
   * A string describing the mark type (one of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"rule"`, `"geoshape"`, and `"text"`) or a [mark definition object](https://vega.github.io/vega-lite/docs/mark.html#mark-def).
   */
  mark: M;

  /**
   * A key-value mapping between encoding channels and definition of fields.
   */
  encoding?: E;

  /**
   * An object defining properties of geographic projection, which will be applied to `shape` path for `"geoshape"` marks
   * and to `latitude` and `"longitude"` channels for other marks.
   */
  projection?: Projection<ExprRef>;

  /**
   * An array of parameters that may either be simple variables, or more complex selections that map user input to data queries.
   */
  params?: P[];
}

/**
 * A unit specification without any shortcut/expansion syntax.
 */
export type NormalizedUnitSpec = GenericUnitSpec<Encoding<FieldName>, Mark | MarkDef>;

/**
 * A unit specification, which can contain either [primitive marks or composite marks](https://vega.github.io/vega-lite/docs/mark.html#types).
 */
export type UnitSpec<F extends Field> = GenericUnitSpec<CompositeEncoding<F>, AnyMark>;

export type UnitSpecWithFrame<F extends Field> = GenericUnitSpec<CompositeEncoding<F>, AnyMark> & FrameMixins;

/**
 * Unit spec that can have a composite mark and row or column channels (shorthand for a facet spec).
 */
export type FacetedUnitSpec<F extends Field, P = SelectionParameter> = GenericUnitSpec<
  FacetedCompositeEncoding<F>,
  AnyMark,
  P
> &
  ResolveMixins &
  GenericCompositionLayout &
  FrameMixins;

export type TopLevelUnitSpec<F extends Field> = TopLevel<FacetedUnitSpec<F, TopLevelParameter>> & DataMixins;

export function isUnitSpec(spec: BaseSpec): spec is FacetedUnitSpec<any> | NormalizedUnitSpec {
  return hasProperty(spec, 'mark');
}
