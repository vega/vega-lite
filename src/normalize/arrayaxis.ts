import {Config} from '../config.js';
import {Encoding} from '../encoding.js';
import {isMarkDef, Mark, MarkDef} from '../mark.js';
import {GenericUnitSpec} from '../spec/index.js';
import {isUnitSpec} from '../spec/unit.js';
import {internalField, omit} from '../util.js';
import {NonFacetUnitNormalizer, NormalizeLayerOrUnit, NormalizerParams} from './base.js';

type UnitSpecWithArrayAxis = GenericUnitSpec<Encoding<string>, Mark | MarkDef<'array'>>;

/** Fields holding the origin an `array` mark's axes run from. */
const ORIGIN = {x: internalField('array_x0'), y: internalField('array_y0')} as const;

/**
 * Expands `{"mark": {"type": "array", "axis": true}}` into the encodings that label a grid with its
 * own extent: `x`/`y` at zero, and `x2`/`y2` at the grid's `width` and `height`.
 */
export class ArrayAxisNormalizer implements NonFacetUnitNormalizer<UnitSpecWithArrayAxis> {
  public name = 'array-axis';

  public hasMatchingType(spec: GenericUnitSpec<any, Mark | MarkDef>, config: Config): spec is UnitSpecWithArrayAxis {
    if (isUnitSpec(spec)) {
      const markDef = isMarkDef(spec.mark) ? spec.mark : {type: spec.mark};
      return markDef.type === 'array' && !!((markDef as MarkDef<'array'>).axis ?? config.array?.axis);
    }
    return false;
  }

  public run(spec: UnitSpecWithArrayAxis, normParams: NormalizerParams, normalize: NormalizeLayerOrUnit) {
    const {config} = normParams;
    const {mark, encoding = {}, transform = [], ...outerSpec} = spec;
    const markDef: MarkDef<'array'> = isMarkDef(mark) ? mark : {type: 'array'};

    return normalize(
      {
        ...outerSpec,
        // The grid's extent starts at zero, which no field holds, so derive one to encode against.
        transform: [...transform, {calculate: '0', as: ORIGIN.x}, {calculate: '0', as: ORIGIN.y}],
        mark: omit(markDef, ['axis']) as MarkDef<'array'>,
        encoding: {
          x: {field: ORIGIN.x, type: 'quantitative', title: null},
          x2: {field: 'width'},
          y: {field: ORIGIN.y, type: 'quantitative', title: null},
          y2: {field: 'height'},
          // anything the user encoded themselves wins
          ...encoding,
        },
      },
      // drop the flag from the config too, or the expanded spec matches again and recurses
      {...normParams, config: {...config, array: omit(config.array, ['axis'])}},
    );
  }
}
