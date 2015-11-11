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
    }
  }
};
