import { VgData } from './vega.schema';
export declare type ParseValue = null | string | 'string' | 'boolean' | 'date' | 'number';
export interface Parse {
    [field: string]: ParseValue;
}
export interface DataFormatBase {
    /**
     * If set to `null`, disable type inference based on the spec and only use type inference based on the data.
     * Alternatively, a parsing directive object can be provided for explicit data types. Each property of the object corresponds to a field name, and the value to the desired data type (one of `"number"`, `"boolean"`, `"date"`, or null (do not parse the field)).
     * For example, `"parse": {"modified_on": "date"}` parses the `modified_on` field in each input record a Date value.
     *
     * For `"date"`, we parse data based using Javascript's [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
     * For Specific date formats can be provided (e.g., `{foo: 'date:"%m%d%Y"'}`), using the [d3-time-format syntax](https://github.com/d3/d3-time-format#locale_format). UTC date format parsing is supported similarly (e.g., `{foo: 'utc:"%m%d%Y"'}`). See more about [UTC time](https://vega.github.io/vega-lite/docs/timeunit.html#utc)
     */
    parse?: Parse | null;
}
export interface CsvDataFormat extends DataFormatBase {
    /**
     * Type of input data: `"json"`, `"csv"`, `"tsv"`, `"dsv"`.
     * The default format type is determined by the extension of the file URL.
     * If no extension is detected, `"json"` will be used by default.
     */
    type?: 'csv' | 'tsv';
}
export interface DsvDataFormat extends DataFormatBase {
    /**
     * Type of input data: `"json"`, `"csv"`, `"tsv"`, `"dsv"`.
     * The default format type is determined by the extension of the file URL.
     * If no extension is detected, `"json"` will be used by default.
     */
    type?: 'dsv';
    /**
     * The delimiter between records. The delimiter must be a single character (i.e., a single 16-bit code unit); so, ASCII delimiters are fine, but emoji delimiters are not.
     *
     * @minLength 1
     * @maxLength 1
     */
    delimiter: string;
}
export interface JsonDataFormat extends DataFormatBase {
    /**
     * Type of input data: `"json"`, `"csv"`, `"tsv"`, `"dsv"`.
     * The default format type is determined by the extension of the file URL.
     * If no extension is detected, `"json"` will be used by default.
     */
    type?: 'json';
    /**
     * The JSON property containing the desired data.
     * This parameter can be used when the loaded JSON file may have surrounding structure or meta-data.
     * For example `"property": "values.features"` is equivalent to retrieving `json.values.features`
     * from the loaded JSON object.
     */
    property?: string;
}
export interface TopoDataFormat extends DataFormatBase {
    /**
     * Type of input data: `"json"`, `"csv"`, `"tsv"`, `"dsv"`.
     * The default format type is determined by the extension of the file URL.
     * If no extension is detected, `"json"` will be used by default.
     */
    type?: 'topojson';
    /**
     * The name of the TopoJSON object set to convert to a GeoJSON feature collection.
     * For example, in a map of the world, there may be an object set named `"countries"`.
     * Using the feature property, we can extract this set and generate a GeoJSON feature object for each country.
     */
    feature?: string;
    /**
     * The name of the TopoJSON object set to convert to mesh.
     * Similar to the `feature` option, `mesh` extracts a named TopoJSON object set.
     *  Unlike the `feature` option, the corresponding geo data is returned as a single, unified mesh instance, not as individual GeoJSON features.
     * Extracting a mesh is useful for more efficiently drawing borders or other geographic elements that you do not need to associate with specific regions such as individual countries, states or counties.
     */
    mesh?: string;
}
export declare type DataFormat = CsvDataFormat | DsvDataFormat | JsonDataFormat | TopoDataFormat;
export declare type DataFormatType = 'json' | 'csv' | 'tsv' | 'dsv' | 'topojson';
export declare type Data = UrlData | InlineData | NamedData;
export declare type InlineDataset = number[] | string[] | boolean[] | object[] | string | object;
export interface DataBase {
    /**
     * An object that specifies the format for parsing the data.
     */
    format?: DataFormat;
    /**
     * Provide a placeholder name and bind data at runtime.
     */
    name?: string;
}
export interface UrlData extends DataBase {
    /**
     * An URL from which to load the data set. Use the `format.type` property
     * to ensure the loaded data is correctly parsed.
     */
    url: string;
}
export interface InlineData extends DataBase {
    /**
     * The full data set, included inline. This can be an array of objects or primitive values, an object, or a string.
     * Arrays of primitive values are ingested as objects with a `data` property. Strings are parsed according to the specified format type.
     */
    values: InlineDataset;
}
export interface NamedData extends DataBase {
    /**
     * Provide a placeholder name and bind data at runtime.
     */
    name: string;
}
export declare function isUrlData(data: Partial<Data> | Partial<VgData>): data is UrlData;
export declare function isInlineData(data: Partial<Data> | Partial<VgData>): data is InlineData;
export declare function isNamedData(data: Partial<Data> | Partial<VgData>): data is NamedData;
export declare type DataSourceType = 'raw' | 'main' | 'row' | 'column' | 'lookup';
export declare const MAIN: 'main';
export declare const RAW: 'raw';
