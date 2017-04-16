import {Orient, VgEncodeEntry, VgMarkGroup, VgValueRef} from '../../vega.schema';
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

  offset?: number;

  textOrient?: Orient;

  textRole: string;

  textRef: VgValueRef;

  textEncodeMixins?: VgEncodeEntry;

  positionRef: VgValueRef;
}

export function getTextHeader(params: TextHeaderParams): VgMarkGroup {
  const {channel, name, from, groupEncode, offset, textOrient, textRole, textEncodeMixins, textRef, positionRef} = params;

  const positionChannel = channel === 'row' ? 'y' : 'x';
  const offsetChannel = channel === 'row' ? 'x' : 'y';

  // TODO: row could be left too for footer
  const align = channel === 'row' ? 'right' : 'center';

  return {
    name,
    role: `${channel}-header`,
    type: 'group',
    ...(from ? {from} : {}),
    ...(groupEncode ? {encode: {update: groupEncode}} : {}),
    marks: [{
      type: 'text',
      role: textRole,
      encode: {
        update: {
          [positionChannel]: positionRef,
          ...(offset ? {[offsetChannel]: {value: offset}} : {}),
          ...(textOrient === 'vertical' ? {angle: {value: 270}} : {}),
          text: textRef,
          align: {value: align},
          fill: {value: 'black'},
          ...textEncodeMixins
        }
      }
    }]
  };
}


