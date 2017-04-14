import {Encoding} from './encoding';
import {isMarkDef, MarkDef} from './mark';
import {GenericUnitSpec, LayerSpec} from './spec';

export const ERRORBAR: 'error-bar' = 'error-bar';
export type ERRORBAR = typeof ERRORBAR;

export type UnitNormalizer = (spec: GenericUnitSpec<any, any>)=> LayerSpec;

/**
 * Registry index for all composite mark's normalizer
 */
const normalizerRegistry: {[mark: string]: UnitNormalizer} = {};

export function add(mark: string, normalizer: UnitNormalizer) {
  normalizerRegistry[mark] = normalizer;
}

export function remove(mark: string) {
  delete normalizerRegistry[mark];
}

/**
 * Transform a unit spec with composite mark into a normal layer spec.
 */
export function normalize(
    // This GenericUnitSpec has any as Encoding because unit specs with composite mark can have additional encoding channels.
    spec: GenericUnitSpec<string | MarkDef, any>
  ): LayerSpec {

  const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
  const normalizer = normalizerRegistry[mark];
  if (normalizer) {
    return normalizer(spec);
  }

  throw new Error(`Unregistered composite mark ${mark}`);
}


add(ERRORBAR, (spec: GenericUnitSpec<ERRORBAR, Encoding>): LayerSpec => {
  const {mark: _m, encoding: encoding, ...outerSpec} = spec;
  const {size: _s, ...encodingWithoutSize} = encoding;
  const {x2: _x2, y2: _y2, ...encodingWithoutX2Y2} = encoding;
  const {x: _x, y: _y, ...encodingWithoutX_X2_Y_Y2} = encodingWithoutX2Y2;

  if (!encoding.x2 && !encoding.y2) {
    throw new Error('Neither x2 or y2 provided');
  }

  return {
    ...outerSpec,
    layer: [
      {
        mark: 'rule',
        encoding: encodingWithoutSize
      },{ // Lower tick
        mark: 'tick',
        encoding: encodingWithoutX2Y2
      }, { // Upper tick
        mark: 'tick',
        encoding: encoding.x2 ? {
          x: encoding.x2,
          y: encoding.y,
          ...encodingWithoutX_X2_Y_Y2
        } : {
          x: encoding.x,
          y: encoding.y2,
          ...encodingWithoutX_X2_Y_Y2
        }
      }
    ]
  };
});
