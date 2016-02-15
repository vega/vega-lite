export interface SceneConfig {
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity? :number;
  strokeDash?: number;
  strokeDashOffset?: number;
}

export const sceneConfig = {
  type: 'object',
  properties: {
    fill: {
      type: 'string',
      format: 'color'
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
      type: 'array'
    },
    strokeDashOffset: {
      type: 'integer',
      description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
    }
  }
};
