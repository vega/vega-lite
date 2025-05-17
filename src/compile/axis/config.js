import {array} from 'vega-util';
import {isQuantitative} from '../../scale.js';
import {keys, titleCase} from '../../util.js';
import {isSignalRef} from '../../vega.schema.js';
import {getStyleConfig, signalOrStringValue} from '../common.js';
function getAxisConfigFromConfigTypes(configTypes, config, channel, orient) {
  // TODO: add special casing to add conditional value based on orient signal
  return Object.assign.apply(null, [
    {},
    ...configTypes.map((configType) => {
      if (configType === 'axisOrient') {
        const orient1 = channel === 'x' ? 'bottom' : 'left';
        const orientConfig1 = config[channel === 'x' ? 'axisBottom' : 'axisLeft'] || {};
        const orientConfig2 = config[channel === 'x' ? 'axisTop' : 'axisRight'] || {};
        const props = new Set([...keys(orientConfig1), ...keys(orientConfig2)]);
        const conditionalOrientAxisConfig = {};
        for (const prop of props.values()) {
          conditionalOrientAxisConfig[prop] = {
            // orient is surely signal in this case
            signal: `${orient['signal']} === "${orient1}" ? ${signalOrStringValue(orientConfig1[prop])} : ${signalOrStringValue(orientConfig2[prop])}`,
          };
        }
        return conditionalOrientAxisConfig;
      }
      return config[configType];
    }),
  ]);
}
export function getAxisConfigs(channel, scaleType, orient, config) {
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
    ...typeBasedConfigTypes.map((c) => axisChannel + c.substr(4)),
  ];
  const vgConfigTypes = ['axis', axisOrient, axisChannel];
  return {
    vlOnlyAxisConfig: getAxisConfigFromConfigTypes(vlOnlyConfigTypes, config, channel, orient),
    vgAxisConfig: getAxisConfigFromConfigTypes(vgConfigTypes, config, channel, orient),
    axisConfigStyle: getAxisConfigStyle([...vgConfigTypes, ...vlOnlyConfigTypes], config),
  };
}
export function getAxisConfigStyle(axisConfigTypes, config) {
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
export function getAxisConfig(property, styleConfigIndex, style, axisConfigs = {}) {
  const styleConfig = getStyleConfig(property, style, styleConfigIndex);
  if (styleConfig !== undefined) {
    return {
      configFrom: 'style',
      configValue: styleConfig,
    };
  }
  for (const configFrom of ['vlOnlyAxisConfig', 'vgAxisConfig', 'axisConfigStyle']) {
    if (axisConfigs[configFrom]?.[property] !== undefined) {
      return {configFrom, configValue: axisConfigs[configFrom][property]};
    }
  }
  return {};
}
//# sourceMappingURL=config.js.map
