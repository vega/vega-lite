import {toSet} from 'vega-util';
import {BAR, isMarkDef} from './mark';
import {FacetedExtendedUnitSpec} from './spec';

// TODO: move to vl.spec.validator?
export interface RequiredChannelMap {
  [mark: string]: string[];
}

/**
 * Required Encoding Channels for each mark type
 */
export const DEFAULT_REQUIRED_CHANNEL_MAP: RequiredChannelMap = {
  text: ['text'],
  line: ['x', 'y'],
  trail: ['x', 'y'],
  area: ['x', 'y']
};

export interface SupportedChannelMap {
  [mark: string]: {
    [channel: string]: boolean;
  };
}

/**
 * Supported Encoding Channel for each mark type
 */
export const DEFAULT_SUPPORTED_CHANNEL_TYPE: SupportedChannelMap = {
  bar: toSet(['row', 'column', 'x', 'y', 'size', 'color', 'fill', 'stroke', 'detail']),
  line: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'color', 'detail']),
  trail: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'color', 'detail', 'size']),
  area: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'detail']),
  tick: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'detail']),
  circle: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'size', 'detail']),
  square: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'size', 'detail']),
  point: toSet(['row', 'column', 'x', 'y', 'color', 'fill', 'stroke', 'size', 'detail', 'shape']),
  geoshape: toSet(['row', 'column', 'color', 'fill', 'stroke', 'detail', 'shape']),
  text: toSet(['row', 'column', 'size', 'color', 'fill', 'stroke', 'text']) // TODO(#724) revise
};

// TODO: consider if we should add validate method and
// requires ZSchema in the main vega-lite repo

/**
 * Further check if encoding mapping of a spec is invalid and
 * return error if it is invalid.
 *
 * This checks if
 * (1) all the required encoding channels for the mark type are specified
 * (2) all the specified encoding channels are supported by the mark type
 * @param  {[type]} spec [description]
 * @param  {RequiredChannelMap = DefaultRequiredChannelMap}  requiredChannelMap
 * @param  {SupportedChannelMap = DefaultSupportedChannelMap} supportedChannelMap
 * @return {String} Return one reason why the encoding is invalid,
 *                  or null if the encoding is valid.
 */
export function getEncodingMappingError(
  spec: FacetedExtendedUnitSpec,
  requiredChannelMap: RequiredChannelMap = DEFAULT_REQUIRED_CHANNEL_MAP,
  supportedChannelMap: SupportedChannelMap = DEFAULT_SUPPORTED_CHANNEL_TYPE
) {
  const mark = isMarkDef(spec.mark) ? spec.mark.type : spec.mark;
  const encoding = spec.encoding;
  const requiredChannels = requiredChannelMap[mark];
  const supportedChannels = supportedChannelMap[mark];

  for (const i in requiredChannels) {
    // all required channels are in encoding`
    if (!(requiredChannels[i] in encoding)) {
      return 'Missing encoding channel "' + requiredChannels[i] + '" for mark "' + mark + '"';
    }
  }

  for (const channel in encoding) {
    // all channels in encoding are supported
    if (!supportedChannels[channel]) {
      return 'Encoding channel "' + channel + '" is not supported by mark type "' + mark + '"';
    }
  }

  if (mark === BAR && !encoding.x && !encoding.y) {
    return 'Missing both x and y for bar';
  }

  return null;
}
