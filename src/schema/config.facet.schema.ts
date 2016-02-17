import {FacetScaleConfig, facetScaleConfig, defaultFacetScaleConfig} from './scale.schema';
import {AxisConfig, axisConfig, defaultFacetAxisConfig} from './axis.schema';
import {UnitConfig, unitConfig, defaultFacetUnitConfig} from './config.unit.schema';

export interface FacetConfig {
  scale?: FacetScaleConfig;
  axis?: AxisConfig;
  grid?: FacetGridConfig;
  unit?: UnitConfig;
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
  scale: defaultFacetScaleConfig,
  axis: defaultFacetAxisConfig,
  grid: defaultFacetGridConfig,
  unit: defaultFacetUnitConfig
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
    scale: facetScaleConfig,
    axis: axisConfig,
    grid: facetGridConfig,
    unit: unitConfig
  }
};
