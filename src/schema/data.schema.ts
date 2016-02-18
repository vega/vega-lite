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
