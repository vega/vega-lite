import {Anchor, Orient} from './vega.schema';

export interface Title {
  /**
   * The title text.
   */
  text: string;

  /**
   * The orientation of the title relative to the chart. One of `"top"` (the default), `"bottom"`, `"left"`, or `"right"`.
   */
  orient?: Orient;

  /**
   * The anchor position for placing the title. One of `"start"`, `"middle"` (the default), or `"end"`. For example, with an orientation of top these anchor positions map to a left-, center-, or right-aligned title.
   */
  anchor?: Anchor;

  /**
   * The orthogonal offset in pixels by which to displace the title from its position along the edge of the chart.
   */
  offset?: number;

  // TODO: name, encode, interactive, zindex
}
