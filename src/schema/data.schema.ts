export var data = {
  type: 'object',
  properties: {
    // data source
    formatType: {
      type: 'string',
      enum: ['json', 'csv', 'tsv'],
      default: 'json'
    },
    url: {
      type: 'string',
      default: undefined
    },
    values: {
      type: 'array',
      default: undefined,
      description: 'Pass array of objects instead of a url to a file.',
      items: {
        type: 'object',
        additionalProperties: true
      }
    },
    // we generate a vega filter transform
    filter: {
      type: 'string',
      default: undefined,
      description: 'A string containing the filter Vega expression. Use `datum` to refer to the current data object.'
    },
    // we generate a vega formula transform
    formulas: {
      type: 'array',
      default: undefined,
      description: 'Array of formula transforms. Formulas are applied before filter.',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            description: 'The property name in which to store the computed formula value.'
          },
          expr: {
            type: 'string',
            description: 'A string containing an expression for the formula. Use the variable `datum` to to refer to the current data object.'
          }
        }
      }
    }
  }
};
