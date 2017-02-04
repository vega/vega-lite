/* Package of defining Vega-lite Specification's json schema at its utility functions */

import {Config, defaultOverlayConfig} from './config';
import {Data} from './data';
import {ExtendedEncoding, Encoding, channelHasField, isRanged} from './encoding';
import {Facet} from './facet';
import {FieldDef} from './fielddef';
import {Mark, ERRORBAR, TICK, AREA, RULE, LINE, POINT} from './mark';
import {stack} from './stack';
import {Transform} from './transform';
import {ROW, COLUMN, X, Y, X2, Y2} from './channel';
import * as vlEncoding from './encoding';
import {contains, duplicate, extend, hash, keys, omit, pick, vals} from './util';

export type Padding = number | {top?: number, bottom?: number, left?: number, right?: number};

export interface BaseSpec {
  /**
   * URL to JSON schema for this Vega-Lite specification.
   * @format uri
   */
  $schema?: string;

  /**
   * Name of the visualization for later reference.
   */
  name?: string;

  /**
   * An optional description of this mark for commenting purpose.
   * This property has no effect on the output visualization.
   */
  description?: string;

  /**
   * The default visualization padding, in pixels, from the edge of the visualization canvas to the data rectangle. This can be a single number or an object with `"top"`, `"left"`, `"right"`, `"bottom"` properties.
   *
   * __Default value__: `5`
   *
   * @minimum 0
   */
  padding?: Padding;

  /**
   * An object describing the data source
   */
  data?: Data;

  /**
   * An object describing filter and new field calculation.
   */
  transform?: Transform;

  /**
   * Configuration object
   */
  config?: Config;
}

export interface GenericUnitSpec<E extends Encoding> extends BaseSpec {
  // FIXME description for top-level width
  width?: number;

  // FIXME description for top-level width
  height?: number;

  /**
   * The mark type.
   * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"rule"`, and `"text"`.
   */
  mark?: Mark;

  /**
   * A key-value mapping between encoding channels and definition of fields.
   */
  encoding?: E;
}

export type UnitSpec = GenericUnitSpec<Encoding>;

export type ExtendedUnitSpec = GenericUnitSpec<ExtendedEncoding>;

export interface GenericLayerSpec<E> extends BaseSpec {
  // FIXME description for top-level width
  width?: number;

  // FIXME description for top-level width
  height?: number;

  /**
   * Unit specs that will be layered.
   */
  // TODO: support layer of layer
  layer: GenericUnitSpec<E>[];
}

export type LayerSpec = GenericLayerSpec<Encoding>;


export interface GenericFacetSpec<E> extends BaseSpec {
  facet: Facet;

  // TODO: support facet of facet
  spec: GenericLayerSpec<E> | GenericUnitSpec<E>;
}

export type FacetSpec = GenericFacetSpec<Encoding>;
export type ExtendedFacetSpec = GenericFacetSpec<ExtendedEncoding>;

export type GenericSpec<E> = GenericUnitSpec<E> | GenericLayerSpec<E> | GenericFacetSpec<E>;

export type ExtendedSpec = GenericSpec<ExtendedEncoding>;
export type Spec = GenericSpec<Encoding>;

/* Custom type guards */

export function isSomeFacetSpec(spec: ExtendedSpec | ExtendedFacetSpec): spec is FacetSpec | ExtendedFacetSpec {
  return spec['facet'] !== undefined;
}

export function isExtendedUnitSpec(spec: ExtendedSpec): spec is ExtendedUnitSpec {
  if (isSomeUnitSpec(spec)) {
    const hasRow = channelHasField(spec.encoding, ROW);
    const hasColumn = channelHasField(spec.encoding, COLUMN);

    return hasRow || hasColumn;
  }

  return false;
}

export function isUnitSpec(spec: ExtendedSpec): spec is UnitSpec {
  if (isSomeUnitSpec(spec)) {
    return !isExtendedUnitSpec(spec);
  }

  return false;
}

export function isSomeUnitSpec(spec: ExtendedSpec): spec is ExtendedUnitSpec | UnitSpec {
  return spec['mark'] !== undefined;
}

export function isLayerSpec(spec: ExtendedSpec | ExtendedFacetSpec): spec is LayerSpec {
  return spec['layer'] !== undefined;
}


/**
 * Decompose extended unit specs into composition of pure unit specs.
 */
