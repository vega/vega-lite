import {Orient} from 'vega';
import {FacetChannel} from '../../channel';
import {contains} from '../../util';
import {HeaderChannel} from './component';

export function getHeaderChannel(channel: FacetChannel, orient: Orient): HeaderChannel {
  if (contains(['top', 'bottom'], orient)) {
    return 'column';
  } else if (contains(['left', 'right'], orient)) {
    return 'row';
  }
  return channel === 'row' ? 'row' : 'column';
}
