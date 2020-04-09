import {ScaleType} from 'vega-typings/types';
import {array} from 'vega-util';
import {AxisConfig} from '../../axis';
import {PositionScaleChannel} from '../../channel';
import {Config} from '../../config';
import {isQuantitative} from '../../scale';
import {titlecase} from '../../util';
import {getStyleConfig} from '../common';

function getAxisConfigFromConfigTypes(configTypes: string[], config: Config) {
  // TODO: add special casing to add conditional value based on orient signal
  return Object.assign.apply(null, [{}, ...configTypes.map(configType => config[configType])]);
}

export type AxisConfigs = ReturnType<typeof getAxisConfigs>;

export function getAxisConfigs(channel: PositionScaleChannel, scaleType: ScaleType, orient: string, config: Config) {
  const typeBasedConfigTypes =
    scaleType === 'band'
      ? ['axisDiscrete', 'axisBand']
      : scaleType === 'point'
      ? ['axisDiscrete', 'axisPoint']
      : isQuantitative(scaleType)
      ? ['axisQuantitative']
      : scaleType === 'time' || scaleType === 'utc'
      ? ['axisTemporal']
      : [];

  const axisChannel = channel === 'x' ? 'axisX' : 'axisY';
  const axisOrient = 'axis' + titlecase(orient); // axisTop, axisBottom, ...

  const vlOnlyConfigTypes = [
    // technically Vega does have axisBand, but if we make another separation here,
    // it will further introduce complexity in the code
    ...typeBasedConfigTypes,
    ...typeBasedConfigTypes.map(c => axisChannel + c.substr(4))
  ];

  const vgConfigTypes = ['axis', axisOrient, axisChannel];

  return {
    vlOnlyAxisConfig: getAxisConfigFromConfigTypes(vlOnlyConfigTypes, config),
    vgAxisConfig: getAxisConfigFromConfigTypes(vgConfigTypes, config),
    axisConfigStyle: getAxisConfigStyle([...vgConfigTypes, ...vlOnlyConfigTypes], config)
  };
}

export function getAxisConfigStyle(axisConfigTypes: string[], config: Config) {
  const toMerge = [{}];
  for (const configType of axisConfigTypes) {
    // TODO: add special casing to add conditional value based on orient signal
    let style = config[configType]?.style;
    if (style) {
      style = array(style);
      for (const s of style) {
        toMerge.push(config.style[s]);
      }
    }
  }
  return Object.assign.apply(null, toMerge);
}
export function getAxisConfig(
  property: keyof AxisConfig,
  config: Config,
  style: string | string[],
  axisConfigs: Partial<AxisConfigs> = {}
): {configFrom?: string; configValue?: any} {
  const styleConfig = getStyleConfig(property, style, config.style);

  if (styleConfig !== undefined) {
    return {
      configFrom: 'style',
      configValue: styleConfig
    };
  }

  for (const configFrom of ['vlOnlyAxisConfig', 'vgAxisConfig', 'axisConfigStyle']) {
    if (axisConfigs[configFrom]?.[property] !== undefined) {
      return {configFrom, configValue: axisConfigs[configFrom][property]};
    }
  }
  return {};
}
