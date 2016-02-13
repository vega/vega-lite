import {duplicate} from '../util';
import {mergeDeep} from './schemautil';

export interface LegendConfig {
  orient?: string;
  shortTimeLabels?: boolean;
  properties?: any; // TODO(#975) replace with config properties
}

export interface LegendProperties extends LegendConfig {
  format?: string; // default value determined by config.format anyway
  title?: string;
  values?: Array<any>;
}

export const defaultLegendConfig: LegendConfig = {};

export const legendConfig = {
  type: 'object',
  properties: {
    orient: {
      type: 'string',
      description: 'The orientation of the legend. One of "left" or "right". This determines how the legend is positioned within the scene. The default is "right".'
    },
    shortTimeLabels: {
      type: 'boolean',
      description: 'Whether month names and weekday names should be abbreviated.'
    },
    properties: {
      type: 'object',
      description: 'Optional mark property definitions for custom legend styling. '
    }
  }
};

const legendProperties = mergeDeep(duplicate(legendConfig), {
  properties: {
    format: {
      type: 'string',
      description: 'An optional formatting pattern for legend labels. Vega uses D3\'s format pattern.'
    },
    title: {
      type: 'string',
      description: 'A title for the legend. (Shows field name and its function by default.)'
    },
    values: {
      type: 'array',
      description: 'Explicitly set the visible legend values.'
    }
  }
});

export var legend = {
  description: 'Properties of a legend or boolean flag for determining whether to show it.',
  oneOf: [
    legendProperties,
    {type: 'boolean'}]
};
