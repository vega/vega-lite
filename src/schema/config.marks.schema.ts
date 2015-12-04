export interface MarksConfig {
  filled?: boolean;
  format?: string;

  // General Vega
  opacity?: number;
  strokeWidth?: number;
  fill?: string;

  // Text-only
  align?: string;
  baseline?: string;
  font?: string;
  fontSize?: number;
  fontStyle?: string;
  fontWeight?: string;
}

export const marksConfig = {
  type: 'object',
  properties: {
    // Vega-Lite special
    filled: {
      type: 'boolean',
      default: false,
      description: 'Whether the shape\'s color should be used as fill color instead of stroke color.'
    },
    format: {
      type: 'string',
      default: '',  // auto
      description: 'The formatting pattern for text value.'+
                   'If not defined, this will be determined automatically'
    },

    // General Vega
    // TODO consider removing as it is conflicting with color.value
    fill: {
      type: 'string',
      role: 'color',
      default: '#000000'
    },
    opacity: {
      type: 'number',
      default: undefined,  // auto
      minimum: 0,
      maximum: 1
    },
    strokeWidth: {
      type: 'integer',
      default: 2,
      minimum: 0
    },

    // text-only
    align: {
      type: 'string',
      default: 'right',
      enum: ['left', 'right', 'center'],
      description: 'The horizontal alignment of the text. One of left, right, center.'
    },
    baseline: {
      type: 'string',
      default: 'middle',
      enum: ['top', 'middle', 'bottom'],
      description: 'The vertical alignment of the text. One of top, middle, bottom.'
    },
    // TODO dx, dy, radius, theta, angle

    font: {
      type: 'string',
      default: undefined,
      role: 'font',
      description: 'The typeface to set the text in (e.g., Helvetica Neue).'
    },
    fontSize: {
      type: 'integer',
      default: undefined,
      minimum: 0,
      description: 'The font size, in pixels.'
    },
    fontStyle: {
      type: 'string',
      default: undefined,
      enum: ['normal', 'italic'],
      description: 'The font style (e.g., italic).'
    },
    fontWeight: {
      type: 'string',
      enum: ['normal', 'bold'],
      default: undefined,
      description: 'The font weight (e.g., bold).'
    }
  }
};
