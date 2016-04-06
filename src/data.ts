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

export enum DataTable {
  SOURCE = 'source' as any,
  SUMMARY = 'summary' as any,
  STACKED_SCALE = 'stacked_scale' as any,
  LAYOUT = 'layout' as any
}

export const SUMMARY = DataTable.SUMMARY;
export const SOURCE = DataTable.SOURCE;
export const STACKED_SCALE = DataTable.STACKED_SCALE;
export const LAYOUT = DataTable.LAYOUT;

/** Mapping from datalib's inferred type to Vega-lite's type */
// TODO: consider if we can remove
export const types = {
  'boolean': Type.NOMINAL,
  'number': Type.QUANTITATIVE,
  'integer': Type.QUANTITATIVE,
  'date': Type.TEMPORAL,
  'string': Type.NOMINAL
};
