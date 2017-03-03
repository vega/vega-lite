import {VgScale} from '../../vega.schema';

// FIXME: With layer and concat, scaleComponent should decompose between
// ScaleSignature and ScaleDomain[].
// Basically, if two unit specs has the same scale, signature for a particular channel,
// the scale can be unioned by combining the domain.
export type ScaleComponent = VgScale;

export type ScaleComponents = {
  main: ScaleComponent;
};
