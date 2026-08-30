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
          x: {field: overExtent ? 'extent[0]' : ORIGIN.x, type: 'quantitative', title: null},
          x2: {field: overExtent ? 'extent[1]' : 'width'},
          y: {field: overExtent ? 'extent[2]' : ORIGIN.y, type: 'quantitative', title: null},
          y2: {field: overExtent ? 'extent[3]' : 'height'},
          // anything the user encoded themselves wins
          ...encoding,
        },
      },
      // drop the flag from the config too, or the expanded spec matches again and recurses
      {...normParams, config: {...config, array: omit(config.array, ['axis'])}},
    );
  }
}
