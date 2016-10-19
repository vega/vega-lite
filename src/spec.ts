/* Package of defining Vega-lite Specification's json schema at its utility functions */

import {Config, defaultOverlayConfig, AreaOverlay} from './config';
import {Data} from './data';
import {Encoding, UnitEncoding, has, isRanged} from './encoding';
import {Facet} from './facet';
import {FieldDef} from './fielddef';
import {Mark, ERRORBAR, TICK, AREA, RULE, LINE, POINT} from './mark';
import {stack} from './stack';
import {Transform} from './transform';
import {ROW, COLUMN, X, Y, X2, Y2} from './channel';
import * as vlEncoding from './encoding';
import {contains, duplicate, extend, hash, keys, omit, pick, vals} from './util';

export interface BaseSpec {
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

export interface UnitSpec extends BaseSpec {
  // FIXME description for top-level width
  width?: number;

  // FIXME description for top-level width
  height?: number;

  /**
   * The mark type.
   * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"rule"`, and `"text"`.
   */
  mark: Mark;

  /**
   * A key-value mapping between encoding channels and definition of fields.
   */
  encoding?: UnitEncoding;
}

/**
 * Schema for a unit Vega-Lite specification, with the syntactic sugar extensions:
 * - `row` and `column` are included in the encoding.
 * - (Future) label, box plot
 *
 * Note: the spec could contain facet.
 *
 * @required ["mark", "encoding"]
 */
export interface ExtendedUnitSpec extends BaseSpec {
  // FIXME description for top-level width
  width?: number;

  // FIXME description for top-level width
  height?: number;

  /**
   * The mark type.
   * One of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
   * `"area"`, `"point"`, `"rule"`, and `"text"`.
   */
  mark: Mark;

  /**
   * A key-value mapping between encoding channels and definition of fields.
   */
  encoding?: Encoding;
}

export interface FacetSpec extends BaseSpec {
  facet: Facet;
  spec: LayerSpec | UnitSpec;
}

export interface LayerSpec extends BaseSpec {
  // FIXME description for top-level width
  width?: number;

  // FIXME description for top-level width
  height?: number;

  /**
   * Unit specs that will be layered.
   */
  layers: UnitSpec[];
}

/** This is for the future schema */
export interface ExtendedFacetSpec extends BaseSpec {
  facet: Facet;

  spec: ExtendedUnitSpec | FacetSpec;
}

export type ExtendedSpec = ExtendedUnitSpec | FacetSpec | LayerSpec;
export type Spec = UnitSpec | FacetSpec | LayerSpec;

/* Custom type guards */

export function isSomeFacetSpec(spec: ExtendedSpec | ExtendedFacetSpec): spec is FacetSpec | ExtendedFacetSpec {
  return spec['facet'] !== undefined;
}

export function isExtendedUnitSpec(spec: ExtendedSpec): spec is ExtendedUnitSpec {
  if (isSomeUnitSpec(spec)) {
    const hasRow = has(spec.encoding, ROW);
    const hasColumn = has(spec.encoding, COLUMN);

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
  return spec['layers'] !== undefined;
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

export function normalizeExtendedUnitSpec(spec: ExtendedUnitSpec): Spec {
    const hasRow = has(spec.encoding, ROW);
    const hasColumn = has(spec.encoding, COLUMN);

    // TODO: @arvind please  add interaction syntax here
    let encoding = duplicate(spec.encoding);
    delete encoding.column;
    delete encoding.row;

    return extend(
      spec.name ? { name: spec.name } : {},
      spec.description ? { description: spec.description } : {},
      { data: spec.data },
      spec.transform ? { transform: spec.transform } : {},
      {
        facet: extend(
          hasRow ? { row: spec.encoding.row } : {},
          hasColumn ? { column: spec.encoding.column } : {}
        ),
        spec: normalizeUnitSpec(extend(
          spec.width ? { width: spec.width } : {},
          spec.height ? { height: spec.height } : {},
          {
            mark: spec.mark,
            encoding: encoding
          },
          spec.config ? { config: spec.config } : {}
        ))
      },
      spec.config ? { config: spec.config } : {}
    );
}

export function normalizeUnitSpec(spec: UnitSpec): Spec {
  const config = spec.config;
  const overlayConfig = config && config.overlay;
  const overlayWithLine = overlayConfig  && spec.mark === AREA &&
    contains([AreaOverlay.LINEPOINT, AreaOverlay.LINE], overlayConfig.area);
  const overlayWithPoint = overlayConfig && (
    (overlayConfig.line && spec.mark === LINE) ||
    (overlayConfig.area === AreaOverlay.LINEPOINT && spec.mark === AREA)
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

export function normalizeRangedUnitSpec(spec: UnitSpec): Spec {
  if (spec.encoding) {
    const hasX = has(spec.encoding, X);
    const hasY = has(spec.encoding, Y);
    const hasX2 = has(spec.encoding, X2);
    const hasY2 = has(spec.encoding, Y2);
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

export function normalizeErrorBarUnitSpec(spec: UnitSpec): Spec {
  // FIXME correctly deal with color and opacity

  let layerSpec = extend(spec.name ? {name: spec.name} : {},
    spec.description ? {description: spec.description} : {},
    spec.data ? {data: spec.data} : {},
    spec.transform ? {transform: spec.transform} : {},
    spec.config ? {config: spec.config} : {}, {layers: []}
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
    layerSpec.layers.push(normalizeUnitSpec(ruleSpec));
    layerSpec.layers.push(normalizeUnitSpec(lowerTickSpec));
    layerSpec.layers.push(normalizeUnitSpec(upperTickSpec));
  }
  return layerSpec;
}

export function normalizeOverlay(spec: UnitSpec, overlayWithPoint: boolean, overlayWithLine: boolean): LayerSpec {
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

  const layerSpec = extend(
    pick(spec, outerProps),
    { layers: [baseSpec] },
    keys(baseConfig).length > 0 ? { config: baseConfig } : {}
  );

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

    layerSpec.layers.push(lineSpec);
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
    layerSpec.layers.push(pointSpec);
  }
  return layerSpec;
}

// TODO: add vl.spec.validate & move stuff from vl.validate to here

/* Accumulate non-duplicate fieldDefs in a dictionary */
function accumulate(dict: any, fieldDefs: FieldDef[]): any {
  fieldDefs.forEach(function(fieldDef) {
    // Consider only pure fieldDef properties (ignoring scale, axis, legend)
    var pureFieldDef = ['field', 'type', 'value', 'timeUnit', 'bin', 'aggregate'].reduce((f, key) => {
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
    spec.layers.forEach(function(layer) {
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
