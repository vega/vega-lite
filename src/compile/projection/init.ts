import {X, Y} from '../../channel';
import {Config} from '../../config';
import {channelIsProjection, Encoding} from '../../encoding';
import {Field, isFieldDef} from '../../fielddef';
import {GEOSHAPE, Mark} from '../../mark';
import {Projection} from '../../projection';
import {GenericLayerSpec, LayerSpec, UnitSpec} from '../../spec';
import {projections} from '../selection/interval';

export function initProjection(projection: Projection, parentProjection?: Projection, config?: Config, mark?: Mark, encoding?: Encoding<Field>): Projection {
  const projectionSpecified = !!projection;
  const isGeoshapeMark = mark && mark === GEOSHAPE;
  const hasEncodedProjection = encoding && [X, Y].some((channel) => channelIsProjection(encoding, channel));
  const inheritedProjection = !!parentProjection || !!(config && config.projection);

  if ((projectionSpecified) || (inheritedProjection && (isGeoshapeMark || hasEncodedProjection))) {
    return {
      ...config && config.projection ? config.projection : {},
      ...parentProjection ? parentProjection : {},
      ...projection ? projection : {},
    } as Projection;
  }
  return undefined;
}
