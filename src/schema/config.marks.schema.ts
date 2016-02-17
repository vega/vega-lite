export interface MarkConfig {
  // Vega-Lite Specific
  filled?: boolean;
  color?: string;
  barWidth?: number;
  tickWidth?: number;
  stacked?: string;

  // General Vega
  opacity?: number;
  strokeWidth?: number;
  strokeDash?: number[];
  strokeDashOffset?: number[];
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeOpacity?: number;


  // Bar, Tick, Line, Area
  orient?: string;
  // Line / area
  interpolate?: string;
  tension?: number;

  // Point / Square / Circle
  shape?: string;
  size?: number;

  // Tick-only
  thickness?: number;

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
  shortTimeLabels?: boolean;
  text?: string;

  applyColorToBackground?: boolean;
}

export const defaultMarkConfig: MarkConfig = {
  color: '#4682b4',
  strokeWidth: 2,
  size: 30,
  thickness: 1,

  fontSize: 10,
  baseline: 'middle',
  text: 'Abc',

  shortTimeLabels: false,
  applyColorToBackground: false
};

export const markConfig = {
  type: 'object',
  properties: {
    // Vega-Lite special
    filled: {
      type: 'boolean',
      description: 'Whether the shape\'s color should be used as fill color instead of stroke color. ' +
        'This is only applicable for "bar", "point", and "area". ' +
        'All marks except "point" marks are filled by default.'
    },
    color: {
      type: 'string',
      format: 'color',
      description: 'Default color.'
    },
    barWidth: {
      type: 'number',
      description: 'The width of the bars.  If unspecified, the default width is  `bandWidth-1`, which provides 1 pixel offset between bars.'
    },
    tickWidth: {
      type: 'string',
      format: 'color',
      description: 'The width of the ticks.'
    },
    stacked: {
      type: 'string',
      enum: ['zero', 'center', 'normalize', 'none'],
    },
    // General Vega
    fill: {
      type: 'string',
      format: 'color',
    },
    fillOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1
    },
    stroke: {
      type: 'string',
      format: 'color',
    },
    strokeOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1
    },
    opacity: {
      type: 'number',
      minimum: 0,
      maximum: 1
    },
    strokeWidth: {
      type: 'number',
      minimum: 0
    },
    strokeDash: {
      type: 'array',
      description: 'An array of alternating stroke, space lengths for creating dashed or dotted lines.'
    },
    strokeDashOffset: {
      type: 'array',
      description: 'The offset (in pixels) into which to begin drawing with the stroke dash array.'
    },

    // Bar, Tick, Line, Area
    orient: {
      type: 'string',
      description: 'The orientation of a non-stacked bar, tick, area, and line charts.' +
       'The value is either horizontal (default) or vertical.' +
       'For bar and tick, this determines whether the size of the bar and tick should be applied to x or y dimension.' +
       'For area, this property determines the orient property of the Vega output.' +
       'For line, this property determines the sort order of the points in the line if `config.sortLineBy` is not specified.' +
       'For stacked charts, this is always determined by the orientation of the stack; ' +
       'therefore explicitly specified value will be ignored.'
    },

    // line / area
    interpolate: {
      type: 'string',
      // TODO better describe that some of them isn't supported in area
      description: 'The line interpolation method to use. One of linear, step-before, step-after, basis, basis-open, basis-closed, bundle, cardinal, cardinal-open, cardinal-closed, monotone.'
    },
    tension: {
      type: 'number',
      description: 'Depending on the interpolation type, sets the tension parameter.'
    },

    // point
    shape: {
      type: 'number',
      enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
      description: 'The symbol shape to use. One of circle (default), square, cross, diamond, triangle-up, or triangle-down.'
    },
    // point / circle / square
    size: {
      type: 'number',
      description: 'The pixel area each the point. For example: in the case of circles, the radius is determined in part by the square root of the size value.'
    },

    // Tick-only
    thickness: {
      type: 'number',
      description: 'Thickness of the tick mark.'
    },

    // text-only
    align: {
      type: 'string',
      enum: ['left', 'right', 'center'],
      description: 'The horizontal alignment of the text. One of left, right, center.'
    },
    angle: {
      type: 'number',
      description: 'The rotation angle of the text, in degrees.'
    },
    baseline: {
      type: 'string',
      enum: ['top', 'middle', 'bottom'],
      description: 'The vertical alignment of the text. One of top, middle, bottom.'
    },
    dx: {
      type: 'number',
      description: 'The horizontal offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.'
    },
    dy: {
      type: 'number',
      description: 'The vertical offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the angle property.'
    },
    font: {
      type: 'string',
      format: 'font',
      description: 'The typeface to set the text in (e.g., Helvetica Neue).'
    },
    fontSize: {
      type: 'number',
      description: 'The font size, in pixels.'
    },
    // fontSize excluded as we use size.value
    fontStyle: {
      type: 'string',
      enum: ['normal', 'italic'],
      description: 'The font style (e.g., italic).'
    },
    fontWeight: {
      type: 'string',
      enum: ['normal', 'bold'],
      description: 'The font weight (e.g., bold).'
    },
    radius: {
      type: 'number',
      description: 'Polar coordinate radial offset, in pixels, of the text label from the origin determined by the x and y properties.'
    },
    theta: {
      type: 'number',
      description: 'Polar coordinate angle, in radians, of the text label from the origin determined by the x and y properties. Values for theta follow the same convention of arc mark startAngle and endAngle properties: angles are measured in radians, with 0 indicating "north".'
    },
    text: {
      type: 'string',
      description: 'Placeholder Text'
    },
    // text-only & VL only
    format: {
      type: 'string',
      description: 'The formatting pattern for text value. If not defined, this will be determined automatically. '
    },
    shortTimeLabels: {
      type: 'boolean',
      description: 'Whether month names and weekday names should be abbreviated.'
    },
    applyColorToBackground: {
      type: 'boolean',
      description: 'Apply color field to background color instead of the text.'
    }
  }
};
