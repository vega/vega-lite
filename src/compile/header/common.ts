import {Orient, SignalRef} from 'vega';
import {FacetChannel} from '../../channel';
import {Config} from '../../config';
import {Header} from '../../header';
import {contains, getFirstDefined} from '../../util';
import {HeaderChannel} from './component';

/**
 * Get header channel, which can be different from facet channel when orient is specified or when the facet channel is facet.
 */
export function getHeaderChannel(channel: FacetChannel, orient: Orient): HeaderChannel {
  if (contains(['top', 'bottom'], orient)) {
    return 'column';
  } else if (contains(['left', 'right'], orient)) {
    return 'row';
  }
  return channel === 'row' ? 'row' : 'column';
}

export function getHeaderProperty<P extends keyof Header<SignalRef>>(
  prop: P,
  header: Header<SignalRef>,
  config: Config<SignalRef>,
  channel: FacetChannel
): Header<SignalRef>[P] {
  const headerSpecificConfig =
    channel === 'row' ? config.headerRow : channel === 'column' ? config.headerColumn : config.headerFacet;

  return getFirstDefined((header || {})[prop], headerSpecificConfig[prop], config.header[prop]);
}

export function getHeaderProperties(
  properties: (keyof Header<SignalRef>)[],
  header: Header<SignalRef>,
  config: Config<SignalRef>,
  channel: FacetChannel
): Header<SignalRef> {
  const props = {};
  for (const prop of properties) {
    const value = getHeaderProperty(prop, header || {}, config, channel);
    if (value !== undefined) {
      props[prop] = value;
    }
  }
  return props;
}
