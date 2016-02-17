export interface Data {
  formatType?: string;
  url?: string;
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
      description: 'Pass array of objects instead of a url to a file.',
      items: {
        type: 'object',
        additionalProperties: true
      }
    }
  }
};
