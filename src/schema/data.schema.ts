export interface Data {
  formatType?: string;
  url?: string;
  values?: any[];
  filter?: string;
  calculate?: VgFormula[];
}

// TODO move this to one central position
export interface VgFormula {
  field: string;
  expr: string;
}

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
    calculate: {
      type: 'array',
      default: undefined,
      description: 'Calculate new field(s) using the provided expresssion(s). Calculation are applied before filter.',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            description: 'The field in which to store the computed formula value.'
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
