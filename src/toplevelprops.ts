
export type Padding = number | {top?: number, bottom?: number, left?: number, right?: number};
export interface TopLevelProperties {

  // Current we don't support autosize yet.  Once we do, we have to modify compile.ts to fix this.
  // autosize?: ...;

  /**
   * The width and height of the on-screen viewport, in pixels. If necessary, clipping and scrolling will be applied.
   */
  viewport?: number;
  /**
   * CSS color property to use as background of visualization. Default is `"transparent"`.
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

const TOP_LEVEL_PROPERTIES: (keyof TopLevelProperties)[] = [
  'viewport', 'background', 'padding'
];

export function extractTopLevelProperties<T extends TopLevelProperties>(t: T) {
  return TOP_LEVEL_PROPERTIES.reduce((o, p) => {
    if (t && t[p] !== undefined) {
      o[p] = t[p];
    }
    return o;
  }, {});
}
