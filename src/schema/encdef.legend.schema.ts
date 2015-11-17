export var legend = {
  type: 'object',
  description: 'Properties of a legend.',
  properties: {
    title: {
      type: 'string',
      default: undefined,
      description: 'A title for the legend. (Shows field name and its function by default.)'
    },
    orient: {
      type: 'string',
      default: 'right',
      description: 'The orientation of the legend. One of "left" or "right". This determines how the legend is positioned within the scene. The default is "right".'
    },
    format: {
      type: 'string',
      default: undefined,
      description: 'An optional formatting pattern for legend labels. Vega uses D3\'s format pattern.'
    },
    values: {
      type: 'array',
      default: undefined,
      description: 'Explicitly set the visible legend values.'
    },
    properties: {
      type: 'object',
      default: undefined,
      description: 'Optional mark property definitions for custom legend styling. '
    }
  }
};
