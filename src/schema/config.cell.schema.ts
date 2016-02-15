export interface CellConfig {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity? :number;
  strokeDash?: number;
  strokeDashOffset?: number;
}

export const defaultCellConfig: CellConfig = {
  fill: 'rgba(0,0,0,0)',
  stroke: '#ccc',
  strokeWidth: 1
};

export const cellConfig = {
  type: 'object',
  properties: {
    // Group properties
    clip: {
      type: 'boolean',
    },
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
      type: 'integer',
      description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
    }
  }
};
