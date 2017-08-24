export interface DataFormat {
    /**
     * If set to auto (the default), perform automatic type inference to determine the desired data types.
     * Alternatively, a parsing directive object can be provided for explicit data types. Each property of the object corresponds to a field name, and the value to the desired data type (one of `"number"`, `"boolean"` or `"date"`).
     * For example, `"parse": {"modified_on": "date"}` parses the `modified_on` field in each input record a Date value.
     *
     * For `"date"`, we parse data based using Javascript's [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
     * For Specific date formats can be provided (e.g., `{foo: 'date:"%m%d%Y"'}`), using the [d3-time-format syntax](https://github.com/d3/d3-time-format#locale_format). UTC date format parsing is supported similarly (e.g., `{foo: 'utc:"%m%d%Y"'}`). See more about [UTC time](timeunit.html#utc)
     */
    parse?: 'auto' | object;
    /**
     * The JSON property containing the desired data.
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
     * The name of the TopoJSON object set to convert to mesh.
     * Similar to the `feature` option, `mesh` extracts a named TopoJSON object set.
     *  Unlike the `feature` option, the corresponding geo data is returned as a single, unified mesh instance, not as individual GeoJSON features.
     * Extracting a mesh is useful for more efficiently drawing borders or other geographic elements that you do not need to associate with specific regions such as individual countries, states or counties.
     */
    mesh?: string;
}
export interface DataUrlFormat extends DataFormat {
    /**
     * Type of input data: `"json"`, `"csv"`, `"tsv"`.
     * The default format type is determined by the extension of the file URL.
     * If no extension is detected, `"json"` will be used by default.
     */
    type?: DataFormatType;
}
export declare type DataFormatType = 'json' | 'csv' | 'tsv' | 'topojson';
export declare type Data = UrlData | InlineData | NamedData;
export interface UrlData {
    /**
     * An object that specifies the format for parsing the data file.
     */
    format?: DataUrlFormat;
    /**
     * An URL from which to load the data set. Use the `format.type` property
     * to ensure the loaded data is correctly parsed.
     */
    url: string;
}
export interface InlineData {
    /**
     * An object that specifies the format for parsing the data values.
     */
    format?: DataFormat;
    /**
     * The full data set, included inline. This can be an array of objects or primitive values.
     * Arrays of primitive values are ingested as objects with a `data` property.
     */
    values: any[];
}
export interface NamedData {
    /**
     * An object that specifies the format for parsing the data.
     */
    format?: DataFormat;
    /**
     * Provide a placeholder name and bind data at runtime.
     */
    name: string;
}
export declare function isUrlData(data: Partial<Data>): data is UrlData;
export declare function isInlineData(data: Partial<Data>): data is InlineData;
export declare function isNamedData(data: Partial<Data>): data is NamedData;
export declare type DataSourceType = 'raw' | 'main' | 'row' | 'column' | 'lookup';
export declare const MAIN: 'main';
export declare const RAW: 'raw';
