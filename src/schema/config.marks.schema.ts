export interface MarksConfig {
  filled?: boolean;
  format?: string;

  // General Vega
  opacity?: number;
  strokeWidth?: number;
  strokeDash?: number[];
  strokeDashOffset?: number[];
  fill?: string;

  // Bar / area
  orient?: string;
  // Line / area
  interpolate?: string;
  tension?: number;

  // Text-only
  align?: string;
  angle?: number;
  baseline?: string;
  dx?: number;
  dy?: number;
  radius?: number;
  theta?: number;
  font?: string;
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
    strokeDash: {
      type: 'array',
      default: undefined,
      description: 'An array of alternating stroke, space lengths for creating dashed or dotted lines.'
    },
    strokeDashOffset: {
      type: 'array',
      default: undefined,
      description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
    },

    // bar / area
    orient: {
      type: 'string',
      default: undefined,
      description: 'The orientation of this area mark. One of horizontal (the default) or vertical.'
    },

    // line / area
    interpolate: {
      type: 'string',
      default: undefined,
      // TODO better describe that some of them isn't supported in area
      description: 'The line interpolation method to use. One of linear, step-before, step-after, basis, basis-open, basis-closed, bundle, cardinal, cardinal-open, cardinal-closed, monotone.'
    },
    tension: {
      type: 'number',
      default: undefined,
      description: 'Depending on the interpolation type, sets the tension parameter.'
    },

    // text-only
    align: {
      type: 'string',
      default: 'right',
      enum: ['left', 'right', 'center'],
      description: 'The horizontal alignment of the text. One of left, right, center.'
    },
    angle: {
      type: 'number',
      default: undefined,
      description: 'The rotation angle of the text, in degrees.'
    },
    baseline: {
      type: 'string',
      default: 'middle',
      enum: ['top', 'middle', 'bottom'],
      description: 'The vertical alignment of the text. One of top, middle, bottom.'
    },
    dx: {
      type: 'number',
      default: undefined,
      description: 'The horizontal offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.'
    },
    dy: {
      type: 'number',
      default: undefined,
      description: 'The vertical offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.'
    },
    font: {
      type: 'string',
      default: undefined,
      role: 'font',
      description: 'The typeface to set the text in (e.g., Helvetica Neue).'
    },
    // fontSize excluded as we use size.value
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
    },
    radius: {
      type: 'number',
      default: undefined,
      description: 'Polar coordinate radial offset, in pixels, of the text label from the origin determined by the x and y properties.'
    },
    theta: {
      type: 'number',
      default: undefined,
      description: 'Polar coordinate angle, in radians, of the text label from the origin determined by the x and y properties. Values for theta follow the same convention of arc mark startAngle and endAngle properties: angles are measured in radians, with 0 indicating "north".'
    }
  }
};
