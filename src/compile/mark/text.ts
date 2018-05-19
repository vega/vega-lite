import {Config} from '../../config';
import {Encoding} from '../../encoding';
import {MarkDef} from '../../mark';
import {getMarkConfig} from '../common';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';


export const text: MarkCompiler = {
  vgMark: 'text',

  encodeEntry: (model: UnitModel) => {
    const {config, encoding, width, height, markDef} = model;

    return {
      ...mixins.baseEncodeEntry(model, {size: 'ignore', orient: 'ignore'}),
      ...mixins.pointPosition('x', model, ref.mid(width)),
      ...mixins.pointPosition('y', model, ref.mid(height)),
      ...mixins.text(model),
      ...mixins.nonPosition('size', model, {
        ...(markDef.size ? {defaultValue: markDef.size} : {}),
        vgChannel: 'fontSize'  // VL's text size is fontSize
      }),
      ...mixins.valueIfDefined('align', align(model.markDef, encoding, config))
    };
  }
};
function align(markDef: MarkDef, encoding: Encoding<string>, config: Config) {
  const a = markDef.align || getMarkConfig('align', markDef, config);
  if (a === undefined) {
    return 'center';
  }
  // If there is a config, Vega-parser will process this already.
  return undefined;
}
