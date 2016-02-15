import {AxisConfig, axisConfig} from './axis.schema';

export interface FacetConfig {
  axis?: AxisConfig;
}

export const facetConfig = {
  type: 'object',
  properties: {
    axis: axisConfig
  }
};
