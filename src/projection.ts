import type {BaseProjection, SignalRef, Vector2} from 'vega';
import {ExprRef} from './expr.js';
import {MapExcludeValueRefAndReplaceSignalWith, ProjectionType} from './vega.schema.js';

export interface Projection<ES extends ExprRef | SignalRef>
  extends MapExcludeValueRefAndReplaceSignalWith<BaseProjection, ES> {
  /**
   * The cartographic projection to use. This value is case-insensitive, for example `"albers"` and `"Albers"` indicate the same projection type. You can find all valid projection types [in the documentation](https://vega.github.io/vega-lite/docs/projection.html#projection-types).
   *
   * __Default value:__ `equalEarth`
   */
  type?: ProjectionType | ES; // Re-declare to override docs

  /**
   * The projection’s scale (zoom) factor, overriding automatic fitting. The default scale is projection-specific. The scale factor corresponds linearly to the distance between projected points; however, scale factor values are not equivalent across projections.
   */
  scale?: number | ES; // Re-declare to override docs

  /**
   * The projection’s translation offset as a two-element array `[tx, ty]`.
   */
  translate?: Vector2<number> | ES; // TODO: figure what's VL default value
}

/**
 * Any property of Projection can be in config
 */
export type ProjectionConfig = Projection<ExprRef>;

export const PROJECTION_PROPERTIES: (keyof Projection<ExprRef>)[] = [
  'type',
  'clipAngle',
  'clipExtent',
  'center',
  'rotate',
  'precision',
  'reflectX',
  'reflectY',
  'coefficient',
  'distance',
  'fraction',
  'lobes',
  'parallel',
  'radius',
  'ratio',
  'spacing',
  'tilt',
];
