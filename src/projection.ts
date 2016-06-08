export interface Projection {
  /*
   * The type of the projection.
   */
  type?: string;
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
  rotate?: number;
  /*
   * The desired precision of the projection.
   */
  precision?: number;
  /*
   * The clip angle of the projection.
   */
  clipAngle?: number;
}
