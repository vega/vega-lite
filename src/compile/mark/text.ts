import {X} from '../../channel';
import {getMarkConfig} from '../common';

import {Config} from '../../config';
import {ChannelDef, isFieldDef} from '../../fielddef';
import {QUANTITATIVE} from '../../type';
import {VgValueRef} from '../../vega.schema';
import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {channelHasField, Encoding} from '../../encoding';
import {MarkCompiler} from './base';
import * as ref from './valueref';

export const text: MarkCompiler = {
  vgMark: 'text',
  defaultRole: undefined,

  encodeEntry: (model: UnitModel) => {
    const {config, encoding, height} = model;
    const textDef = encoding.text;

    return {
      ...mixins.pointPosition('x', model, xDefault(config, textDef)),
      ...mixins.pointPosition('y', model, ref.midY(height, config)),
      ...mixins.text(model),
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model, {
        vgChannel: 'fontSize'  // VL's text size is fontSize
      }),
      ...mixins.valueIfDefined('align', align(encoding, config))
    };
  }
};

function xDefault(config: Config, textDef: ChannelDef): VgValueRef {
  if (isFieldDef(textDef) && textDef.type === QUANTITATIVE) {
    return {field: {group: 'width'}, offset: -5};
  }
  // TODO: allow this to fit (Be consistent with ref.midX())
  return {value: config.scale.textXRangeStep / 2};
}

function align(encoding: Encoding, config: Config) {
  const alignConfig = getMarkConfig('align', 'text', config);
  if (alignConfig === undefined) {
    return channelHasField(encoding, X) ? 'center' : 'right';
  }
  // If there is a config, Vega-parser will process this already.
  return undefined;
}
