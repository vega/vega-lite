import {AutoMark, AutoMarkDef, AutoPreferredMark, isAutoMark, isAutoMarkDef, isAutoPreferredMark} from '../automark.js';
import {COLOR, LATITUDE, LONGITUDE, SIZE, THETA, X, Y} from '../channel.js';
import {getFieldOrDatumDef, isFieldDef, TypedFieldDef} from '../channeldef.js';
import {channelHasField, Encoding, normalizeEncoding} from '../encoding.js';
import * as log from '../log/index.js';
import {Mark} from '../mark.js';
import {GenericSpec} from '../spec/index.js';
import {GenericLayerSpec, NormalizedLayerSpec} from '../spec/layer.js';
import {GenericUnitSpec, isUnitSpec, NormalizedUnitSpec} from '../spec/unit.js';
import {isContinuous} from '../type.js';
import {isEmpty, keys} from '../util.js';
import {NonFacetUnitNormalizer, Normalize, NormalizerParams} from './base.js';

type AutoUnitSpec = GenericUnitSpec<Encoding<string>, AutoMark | AutoMarkDef>;

/** Classification of a positional (x/y) field for the purpose of choosing a mark. */
type PositionClass = 'none' | 'continuous' | 'discrete';

/**
 * Normalizer for the `"auto"` mark. Picks the primitive mark that best matches the encodings and
 * their declared/inferred data types, then re-runs normalization so that downstream normalizers
 * (e.g. path overlay) still apply.
 *
 * Because Vega-Lite compiles without access to the data, the decision is made purely from the
 * declared (or inferred) channel types — not from data values.
 */
export class AutoMarkNormalizer implements NonFacetUnitNormalizer<AutoUnitSpec> {
  public name = 'AutoMark';

  public hasMatchingType(spec: GenericSpec<any, any, any, any>): spec is AutoUnitSpec {
    return isUnitSpec(spec) && isAutoMark(spec.mark);
  }

  public run(
    spec: AutoUnitSpec,
    params: NormalizerParams,
    normalize: Normalize<
      GenericUnitSpec<Encoding<any>, any> | GenericLayerSpec<any>,
      NormalizedLayerSpec | NormalizedUnitSpec
    >,
  ): NormalizedLayerSpec | NormalizedUnitSpec {
    const {config} = params;

    // Infer types up front so the decision can rely on them.
    const encoding = normalizeEncoding(spec.encoding ?? {}, config);

    let prefer = isAutoMarkDef(spec.mark) ? spec.mark.prefer : undefined;
    if (prefer !== undefined && !isAutoPreferredMark(prefer)) {
      log.warn(log.message.autoMarkInvalidPrefer(prefer as string));
      prefer = undefined;
    }

    const {mark, encoding: newEncoding} = chooseMark(encoding, prefer);

    const newSpec = {
      ...spec,
      mark,
      ...(isEmpty(newEncoding) ? {} : {encoding: newEncoding}),
    };

    return normalize(newSpec, params);
  }
}

export const autoMarkNormalizer = new AutoMarkNormalizer();

function getTypedFieldDef(encoding: Encoding<string>, channel: string): TypedFieldDef<string> | undefined {
  const channelDef = (encoding as any)[channel];
  if (!channelDef) {
    return undefined;
  }
  const def = getFieldOrDatumDef(channelDef);
  return def && isFieldDef(def) ? (def as TypedFieldDef<string>) : undefined;
}

function classifyPosition(fieldDef: TypedFieldDef<string> | undefined): PositionClass {
  if (!fieldDef) {
    return 'none';
  }
  // A binned field renders as discrete bands, even though its type is quantitative.
  if (fieldDef.bin) {
    return 'discrete';
  }
  return isContinuous(fieldDef.type) ? 'continuous' : 'discrete';
}

function isTemporal(fieldDef: TypedFieldDef<string> | undefined): boolean {
  return fieldDef?.type === 'temporal';
}

