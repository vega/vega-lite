/*
 * Constants and utilities for data.
 */
import {Type} from './type';

export enum DataFormat {
    JSON = 'json' as any,
    CSV = 'csv' as any,
    TSV = 'tsv' as any,
}

export interface Data {
  formatType?: DataFormat;
  url?: string;
  /**
   * Pass array of objects instead of a url to a file.
   */
  values?: any[];
}


export const SUMMARY = 'summary';
export const SOURCE = 'source';
export const STACKED_SCALE = 'stacked_scale';
export const LAYOUT = 'layout';

/** Mapping from datalib's inferred type to Vega-lite's type */
// TODO: consider if we can remove
export const types = {
  'boolean': Type.NOMINAL,
  'number': Type.QUANTITATIVE,
  'integer': Type.QUANTITATIVE,
  'date': Type.TEMPORAL,
  'string': Type.NOMINAL
};
