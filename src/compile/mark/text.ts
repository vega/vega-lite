import {TEXT, X} from '../../channel';
import {numberFormat, timeFormatExpression, getMarkConfig} from '../common';

import * as mixins from './mixins';
import {Config} from '../../config';
import {ChannelDef, TextFieldDef, ValueDef, field, isFieldDef} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {UnitModel} from '../unit';
import {VgValueRef} from '../../vega.schema';

import {MarkCompiler} from './base';
import * as ref from './valueref';
import {Encoding, channelHasField} from '../../encoding';

export const text: MarkCompiler = {
  vgMark: 'text',
  role: undefined,

  encodeEntry: (model: UnitModel) => {
    const {config, encoding} = model;
    const textDef = encoding.text;

    return {
      ...mixins.pointPosition('x', model, xDefault(config, textDef)),
      ...mixins.pointPosition('y', model, ref.midY(config)),
      text: textRef(textDef, config),
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

function textRef(textDef: TextFieldDef | ValueDef<any>, config: Config): VgValueRef {
  // text
  if (textDef) {
    if (isFieldDef(textDef)) {
      if (QUANTITATIVE === textDef.type) {
        // FIXME: what happens if we have bin?
        const format = numberFormat(textDef, textDef.format, config, TEXT);
        return {
          signal: `format(${field(textDef, {datum: true})}, '${format}')`
        };
      } else if (TEMPORAL === textDef.type) {
        return {
          signal: timeFormatExpression(field(textDef, {datum: true}), textDef.timeUnit, textDef.format, config.text.shortTimeLabels, config.timeFormat)
        };
      } else {
        return {field: textDef.field};
      }
    } else if (textDef.value) {
      return {value: textDef.value};
    }
  }
  return {value: config.text.text};
}

function align(encoding: Encoding, config: Config) {
  const alignConfig = getMarkConfig('align', 'text', config);
  if (alignConfig === undefined) {
    return channelHasField(encoding, X) ? 'center' : 'right';
  }

  // If there is a config, Vega-parser will process this already.
  return undefined;
}
