import {Axis} from '../../axis';
import {Config} from '../../config';
import {getStyleConfig} from '../common';

export function getAxisConfig(
  property: keyof Axis,
  config: Config,
  axisConfigTypes: string[],
  style: string | string[]
) {
  let styleConfig = getStyleConfig(property, style, config.style);

  if (styleConfig !== undefined) {
    return {
      configFrom: 'style',
      configValue: styleConfig
    };
  }

  // apply properties in config Types first

  for (const configType of axisConfigTypes) {
    if (config[configType]?.[property] !== undefined) {
      return {
        configFrom: configType,
        configValue: config[configType][property]
      };
    }
  }

  // then apply style in config types
  for (const configType of axisConfigTypes) {
    if (config[configType]?.style) {
      styleConfig = getStyleConfig(property, config[configType]?.style, config.style);
      if (styleConfig !== undefined) {
        return {
          configFrom: 'axis-config-style',
          configValue: styleConfig
        };
      }
    }
  }

  return {};
}
