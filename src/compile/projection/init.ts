import {X, Y} from '../../channel';
import {Config} from '../../config';
import {Encoding} from '../../encoding';
import {Field, isFieldDef, isProjection} from '../../fielddef';
import {/*GEOSHAPE,*/ Mark} from '../../mark';
import {Projection} from '../../projection';
import {GenericLayerSpec, LayerSpec, UnitSpec} from '../../spec';
import {LATITUDE, LONGITUDE} from '../../type';
import {projections} from '../selection/interval';

export function initProjection(config: Config, projection: Projection = {}, parentProjection: Projection = {}, mark?: Mark, encoding?: Encoding<Field>): Projection {
  if (projection
  /*|| (mark && mark === GEOSHAPE)*/
    || (encoding && [X, Y].some((channel) => isProjection(encoding[channel])))) {
    return {
    ...config.projection,
    ...parentProjection,
    ...projection
  } as Projection;
  }
  return undefined;
}

/**
 * Return the first projection specified in an ordered arary of layers
 * @param {(LayerSpec | UnitSpec)[]} [layers=[]] aray of layers
 * @returns {Projection} first projection specified in layers
 */
export function initLayerProjection(layers: (LayerSpec | UnitSpec)[] = []): Projection {
  for (const layer of layers) {
    if (layer.projection) { return layer.projection; }
  }
  return undefined;
}
