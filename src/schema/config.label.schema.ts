export interface LabelConfig {
  // TODO: add additional label config here
  // e.g., inset label for bar

  // Color & Opacity
  opacity?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  strokeDash?: number[];
  strokeDashOffset?: number[];

  // Text-only
  align?: string;
  angle?: number;
  baseline?: string;
  dx?: number;
  dy?: number;
  radius?: number;
  theta?: number;
  font?: string;
  fontSize?: number;
  fontStyle?: string;
  fontWeight?: string;
  // Vega-Lite only for text only
  format?: string;
}

export const labelConfig = {
  type: 'object',
  properties: {
    // General Vega
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
    fontSize: {
      type: 'number',
      default: 10,
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
    },
    // TODO: consider adding format (just like marks)
    // but let's wait until @kanitw stabilize numberFormat issue
  }
};
