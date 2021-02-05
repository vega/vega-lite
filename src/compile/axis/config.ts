import {ScaleType, SignalRef} from 'vega';
import {array} from 'vega-util';
import {AxisConfig} from '../../axis';
import {PositionScaleChannel} from '../../channel';
import {Config, StyleConfigIndex} from '../../config';
import {isQuantitative} from '../../scale';
import {keys, titleCase} from '../../util';
import {isSignalRef} from '../../vega.schema';
import {getStyleConfig, signalOrStringValue} from '../common';

function getAxisConfigFromConfigTypes(
  configTypes: string[],
  config: Config,
  channel: 'x' | 'y',
  orient: string | SignalRef
) {
  // TODO: add special casing to add conditional value based on orient signal
  return Object.assign.apply(null, [
    {},
    ...configTypes.map(configType => {
      if (configType === 'axisOrient') {
        const orient1 = channel === 'x' ? 'bottom' : 'left';
        const orientConfig1 = config[channel === 'x' ? 'axisBottom' : 'axisLeft'] || {};
        const orientConfig2 = config[channel === 'x' ? 'axisTop' : 'axisRight'] || {};

        const props = new Set([...keys(orientConfig1), ...keys(orientConfig2)]);

        const conditionalOrientAxisConfig = {};
        for (const prop of props.values()) {
          conditionalOrientAxisConfig[prop] = {
            // orient is surely signal in this case
            signal: `${orient['signal']} === "${orient1}" ? ${signalOrStringValue(
              orientConfig1[prop]
            )} : ${signalOrStringValue(orientConfig2[prop])}`
          };
        }

        return conditionalOrientAxisConfig;
      }

      return config[configType];
    })
  ]);
}

export type AxisConfigs = ReturnType<typeof getAxisConfigs>;

export function getAxisConfigs(
  channel: PositionScaleChannel,
  scaleType: ScaleType,
  orient: string | SignalRef,
  config: Config
) {
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
  const axisOrient = isSignalRef(orient) ? 'axisOrient' : `axis${titleCase(orient)}`; // axisTop, axisBottom, ...

  const vlOnlyConfigTypes = [
    // technically Vega does have axisBand, but if we make another separation here,
    // it will further introduce complexity in the code
    ...typeBasedConfigTypes,
    ...typeBasedConfigTypes.map(c => axisChannel + c.substr(4))
  ];

  const vgConfigTypes = ['axis', axisOrient, axisChannel];

  return {
    vlOnlyAxisConfig: getAxisConfigFromConfigTypes(vlOnlyConfigTypes, config, channel, orient),
    vgAxisConfig: getAxisConfigFromConfigTypes(vgConfigTypes, config, channel, orient),
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
  property: keyof AxisConfig<SignalRef>,
  styleConfigIndex: StyleConfigIndex<SignalRef>,
  style: string | string[],
  axisConfigs: Partial<AxisConfigs> = {}
): {configFrom?: string; configValue?: any} {
  const styleConfig = getStyleConfig(property, style, styleConfigIndex);

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
