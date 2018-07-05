import {PositionScaleChannel} from '../../channel';
import {Config} from '../../config';
import {ScaleType} from '../../scale';

export function getAxisConfig(
  property: string,
  config: Config,
  channel: PositionScaleChannel,
  orient: string = '',
  scaleType: ScaleType
) {
  // configTypes to loop, starting from higher precedence
  const configTypes = (scaleType === 'band' ? ['axisBand'] : []).concat([
    channel === 'x' ? 'axisX' : 'axisY',
    'axis' + orient.substr(0, 1).toUpperCase() + orient.substr(1), // axisTop, axisBottom, ...
    'axis'
  ]);
  for (const configType of configTypes) {
    if (config[configType] && config[configType][property] !== undefined) {
      return config[configType][property];
    }
  }

  return undefined;
}
