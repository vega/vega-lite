export declare type Padding = number | {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};
export interface TopLevelProperties {
    /**
     * CSS color property to use as background of visualization.
     *
     * __Default value:__ none (transparent)
     */
    background?: string;
    /**
     * The default visualization padding, in pixels, from the edge of the visualization canvas to the data rectangle. This can be a single number or an object with `"top"`, `"left"`, `"right"`, `"bottom"` properties.
     *
     * __Default value__: `5`
     *
     * @minimum 0
     */
    padding?: Padding;
}
export declare function extractTopLevelProperties<T extends TopLevelProperties>(t: T): {};
