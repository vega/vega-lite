export interface Data {

  /**
   * @enum ["json", "csv", "tsv"]
   */
  formatType?: string;
  url?: string;
  /**
   * Pass array of objects instead of a url to a file.
   */
  values?: any[];
}

export var data = {
  type: 'object',
  properties: {
    // data source
    formatType: {
      type: 'string'
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
