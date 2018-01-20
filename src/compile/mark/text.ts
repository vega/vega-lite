import {X} from '../../channel';
import {Config} from '../../config';
import {channelHasField, Encoding} from '../../encoding';
import {ChannelDef, isFieldDef} from '../../fielddef';
import {MarkDef} from '../../mark';
import {QUANTITATIVE} from '../../type';
import {VgValueRef} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';


export const text: MarkCompiler = {
  vgMark: 'text',

  encodeEntry: (model: UnitModel) => {
    const {config, encoding, height} = model;
    const textDef = encoding.text;

    return {
      ...mixins.baseEncodeEntry(model, true),
      ...mixins.pointPosition('x', model, xDefault(config, textDef)),
      ...mixins.pointPosition('y', model, ref.mid(height)),
      ...mixins.text(model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'fontSize'  // VL's text size is fontSize
      }),
      ...mixins.valueIfDefined('align', align(model.markDef, encoding, config))
    };
  }
};

function xDefault(config: Config, textDef: ChannelDef<string>): VgValueRef {
  if (isFieldDef(textDef) && textDef.type === QUANTITATIVE) {
    return {field: {group: 'width'}, offset: -5};
  }
  // TODO: allow this to fit (Be consistent with ref.midX())
  return {value: config.scale.textXRangeStep / 2};
}

function align(markDef: MarkDef, encoding: Encoding<string>, config: Config) {
  const a = markDef.align || getMarkConfig('align', markDef, config);
  if (a === undefined) {
    return channelHasField(encoding, X) ? 'center' : 'right';
  }
  // If there is a config, Vega-parser will process this already.
  return undefined;
}
