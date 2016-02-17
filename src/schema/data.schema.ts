export interface Data {
  formatType?: string;
  url?: string;
  /** Pass array of objects instead of a url to a file. */
  values?: any[];
}

export var data = {
  type: 'object',
  properties: {
    // data source
    formatType: {
      type: 'string',
      enum: ['json', 'csv', 'tsv']
    },
    url: {
      type: 'string'
    },
    values: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true
      }
    }
  }
};
