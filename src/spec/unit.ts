import {BoxPlotUnitSpec} from '../compositemark/boxplot';
import {ErrorBandUnitSpec} from '../compositemark/errorband';
import {ErrorBarUnitSpec} from '../compositemark/errorbar';
import {CompositeMarkUnitSpec} from '../compositemark/index';
import {Encoding} from '../encoding';
import {Field} from '../fielddef';
import {Mark, MarkDef} from '../mark';
import {Projection} from '../projection';
import {SelectionDef} from '../selection';
import {BaseSpec, DataMixins, LayerUnitMixins} from './base';
import {FacetMapping} from './facet';
import {TopLevel} from './toplevel';

/**
 * Base interface for a unit (single-view) specification.
 */
export interface GenericUnitSpec<E extends Encoding<any>, M> extends BaseSpec, LayerUnitMixins {
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
  projection?: Projection;

  /**
   * A key-value mapping between selection names and definitions.
   */
  selection?: {[name: string]: SelectionDef};
}

/**
 * A unit specification without any shortcut/expansion syntax.
 */
export type NormalizedUnitSpec<
  /** Extra Encoding */
  EE = {}
> = GenericUnitSpec<Encoding<Field> & EE, Mark | MarkDef>;

/* tslint:disable */
// Need to declare empty object so the generated schema has a reasonable name for ExtendedUnitSpec
export interface EmptyObject {}
/* tslint:enable */

/**
 * Unit spec that can be normalized/expanded into a layer spec or another unit spec.
 */
export type ExtendedUnitSpec<
  /** Extra Encoding */
  EE = EmptyObject
> = NormalizedUnitSpec<EE> | CompositeMarkUnitSpec<EE>;

/**
 * Unit spec that can have a composite mark and row or column channels (shorthand for a facet spec).
 */
export type FacetedExtendedUnitSpec = ExtendedUnitSpec<FacetMapping<Field>>;

// Note: The following three declarations are equivalent to:
// ```
// export type TopLevelFacetedUnitSpec = TopLevel<FacetedExtendedUnitSpec> & DataMixins;
// ```
// However, the JSON schema generator does not support the simpler syntax

export type TopLevelNormalizedUnitSpec = TopLevel<NormalizedUnitSpec<FacetMapping<Field>>> & DataMixins;
export type TopLevelCompositeMarkUnitSpec =
  | (TopLevel<ErrorBarUnitSpec<FacetMapping<Field>>> & DataMixins)
  | (TopLevel<ErrorBandUnitSpec<FacetMapping<Field>>> & DataMixins)
  | (TopLevel<BoxPlotUnitSpec<FacetMapping<Field>>> & DataMixins);
export type TopLevelFacetedUnitSpec = TopLevelNormalizedUnitSpec | TopLevelCompositeMarkUnitSpec;

export function isUnitSpec(spec: BaseSpec): spec is FacetedExtendedUnitSpec | NormalizedUnitSpec {
  return !!spec['mark'];
}
