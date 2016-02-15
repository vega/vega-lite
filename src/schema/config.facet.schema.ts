import {AxisConfig, axisConfig, defaultFacetAxisConfig} from './axis.schema';

export interface FacetConfig {
  axis?: AxisConfig;
}

export const defaultFacetConfig: FacetConfig = {
  axis: defaultFacetAxisConfig
};

export const facetConfig = {
  type: 'object',
  properties: {
    axis: axisConfig
  }
};
