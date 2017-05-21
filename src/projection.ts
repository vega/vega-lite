import {VgProjectionType} from './vega.schema';

export type ProjectionType = VgProjectionType;

export interface Projection {
  /*
   * The type of the projection.
   */
  type?: ProjectionType;
  /*
   * The center of the projection.
   */
  center?: number[];
  /*
   * The translation of the projection.
   */
  translate?: number[];
  /*
   * The scale of the projection.
   */
  zoom?: number;
  /**
   * The rotation of the projection.
   */
  rotate?: number[];
  /*
   * The desired precision of the projection.
   */
  precision?: String;
  /*
   * The clip angle of the projection.
   */
  clipAngle?: number;
  /*
   * Sets the projection’s scale factor to the specified value
   */
  scale?: number;
  /*
   * Sets the projection’s viewport clip extent to the specified bounds in pixels
   */
  clipExtent?: number[];
}

/*
 * Any property of Projection can be in config
 */
export interface ProjectionConfig extends Projection {}

export const PROJECTION_PROPERTIES: (keyof Projection)[] = [
  'type',
  'center',
  'translate',
  'zoom',
  'rotate',
  'precision',
  'clipAngle',
  'scale',
  'clipExtent'
];
