import {VgEncodeEntry, VgMarkGroup, VgValueRef} from '../../vega.schema';
import {FacetModel} from '../facet';
import {Model} from '../model';
/**
 * Utility for generating row / column headers
 */



export interface TextHeaderParams {
  channel: 'row' | 'column';

  name: string;

  from?: {data: string};

  groupEncode?: VgEncodeEntry;

  textRole: string;

  textRef: VgValueRef;

  positionRef: VgValueRef;
}

export function getTextHeader(params: TextHeaderParams): VgMarkGroup {
  const {channel, name, from, groupEncode, textRole, textRef, positionRef} = params;

  const positionChannel = channel === 'row' ? 'y' : 'x';
  const orthogonalPositionalChannel = channel === 'row' ? 'x' : 'y';
  const align = channel === 'row' ? 'right' : 'center';

  return {
    name,
    role: `${channel}-header`,
    type: 'group',
    ...(from ? {from} : {}),
    ...(groupEncode ? {update: groupEncode} : {}),
    marks: [{
      type: 'text',
      role: textRole,
      encode: {
        update: {
          // TODO: add label align
          [positionChannel]: positionRef,
          text: textRef,
          align: {value: align},
          fill: {value: 'black'}
        }
      }
    }]
  };
}


