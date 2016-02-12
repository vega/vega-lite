export interface CellConfig {
  gridColor?: string;
  gridOpacity?: number;
  gridOffset?: number;

  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity? :number;
  strokeDash?: number;
  strokeDashOffset?: number;
}

export const cellConfig = {
  type: 'object',
  properties: {
    gridColor: {
      type: 'string',
      format: 'color',
      default: '#000000'
    },
    gridOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.4
    },
    gridOffset: {
      type: 'number',
      default: 0
    },

    // Group properties
    clip: {
      type: 'boolean',
    },
    fill: {
      type: 'string',
      format: 'color',
      default: 'rgba(0,0,0,0)'
    },
    fillOpacity: {
      type: 'number',
    },
    stroke: {
      type: 'string',
      format: 'color',
    },
    strokeWidth: {
      type: 'integer'
    },
    strokeOpacity: {
      type: 'number'
    },
    strokeDash: {
      type: 'array',
      default: undefined
    },
    strokeDashOffset: {
      type: 'integer',
      description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
    }
  }
};
