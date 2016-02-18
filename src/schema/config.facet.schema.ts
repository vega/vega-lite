import {FacetScaleConfig, defaultFacetScaleConfig} from './scale.schema';
import {AxisConfig, defaultFacetAxisConfig} from './axis.schema';
import {UnitConfig, defaultFacetUnitConfig} from './config.unit.schema';

export interface FacetConfig {
  scale?: FacetScaleConfig;
  axis?: AxisConfig;
  grid?: FacetGridConfig;
  unit?: UnitConfig;
}

export interface FacetGridConfig {
  /** @format color */
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
