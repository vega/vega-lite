
import {VgProjectionType} from './vega.schema';

export type ProjectionType = VgProjectionType;

export interface Projection {
  /**
   * The type of the projection. The default is "mercator".
   */
  type?: ProjectionType;
  /**
   * The clip angle of the projection. The default is `null`.
   */
  clipAngle?: number;
  /**
   * Sets the projection’s viewport clip extent to the specified bounds in pixels. The default is `null`.
   */
  clipExtent?: number[][];
  /**
   * The center of the projection. The default is `[0, 0]`.
   */
  center?: number[];
  /**
   * The rotation of the projection. The default is `[0, 0, 0]`.
   */
  rotate?: number[];
  /**
   * The desired precision of the projection. If precision is not specified, returns the projection’s current resampling precision which defaults to √0.5 ≅ 0.70710….
   */
  precision?: String;
}

/**
 * Any property of Projection can be in config
 */
export interface ProjectionConfig extends Projection { }

export const PROJECTION_PROPERTIES: (keyof Projection)[] = [
  'type',
  'clipAngle',
  'clipExtent',
  'center',
  'rotate',
  'precision'
];
