import {Axis} from '../../axis';
import {PositionScaleChannel} from '../../channel';
import {Config} from '../../config';
import {isQuantitative, ScaleType} from '../../scale';
import {getStyleConfig} from '../common';

export function getAxisConfig(
  property: keyof Axis,
  config: Config,
  channel: PositionScaleChannel,
  orient: string,
  scaleType: ScaleType,
  style: string | string[]
) {
  const styleConfig = getStyleConfig(property, style, config.style);

  if (styleConfig !== undefined) {
    return {
      configFrom: 'style',
      configValue: styleConfig
    };
  }

  // configTypes to loop, starting from higher precedence
  const configTypes = [
    ...(scaleType === 'band' ? ['axisBand'] : []),
    ...(isQuantitative(scaleType) ? ['axisQuantitative'] : []),
    ...(scaleType === 'time' || scaleType === 'utc' ? ['axisTemporal'] : []),

    // X/Y
    channel === 'x' ? 'axisX' : 'axisY',

    // axisTop, axisBottom, ...
    ...(orient ? ['axis' + orient.substr(0, 1).toUpperCase() + orient.substr(1)] : []),
    'axis'
  ];
  for (const configType of configTypes) {
    if (config[configType]?.[property] !== undefined) {
      return {
        configFrom: configType,
        configValue: config[configType][property]
      };
    }
  }

  return {};
}
