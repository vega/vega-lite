import {DataFormat} from '../enums';

export interface Data {

  formatType?: DataFormat;
  url?: string;
  /**
   * Pass array of objects instead of a url to a file.
   */
  values?: any[];
}
