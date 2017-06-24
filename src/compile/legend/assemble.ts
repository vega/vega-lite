import {vals} from '../../util';
import {VgLegend} from '../../vega.schema';
import {LegendComponentIndex} from './component';

export function assembleLegends(legendComponents: LegendComponentIndex): VgLegend[] {
  return vals(legendComponents).map((legendCmpt) => {
    return legendCmpt.combine();
  });
}
