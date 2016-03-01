import {ExtendedUnitSpec} from './spec';

// TODO: move to vl.spec.validator?

import {toMap} from './util';
import {BAR} from './mark';

interface RequiredChannelMap {
  [mark: string]: Array<string>;
}

/**
 * Required Encoding Channels for each mark type
 * @type {Object}
 */
export const DEFAULT_REQUIRED_CHANNEL_MAP: RequiredChannelMap = {
  text: ['text'],
  line: ['x', 'y'],
  area: ['x', 'y']
};

interface SupportedChannelMap {
  [mark: string]: {
    [channel: string]: number
  };
}

/**
 * Supported Encoding Channel for each mark type
 */
export const DEFAULT_SUPPORTED_CHANNEL_TYPE: SupportedChannelMap = {
  bar: toMap(['row', 'column', 'x', 'y', 'size', 'color', 'detail']),
  line: toMap(['row', 'column', 'x', 'y', 'color', 'detail']), // TODO: add size when Vega supports
  area: toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
  tick: toMap(['row', 'column', 'x', 'y', 'color', 'detail']),
  circle: toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
  square: toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail']),
  point: toMap(['row', 'column', 'x', 'y', 'color', 'size', 'detail', 'shape']),
  text: toMap(['row', 'column', 'size', 'color', 'text']) // TODO(#724) revise
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
 * @param  {RequiredChannelMap  = DefaultRequiredChannelMap}  requiredChannelMap
 * @param  {SupportedChannelMap = DefaultSupportedChannelMap} supportedChannelMap
 * @return {String} Return one reason why the encoding is invalid,
 *                  or null if the encoding is valid.
 */
export function getEncodingMappingError(spec: ExtendedUnitSpec,
  requiredChannelMap: RequiredChannelMap = DEFAULT_REQUIRED_CHANNEL_MAP,
  supportedChannelMap: SupportedChannelMap = DEFAULT_SUPPORTED_CHANNEL_TYPE
  ) {
  let mark = spec.mark;
  let encoding = spec.encoding;
  let requiredChannels = requiredChannelMap[mark];
  let supportedChannels = supportedChannelMap[mark];

  for (let i in requiredChannels) { // all required channels are in encoding`
    if (!(requiredChannels[i] in encoding)) {
      return 'Missing encoding channel \"' + requiredChannels[i] +
        '\" for mark \"' + mark + '\"';
    }
  }

  for (let channel in encoding) { // all channels in encoding are supported
    if (!supportedChannels[channel]) {
      return 'Encoding channel \"' + channel +
        '\" is not supported by mark type \"' + mark + '\"';
    }
  }

  if (mark === BAR && !encoding.x && !encoding.y) {
    return 'Missing both x and y for bar';
  }

  return null;
}
