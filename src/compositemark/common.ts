import {NonPositionChannel} from '../channel';
import {MarkConfig} from '../mark';

export function getMarkSpecificConfigMixins(markSpecificConfig: MarkConfig, channel: NonPositionChannel) {
  const value = markSpecificConfig[channel];
  return value !== undefined ? {[channel]: {value}} : {};
}
