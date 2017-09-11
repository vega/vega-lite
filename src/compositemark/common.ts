import {NonSpatialChannel} from '../channel';
import {MarkConfig} from '../mark';

export function getMarkSpecificConfigMixins(markSpecificConfig: MarkConfig, channel: NonSpatialChannel) {
  const value = markSpecificConfig[channel];
  return value !== undefined ? {[channel]: {value}} : {};
}
