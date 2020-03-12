import {Axis} from '../../axis';
import {PositionScaleChannel} from '../../channel';
import {Config} from '../../config';
import {isQuantitative, ScaleType} from '../../scale';
import {titlecase} from '../../util';
import {getStyleConfig} from '../common';

export function getAxisConfig(
  property: keyof Axis,
  config: Config,
  channel: PositionScaleChannel,
  orient: string,
  scaleType: ScaleType,
  style: string | string[]
) {
  let styleConfig = getStyleConfig(property, style, config.style);

  if (styleConfig !== undefined) {
    return {
      configFrom: 'style',
      configValue: styleConfig
    };
  }

  const typeBasedConfigs = [
    ...(scaleType === 'band' ? ['axisBand', 'axisDiscrete'] : []),
    ...(scaleType === 'point' ? ['axisPoint', 'axisDiscrete'] : []),
    ...(isQuantitative(scaleType) ? ['axisQuantitative'] : []),
    ...(scaleType === 'time' || scaleType === 'utc' ? ['axisTemporal'] : [])
  ];

  const channelBasedConfig = channel === 'x' ? 'axisX' : 'axisY';

  // configTypes to loop, starting from higher precedence
  const axisConfigs = [
    ...typeBasedConfigs.map(c => channelBasedConfig + c.substr(4)),

    ...typeBasedConfigs,
    // X/Y
    channelBasedConfig,

    // axisTop, axisBottom, ...
    ...(orient ? ['axis' + titlecase(orient)] : []),
    'axis'
  ];

  // apply properties in config Types first

  for (const configType of axisConfigs) {
    if (config[configType]?.[property] !== undefined) {
      return {
        configFrom: configType,
        configValue: config[configType][property]
      };
    }
  }

  // then apply style in config types
  for (const configType of axisConfigs) {
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