/** A field def carries a measure if it is quantitative or is aggregated. */
function isMeasureChannel(encoding: Encoding<string>, channel: string): boolean {
  const fieldDef = getTypedFieldDef(encoding, channel);
  if (!fieldDef) {
    return false;
  }
  return !!fieldDef.aggregate || fieldDef.type === 'quantitative';
}

function hasGeojson(encoding: Encoding<string>): boolean {
  for (const channel of keys(encoding)) {
    if (getTypedFieldDef(encoding, channel)?.type === 'geojson') {
      return true;
    }
  }
  return false;
}

/**
 * For a 1D spec (exactly one positional field), synthesize a `count` on the empty axis and bin the
 * present field if it is continuous-quantitative — i.e. turn it into a histogram / count bar.
 */
function injectCount(
  encoding: Encoding<string>,
  presentChannel: typeof X | typeof Y,
  presentFieldDef: TypedFieldDef<string> | undefined,
  presentClass: PositionClass,
): Encoding<string> {
  const emptyChannel = presentChannel === X ? Y : X;
  const result: any = {...encoding};

  if (presentClass === 'continuous' && presentFieldDef?.type === 'quantitative' && !presentFieldDef.bin) {
    result[presentChannel] = {...(encoding as any)[presentChannel], bin: true};
  }

  result[emptyChannel] = {aggregate: 'count', type: 'quantitative'};

  return result;
}

/**
 * Choose a primitive mark (and possibly augment the encoding with binning/aggregation) from the
 * declared/inferred encoding types. When `prefer` is set, only the family selection is overridden;
 * the structural decisions (binning/aggregation) are still applied.
 */
export function chooseMark(
  encoding: Encoding<string>,
  prefer: AutoPreferredMark | undefined,
): {mark: Mark; encoding: Encoding<string>} {
  // 1. Geo overrides everything.
  if (hasGeojson(encoding)) {
    return {mark: 'geoshape', encoding};
  }
  if (channelHasField(encoding, LATITUDE) || channelHasField(encoding, LONGITUDE)) {
    return {mark: 'point', encoding};
  }

  const x = getTypedFieldDef(encoding, X);
  const y = getTypedFieldDef(encoding, Y);
  const xClass = classifyPosition(x);
  const yClass = classifyPosition(y);
  const hasX = xClass !== 'none';
  const hasY = yClass !== 'none';
  const oneD = hasX !== hasY; // exactly one positional field

  // 2. Structural injection (independent of family).
  let newEncoding = encoding;
  if (oneD) {
    newEncoding = injectCount(encoding, hasX ? X : Y, hasX ? x : y, hasX ? xClass : yClass);
  }

  // 3. Family selection.
  const mark = prefer ?? inferFamily(encoding, {x, y, xClass, yClass, hasX, hasY, oneD});

  return {mark, encoding: newEncoding};
}

function inferFamily(
  encoding: Encoding<string>,
  ctx: {
    x: TypedFieldDef<string> | undefined;
    y: TypedFieldDef<string> | undefined;
    xClass: PositionClass;
    yClass: PositionClass;
    hasX: boolean;
    hasY: boolean;
    oneD: boolean;
  },
): Mark {
  const {x, y, xClass, yClass, hasX, hasY, oneD} = ctx;

  // Pie chart: theta with no positional channel.
  if (!hasX && !hasY && channelHasField(encoding, THETA)) {
    return 'arc';
  }

  if (hasX && hasY) {
    if (xClass === 'continuous' && yClass === 'continuous') {
      // Without data we cannot detect order; only a temporal axis implies a sequence → line.
      return isTemporal(x) || isTemporal(y) ? 'line' : 'point';
    }
    if (xClass === 'continuous' || yClass === 'continuous') {
      return 'bar'; // one continuous, one discrete
    }
    // Both discrete.
    if (isMeasureChannel(encoding, SIZE)) {
      return 'point'; // sized dot grid (bubble)
    }
    if (isMeasureChannel(encoding, COLOR)) {
      return 'rect'; // heatmap
    }
    return 'point'; // strip / dot grid
  }

  if (oneD) {
    return 'bar'; // histogram / count bar (count injected in chooseMark)
  }

  log.warn(log.message.autoMarkUndetermined());
  return 'point';
}
