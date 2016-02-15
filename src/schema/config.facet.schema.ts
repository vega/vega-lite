import {AxisConfig, axisConfig, defaultFacetAxisConfig} from './axis.schema';

export interface FacetConfig {
  axis?: AxisConfig;
  grid?: FacetGridConfig;
}

export interface FacetGridConfig {
  color?: string;
  opacity?: number;
  offset?: number;
}

const defaultFacetGridConfig: FacetGridConfig = {
  color: '#000000',
  opacity: 0.4,
  offset: 0
};

export const defaultFacetConfig: FacetConfig = {
  axis: defaultFacetAxisConfig,
  grid: defaultFacetGridConfig
};

const facetGridConfig = {
  type: 'object',
  properties: {
    color: {
      type: 'string',
      format: 'color',
    },
    opacity: {
      type: 'number',
      minimum: 0,
      maximum: 1,
    },
    offset: {
      type: 'number',
    }
  }
};

export const facetConfig = {
  type: 'object',
  properties: {
    axis: axisConfig,
    grid: facetGridConfig
  }
};