// TODO: consider moving this to another file.  Maybe vl.spec.normalize or vl.normalize
export function normalize(spec: ExtendedSpec): Spec {
  if (isExtendedUnitSpec(spec)) {
    return normalizeExtendedUnitSpec(spec);
  }
  if (isUnitSpec(spec)) {
    return normalizeUnitSpec(spec);
  }
  return spec;
}

function normalizeExtendedUnitSpec(spec: ExtendedUnitSpec): Spec {
    const hasRow = channelHasField(spec.encoding, ROW);
    const hasColumn = channelHasField(spec.encoding, COLUMN);

    // TODO: @arvind please  add interaction syntax here
    let encoding = duplicate(spec.encoding);
    delete encoding.column;
    delete encoding.row;

    return extend(
      spec.name ? {name: spec.name} : {},
      spec.description ? {description: spec.description} : {},
      {data: spec.data},
      spec.transform ? {transform: spec.transform} : {},
      {
        facet: extend(
          hasRow ? {row: spec.encoding.row} : {},
          hasColumn ? {column: spec.encoding.column} : {}
        ),
        spec: normalizeUnitSpec(extend(
          spec.width ? {width: spec.width} : {},
          spec.height ? {height: spec.height} : {},
          {
            mark: spec.mark,
            encoding: encoding
          },
          spec.config ? {config: spec.config} : {}
        ))
      },
      spec.config ? {config: spec.config} : {}
    );
}

function normalizeUnitSpec(spec: UnitSpec): Spec {
  const config = spec.config;
  const overlayConfig = config && config.overlay;
  const overlayWithLine = overlayConfig  && spec.mark === AREA &&
    contains(['linepoint', 'line'], overlayConfig.area);
  const overlayWithPoint = overlayConfig && (
    (overlayConfig.line && spec.mark === LINE) ||
    (overlayConfig.area === 'linepoint' && spec.mark === AREA)
  );

  // TODO: thoroughly test
  if (spec.mark === ERRORBAR) {
    return normalizeErrorBarUnitSpec(spec);
  }
  // TODO: thoroughly test
  if (isRanged(spec.encoding)) {
    return normalizeRangedUnitSpec(spec);
  }

  if (overlayWithPoint || overlayWithLine) {
    return normalizeOverlay(spec, overlayWithPoint, overlayWithLine);
  }
  return spec;
}

function normalizeRangedUnitSpec(spec: UnitSpec): Spec {
  if (spec.encoding) {
    const hasX = channelHasField(spec.encoding, X);
    const hasY = channelHasField(spec.encoding, Y);
    const hasX2 = channelHasField(spec.encoding, X2);
    const hasY2 = channelHasField(spec.encoding, Y2);
    if ((hasX2 && !hasX) || (hasY2 && !hasY)) {
      let normalizedSpec = duplicate(spec);
      if (hasX2 && !hasX) {
        normalizedSpec.encoding.x = normalizedSpec.encoding.x2;
        delete normalizedSpec.encoding.x2;
      }
      if (hasY2 && !hasY) {
        normalizedSpec.encoding.y = normalizedSpec.encoding.y2;
        delete normalizedSpec.encoding.y2;
      }

      return normalizedSpec;
    }
  }
  return spec;
}

function normalizeErrorBarUnitSpec(spec: UnitSpec): Spec {
  // FIXME correctly deal with color and opacity

  let layerSpec = extend(spec.name ? {name: spec.name} : {},
    spec.description ? {description: spec.description} : {},
    spec.data ? {data: spec.data} : {},
    spec.transform ? {transform: spec.transform} : {},
    spec.config ? {config: spec.config} : {}, {layer: []}
  );
  if (!spec.encoding) {
    return layerSpec;
  }
  if (spec.mark === ERRORBAR) {
    const ruleSpec = {
      mark: RULE,
      encoding: extend(
        spec.encoding.x ? {x: duplicate(spec.encoding.x)} : {},
        spec.encoding.y ? {y: duplicate(spec.encoding.y)} : {},
        spec.encoding.x2 ? {x2: duplicate(spec.encoding.x2)} : {},
        spec.encoding.y2 ? {y2: duplicate(spec.encoding.y2)} : {},
        {})
    };
    const lowerTickSpec = {
      mark: TICK,
      encoding: extend(
        spec.encoding.x ? {x: duplicate(spec.encoding.x)} : {},
        spec.encoding.y ? {y: duplicate(spec.encoding.y)} : {},
        spec.encoding.size ? {size: duplicate(spec.encoding.size)} : {},
        {})
    };
    const upperTickSpec = {
      mark: TICK,
      encoding: extend({
        x: spec.encoding.x2 ? duplicate(spec.encoding.x2) : duplicate(spec.encoding.x),
        y: spec.encoding.y2 ? duplicate(spec.encoding.y2) : duplicate(spec.encoding.y)
      }, spec.encoding.size ? {size: duplicate(spec.encoding.size)} : {})
    };
    layerSpec.layer.push(normalizeUnitSpec(ruleSpec));
    layerSpec.layer.push(normalizeUnitSpec(lowerTickSpec));
    layerSpec.layer.push(normalizeUnitSpec(upperTickSpec));
  }
  return layerSpec;
}

