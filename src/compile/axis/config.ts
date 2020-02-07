import {PositionScaleChannel} from '../../channel';
import {Config} from '../../config';
import {isContinuousToContinuous, ScaleType} from '../../scale';

export function getAxisConfig(
  property: string,
  config: Config,
  channel: PositionScaleChannel,
  orient: string,
  scaleType: ScaleType
) {
  // configTypes to loop, starting from higher precedence
  const configTypes = [
    ...(scaleType === 'band' ? ['axisBand'] : []),
    ...(isContinuousToContinuous(scaleType) ? ['axisQuantitative'] : []),
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
