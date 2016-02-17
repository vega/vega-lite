export interface UnitConfig {
  width?: number;
  height?: number;

  clip?: boolean;

  // FILL_STROKE_CONFIG
  /**
   * @format color
   */
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity? :number;
  strokeDash?: number;
  /** The offset (in pixels) into which to begin drawing with the stroke dash array. */
  strokeDashOffset?: number;
}

export const defaultUnitConfig: UnitConfig = {
  width: 200,
  height: 200
};

export const defaultFacetUnitConfig: UnitConfig = {
  stroke: '#ccc',
  strokeWidth: 1
};
