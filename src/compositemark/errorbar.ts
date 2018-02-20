import {Field} from '../fielddef';
import {Encoding} from './../encoding';
import {GenericUnitSpec, LayerSpec} from './../spec';


export const ERRORBAR: 'error-bar' = 'error-bar';
export type ERRORBAR = typeof ERRORBAR;

export function normalizeErrorBar(spec: GenericUnitSpec<Encoding<Field>, ERRORBAR>): LayerSpec {
  // TODO: use selection
  const {mark: _m, selection: _sel, projection: _p, encoding, ...outerSpec} = spec;
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
}
