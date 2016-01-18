import {Channel, ROW, COLUMN, SHAPE, SIZE} from './channel';

export function autoMaxBins(channel: Channel): number {
  switch (channel) {
    case ROW:
    case COLUMN:
      // Facet shouldn't have too many bins
      // We choose 6 like shape to simplify the rule
    case SIZE:
      // It is really hard to distinguish different sizes
    case SHAPE:
      return 6; // Vega's "shape" has 6 distinct values
    default:
      return 10;
  }
}