function normalizeOverlay(spec: UnitSpec, overlayWithPoint: boolean, overlayWithLine: boolean): LayerSpec {
  let outerProps = ['name', 'description', 'data', 'transform'];
  let baseSpec = omit(spec, outerProps.concat('config'));

  let baseConfig = duplicate(spec.config);
  delete baseConfig.overlay;
  // TODO: remove shape, size

  // Need to copy stack config to overlayed layer
  const stacked = stack(spec.mark,
    spec.encoding,
    spec.config && spec.config.mark ? spec.config.mark.stacked : undefined
  );

  const layerSpec = {
    ...pick(spec, outerProps),
    layer: [baseSpec],
    ...(keys(baseConfig).length > 0 ? {config: baseConfig} : {})
  };

  if (overlayWithLine) {
    // TODO: add name with suffix
    let lineSpec = duplicate(baseSpec);
    lineSpec.mark = LINE;
    // TODO: remove shape, size
    let markConfig = extend({},
      defaultOverlayConfig.lineStyle,
      spec.config.overlay.lineStyle,
      stacked ? {stacked: stacked.offset} : null
    );
    if (keys(markConfig).length > 0) {
      lineSpec.config = {mark: markConfig};
    }

    layerSpec.layer.push(lineSpec);
  }

  if (overlayWithPoint) {
    // TODO: add name with suffix
    let pointSpec = duplicate(baseSpec);
    pointSpec.mark = POINT;

    let markConfig = extend({},
      defaultOverlayConfig.pointStyle,
      spec.config.overlay.pointStyle,
      stacked ? {stacked: stacked.offset} : null
    );
    if (keys(markConfig).length > 0) {
      pointSpec.config = {mark: markConfig};
    }
    layerSpec.layer.push(pointSpec);
  }
  return layerSpec;
}

// TODO: add vl.spec.validate & move stuff from vl.validate to here

/* Accumulate non-duplicate fieldDefs in a dictionary */
function accumulate(dict: any, fieldDefs: FieldDef[]): any {
  fieldDefs.forEach(function(fieldDef) {
    // Consider only pure fieldDef properties (ignoring scale, axis, legend)
    const pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce((f, key) => {
      if (fieldDef[key] !== undefined) {
        f[key] = fieldDef[key];
      }
      return f;
    }, {});
    let key = hash(pureFieldDef);
    dict[key] = dict[key] || fieldDef;
  });
  return dict;
}

/* Recursively get fieldDefs from a spec, returns a dictionary of fieldDefs */
function fieldDefIndex(spec: ExtendedSpec | ExtendedFacetSpec, dict: any = {}): any {
  // TODO: Support repeat and concat
  if (isLayerSpec(spec)) {
    spec.layer.forEach(function(layer) {
      accumulate(dict, vlEncoding.fieldDefs(layer.encoding));
    });
  } else if (isSomeFacetSpec(spec)) {
    accumulate(dict, vlEncoding.fieldDefs(spec.facet));
    fieldDefIndex(spec.spec, dict);
  } else { // Unit Spec
    accumulate(dict, vlEncoding.fieldDefs(spec.encoding));
  }
  return dict;
}

/* Returns all non-duplicate fieldDefs in a spec in a flat array */
export function fieldDefs(spec: ExtendedSpec | ExtendedFacetSpec): FieldDef[] {
  return vals(fieldDefIndex(spec));
};

export function isStacked(spec: ExtendedUnitSpec): boolean {
  return stack(spec.mark, spec.encoding,
           (spec.config && spec.config.mark) ? spec.config.mark.stacked : undefined
         ) !== null;
}
