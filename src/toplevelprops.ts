/**
 * @minimum 0
 */
export type Padding = number | {top?: number, bottom?: number, left?: number, right?: number};

export interface TopLevelProperties {
  /**
   * CSS color property to use as the background of visualization.
   *
   * __Default value:__ none (transparent)
   */
  background?: string;

  /**
   * The default visualization padding, in pixels, from the edge of the visualization canvas to the data rectangle.  If a number, specifies padding for all sides.
   * If an object, the value should have the format `{"left": 5, "top": 5, "right": 5, "bottom": 5}` to specify padding for each side of the visualization.
   *
   * __Default value__: `5`
   */
  padding?: Padding;

  /**
   * Resize is a boolean indicating if autosize layout should be re-calculated on every update.
   *
   * __Default value__: `false`
   */
  autoResize?: boolean;
}

const TOP_LEVEL_PROPERTIES: (keyof TopLevelProperties)[] = [
  'background', 'padding', 'autoResize'
];

export function extractTopLevelProperties<T extends TopLevelProperties>(t: T) {
  return TOP_LEVEL_PROPERTIES.reduce((o, p) => {
    if (t && t[p] !== undefined) {
      o[p] = t[p];
    }
    return o;
  }, {});
}
