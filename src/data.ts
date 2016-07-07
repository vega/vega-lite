/*
 * Constants and utilities for data.
 */
import {Type} from './type';

export interface DataFormat {
  /**
   * Type of input data: `"json"`, `"csv"`, `"tsv"`.
   * The default format type is determined by the extension of the file url.
   * If no extension is detected, `"json"` will be used by default.
   */
  type?: DataFormatType;

  /**
   * JSON only) The JSON property containing the desired data.
   * This parameter can be used when the loaded JSON file may have surrounding structure or meta-data.
   * For example `"property": "values.features"` is equivalent to retrieving `json.values.features`
   * from the loaded JSON object.
   */
  property?: string;

  /**
   * The name of the TopoJSON object set to convert to a GeoJSON feature collection.
   * For example, in a map of the world, there may be an object set named `"countries"`.
   * Using the feature property, we can extract this set and generate a GeoJSON feature object for each country.
   */
  feature?: string;
  /**
   * The name of the TopoJSON object set to convert to a mesh.
   * Similar to the `feature` option, `mesh` extracts a named TopoJSON object set.
   *  Unlike the `feature` option, the corresponding geo data is returned as a single, unified mesh instance, not as inidividual GeoJSON features.
   * Extracting a mesh is useful for more efficiently drawing borders or other geographic elements that you do not need to associate with specific regions such as individual countries, states or counties.
   */
  mesh?: string;
}

export enum DataFormatType {
    JSON = 'json' as any,
    CSV = 'csv' as any,
    TSV = 'tsv' as any,
    TOPOJSON = 'topojson' as any
}

export interface Data {
  /**
   * An object that specifies the format for the data file or values.
   */
  format?: DataFormat;

  /**
   * A URL from which to load the data set. Use the format.type property
   * to ensure the loaded data is correctly parsed.
   */
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
