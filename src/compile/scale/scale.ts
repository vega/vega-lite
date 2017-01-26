import {VgScale} from '../../vega.schema';

/** Scale suffix for scale used to get drive binned legends. */
export const BIN_LEGEND_SUFFIX = '_bin_legend';
/** Scale suffix for scale for binned field's legend labels, which maps a binned field's quantitative values to range strings. */
export const BIN_LEGEND_LABEL_SUFFIX = '_bin_legend_label';

// FIXME: With layer and concat, scaleComponent should decompose between
// ScaleSignature and ScaleDomain[].
// Basically, if two unit specs has the same scale, signature for a particular channel,
// the scale can be unioned by combining the domain.
export type ScaleComponent = VgScale;

export type ScaleComponents = {
  main: ScaleComponent;
  binLegend?: ScaleComponent;
  binLegendLabel?: ScaleComponent;
};
