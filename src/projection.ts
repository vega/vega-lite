import {VgProjectionType} from './vega.schema';

export type ProjectionType = VgProjectionType;

export interface Projection {
  /*
   * The type of the projection.
   */
  type?: ProjectionType;
  /*
   * The clip angle of the projection.
   */
  clipAngle?: number;
  /*
   * Sets the projection’s viewport clip extent to the specified bounds in pixels
   */
  clipExtent?: number[];
  /*
   * The center of the projection.
   */
  center?: number[];
  /**
   * The rotation of the projection.
   */
  rotate?: number[];
  /*
   * The desired precision of the projection.
   */
  precision?: String;
  /*
   * Used in conjunction with fit, provides the pixel area to which the projection should be automatically fit.
   */
  extent?: number[][];
  /*
   * Used in conjunction with fit, provides the width and height in pixels of the area to which the projection should be automatically fit.
   */
  size?: number[];
}

export const defaultProjectionConfig = {
  size: [300, 600]
};

/*
 * Any property of Projection can be in config
 */
export interface ProjectionConfig extends Projection {}

export const PROJECTION_PROPERTIES: (keyof Projection)[] = [
  'type',
  'clipAngle',
  'clipExtent',
  'center',
  'rotate',
  'precision',
  'extent',
  'size'
];
