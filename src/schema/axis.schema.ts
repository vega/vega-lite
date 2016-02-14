import {duplicate} from '../util';
import {mergeDeep} from './schemautil';

export interface AxisConfig {
  // General
  layer?: string;
  offset?: number;
  orient?: string;

  // Grid
  grid?: boolean;

  // Labels
  labels?: boolean;
  labelAngle?: number;
  labelMaxLength?: number;
  shortTimeLabels?: boolean;

  // Ticks
  subdivide?: number;
  ticks?: number;
  tickPadding?: number;
  tickSize?: number;
  tickSizeMajor?: number;
  tickSizeMinor?: number;
  tickSizeEnd?: number;

  // Title
  titleOffset?: number;
  titleMaxLength?: number;
  characterWidth?: number;

  properties?: any; // TODO: replace
}

export const defaultAxisConfig: AxisConfig = {
  labels: true,
  labelMaxLength: 25,
  characterWidth: 6
};

export const defaultFacetAxisConfig: AxisConfig = {
  labels: true,
  grid: false,
  tickSize: 0
};

export interface AxisProperties extends AxisConfig {
  format?: string; // default value determined by config.format anyway
  title?: string;
  values?: number[];
}

export const axisConfig = {
  type: 'object',
  properties: {
    // General
    layer: {
      type: 'string',
      description: 'A string indicating if the axis (and any gridlines) should be placed above or below the data marks.'
    },
    offset: {
      type: 'number',
      description: 'The offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle.'
    },
    orient: {
      type: 'string',
      enum: ['top', 'right', 'left', 'bottom'],
      description: 'The orientation of the axis. One of top, bottom, left or right. The orientation can be used to further specialize the axis type (e.g., a y axis oriented for the right edge of the chart).'
    },

    // grid
    grid: {
      type: 'boolean',
      description: 'A flag indicate if gridlines should be created in addition to ticks. If `grid` is unspecified, the default value is `true` for ROW and COL. For X and Y, the default value is `true` for quantitative and time fields and `false` otherwise.'
    },
    // Labels
    labels: {
      type: 'boolean',
      description: 'Enable or disable labels.'
    },
    labelAngle: {
      type: 'number',
      description: 'The rotation angle of the axis labels.'
    },
    labelMaxLength: {
      type: 'integer',
      minimum: 1,
      description: 'Truncate labels that are too long.'
    },
    shortTimeLabels: {
      type: 'boolean',
      description: 'Whether month and day names should be abbreviated.'
    },

    // Ticks
    subdivide: {
      type: 'number',
      description: 'If provided, sets the number of minor ticks between major ticks (the value 9 results in decimal subdivision). Only applicable for axes visualizing quantitative scales.'
    },
    ticks: {
      type: 'integer',
      minimum: 0,
      description: 'A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale\'s range.'
    },
    tickPadding: {
      type: 'integer',
      description: 'The padding, in pixels, between ticks and text labels.'
    },
    tickSize: {
      type: 'integer',
      minimum: 0,
      description: 'The size, in pixels, of major, minor and end ticks.'
    },
    tickSizeMajor: {
      type: 'integer',
      minimum: 0,
      description: 'The size, in pixels, of major ticks.'
    },
    tickSizeMinor: {
      type: 'integer',
      minimum: 0,
      description: 'The size, in pixels, of minor ticks.'
    },
    tickSizeEnd: {
      type: 'integer',
      minimum: 0,
      description: 'The size, in pixels, of end ticks.'
    },

    // Title
    titleOffset: {
      type: 'integer',
      description: 'A title offset value for the axis.'
    },
    titleMaxLength: {
      type: 'integer',
      minimum: 0,
      description: 'Max length for axis title if the title is automatically generated from the field\'s description.' +
      'By default, this is automatically based on cell size and characterWidth property.'
    },
    characterWidth: {
      type: 'integer',
      description: 'Character width for automatically determining title max length.'
    },

    // TODO: replace
    properties: {
      type: 'object',
      description: 'Optional mark property definitions for custom axis styling.'
    }
  }
};

const axisProperties = mergeDeep(duplicate(axisConfig), {
  properties: {
    // Labels
    format: {
      type: 'string',
      description: 'The formatting pattern for axis labels. If undefined, a good format is automatically determined. Vega-Lite uses D3\'s format pattern and automatically switches to datetime formatters.'
    },
    title: {
      type: 'string',
      description: 'A title for the axis. (Shows field name and its function by default.)'
    },
    values: {
      type: 'array',
    }
  }
});

export var axis = {
  oneOf: [
    axisProperties,
    {type: 'boolean'}]
};
