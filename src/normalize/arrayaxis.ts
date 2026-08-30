import {ChannelDef, isFieldOrDatumDef, isValueDef} from '../channeldef.js';
import {Config} from '../config.js';
import {Encoding} from '../encoding.js';
import {isMarkDef, Mark, MarkDef} from '../mark.js';
import {GenericUnitSpec} from '../spec/index.js';
import {isUnitSpec} from '../spec/unit.js';
import {internalField, omit} from '../util.js';
import {NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams} from './base.js';

type UnitSpecWithArrayAxis = GenericUnitSpec<Encoding<string>, Mark | MarkDef<'array'>>;

/** Fields holding the origin an `array` mark's axes run from, when labelling it in cells. */
const ORIGIN = {x: internalField('array_x0'), y: internalField('array_y0')} as const;

/** The user's own channel replaces a generated one, or adjusts it when it names no data itself. */
function overlay<D extends ChannelDef<string>>(generated: D, user: D): D {
  if (!user) return generated;
  return isFieldOrDatumDef(user) || isValueDef(user) ? user : {...generated, ...user};
}

function arrayAxis(mark: Mark | MarkDef, config: Config) {
  const markDef = isMarkDef(mark) ? mark : {type: mark};
  return markDef.type === 'array' ? ((markDef as MarkDef<'array'>).axis ?? config.array?.axis) : undefined;
}

/**
 * Expands the `axis` flag of an `array` mark into the encodings that label a grid: over its
 * `extent` field, or from zero to its `width` and `height`.
 */
export class ArrayAxisNormalizer implements NonFacetUnitNormalizer<UnitSpecWithArrayAxis> {
  public name = 'array-axis';

  public hasMatchingType(spec: GenericUnitSpec<any, Mark | MarkDef>, config: Config): spec is UnitSpecWithArrayAxis {
    return isUnitSpec(spec) && !!arrayAxis(spec.mark, config);
  }

  public run(spec: UnitSpecWithArrayAxis, normParams: NormalizerParams, normalize: NormalizeLayerOrUnit) {
    const {config} = normParams;
    const {mark, encoding = {}, transform = [], ...outerSpec} = spec;
    const markDef: MarkDef<'array'> = isMarkDef(mark) ? mark : {type: 'array'};
    const overExtent = arrayAxis(mark, config) === 'extent';

    // In cells the grid starts at zero, which no field holds, so derive one to encode against.
    const transforms = overExtent
      ? transform
      : [...transform, {calculate: '0', as: ORIGIN.x}, {calculate: '0', as: ORIGIN.y}];

    return normalize(
      {
        ...outerSpec,
        ...(transforms.length ? {transform: transforms} : {}),
        mark: omit(markDef, ['axis']) as MarkDef<'array'>,
        encoding: {
          x: overlay({field: overExtent ? 'extent[0]' : ORIGIN.x, type: 'quantitative', title: null}, encoding.x),
          x2: overlay({field: overExtent ? 'extent[1]' : 'width'}, encoding.x2),
          y: overlay({field: overExtent ? 'extent[2]' : ORIGIN.y, type: 'quantitative', title: null}, encoding.y),
          y2: overlay({field: overExtent ? 'extent[3]' : 'height'}, encoding.y2),
          ...omit(encoding, ['x', 'x2', 'y', 'y2']),
        },
      },
      // drop the flag from the config too, or the expanded spec matches again and recurses
      {...normParams, config: {...config, array: omit(config.array, ['axis'])}},
    );
  }
}
