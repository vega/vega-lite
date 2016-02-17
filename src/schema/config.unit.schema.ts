export interface UnitConfig {
  width?: number;
  height?: number;

  clip?: boolean;

  // FILL_STROKE_CONFIG
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

export const unitConfig = {
  type: 'object',
  properties: {
    width: {
      type: 'integer'
    },
    height: {
      type: 'integer'
    },
    // Group properties
    clip: {
      type: 'boolean',
    },
    // FILL_STROKE_CONFIG
    fill: {
      type: 'string',
      format: 'color'
    },
    fillOpacity: {
      type: 'number',
    },
    stroke: {
      type: 'string',
      format: 'color'
    },
    strokeWidth: {
      type: 'integer'
    },
    strokeOpacity: {
      type: 'number'
    },
    strokeDash: {
      type: 'array',
    },
    strokeDashOffset: {
      type: 'integer'
    }
  }
};
