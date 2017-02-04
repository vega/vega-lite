// import {ANCHOR, OFFSET, SIZE} from '../../channel';
// import {getMarkConfig} from '../common';

import * as mixins from './mixins';
import {Config} from '../../config';
import {isInternalData} from '../../data';
import {UnitModel} from '../unit';
import {VgLabelTransform} from '../../vega.schema';

import {LayoutCompiler} from './base';
// import * as ref from './valueref';
import {Encoding} from '../../encoding';

export const label: LayoutCompiler = {
  vgMark: 'text',
  role: 'label',

  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.text(model),
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'fontSize' // VL's text size is fontSize
      })
    };
  },

  transform: (model: UnitModel): VgLabelTransform => {
    const data = model.data;
    if (isInternalData(data)) {
      const {config, encoding} = model;
      const referenceMark = model.parent.children.filter((sibling) => sibling.name === data.ref)[0];
      return {
        type: 'label',
        ref: referenceMark.getName('marks'),
        anchor: anchor(encoding, config),
        offset: offset(encoding, config)
      } as VgLabelTransform;
    } else {
      throw new Error('Label requires internal data');
    }
  }
};

function anchor(encoding: Encoding, config: Config): string {
  // const orient = config.mark.orient;

  // return sensible default given orient, model

  return 'top';
  // return 'auto';
}

function offset(encoding: Encoding, config: Config): number | string {
  // const orient = config.mark.orient;

  // return sensible default given orient, model

  return 1;
  // return 'auto';
}
