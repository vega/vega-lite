export interface Axis {
  // Vega Axis Properties
  format?: string;
  grid?: boolean;
  layer?: string;
  orient?: string;
  ticks?: number;
  title?: string;
  tickSize?: number;
  offset?: number;
  shortTimeNames?: boolean;
  // Vega-Lite only
  labelMaxLength?: number;
  titleMaxLength?: number;
  titleOffset?: number;
  properties?: any; // TODO: declare VgAxisProperties
}

export var axis = {
  type: 'object',
  properties: {
    /* Vega Axis Properties */
    format: {
      type: 'string',
      default: undefined,  // auto
      description: 'The formatting pattern for axis labels. '+
                   'If not undefined, this will be determined by ' +
                   'the max value ' +
                   'of the field.'
    },
    grid: {
      type: 'boolean',
      default: undefined,
      description: 'A flag indicate if gridlines should be created in addition to ticks. If `grid` is unspecified, the default value is `true` for ROW and COL. For X and Y, the default value is `true` for quantitative and time fields and `false` otherwise.'
    },
    layer: {
      type: 'string',
      default: undefined,
      description: 'A string indicating if the axis (and any gridlines) should be placed above or below the data marks.'
    },
    orient: {
      type: 'string',
      default: undefined,
      enum: ['top', 'right', 'left', 'bottom'],
      description: 'The orientation of the axis. One of top, bottom, left or right. The orientation can be used to further specialize the axis type (e.g., a y axis oriented for the right edge of the chart).'
    },
    ticks: {
      type: 'integer',
      default: undefined,
      minimum: 0,
      description: 'A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale\'s range.'
    },
    /* Vega Axis Properties that are automatically populated by Vega-lite */
    title: {
      type: 'string',
      default: undefined,
      description: 'A title for the axis. (Shows field name and its function by default.)'
    },
    /* Vega-lite only */
    labelMaxLength: {
      type: 'integer',
      default: 25,
      minimum: 0,
      description: 'Truncate labels that are too long.'
    },
    titleMaxLength: {
      type: 'integer',
      default: undefined,
      minimum: 0,
      description: 'Max length for axis title if the title is automatically generated from the field\'s description'
    },
    titleOffset: {
      type: 'integer',
      default: undefined,  // auto
      description: 'A title offset value for the axis.'
    },
    shortTimeNames: {
      type: 'boolean',
      default: false,
      description: 'Whether month names and weekday names should be abbreviated.'
    },
    properties: {
      type: 'object',
      default: undefined,
      description: 'Optional mark property definitions for custom axis styling.'
    }
  }
};
