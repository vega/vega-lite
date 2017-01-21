import {X, Y, COLOR, TEXT, SIZE} from '../../channel';
import {applyConfig, applyColorAndOpacity, numberFormat, timeFormatExpression} from '../common';
import {Config} from '../../config';
import {ChannelDef, field, isFieldDef} from '../../fielddef';
import {QUANTITATIVE, TEMPORAL} from '../../type';
import {UnitModel} from '../unit';
import {VgValueRef, VgEncodeEntry} from '../../vega.schema';

import {MarkCompiler} from './base';
import * as ref from './valueref';

// FIXME: remove thie once we remove the background hack
export interface TextCompiler extends MarkCompiler {
  background: (model: UnitModel) => VgEncodeEntry;
}

export const text: TextCompiler = {
  markType: () => {
    return 'text';
  },

  background: (model: UnitModel) => {
    return {
      x: { value: 0 },
      y: { value: 0 },
      width: { field: { group: 'width' } },
      height: { field: { group: 'height' } },
      fill: {
        scale: model.scaleName(COLOR),
        field: model.field(COLOR)
      }
    };
  },

  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = {};

    applyConfig(e, model.config().text,
      ['angle', 'align', 'baseline', 'dx', 'dy', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta', 'text']);

    const config = model.config();
    const stack = model.stack();
    const textDef = model.encoding().text;

    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613

    e.x = ref.stackable(X, model.encoding().x, model.scaleName(X), model.scale(X), stack, xDefault(config, textDef));
    e.y = ref.stackable(Y, model.encoding().y, model.scaleName(Y), model.scale(Y), stack, ref.midY(config));

    e.fontSize = ref.midPoint(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
       {value: config.text.fontSize}
    );

    e.text = textRef(textDef, model.scaleName(TEXT), config);

    if (model.config().text.applyColorToBackground &&
        !model.channelHasField(X) &&
        !model.channelHasField(Y)) {
      e.fill = {value: 'black'}; // TODO: add rules for swapping between black and white
      // opacity
      const opacity = model.config().mark.opacity;
      if (opacity) { e.opacity = { value: opacity }; };
    } else {
      applyColorAndOpacity(e, model);
    }

    return e;
  }
};

function xDefault(config: Config, textDef: ChannelDef): VgValueRef {
  if (isFieldDef(textDef) && textDef.type === QUANTITATIVE) {
    return { field: { group: 'width' }, offset: -5 };
  }
  // TODO: allow this to fit (Be consistent with ref.midX())
  return { value: config.scale.textXRangeStep / 2 };
}

function textRef(textDef: ChannelDef, scaleName: string, config: Config): VgValueRef {
  // text
  if (textDef) {
    if (isFieldDef(textDef)) {
      if (QUANTITATIVE === textDef.type) {
        // FIXME: what happens if we have bin?
        const format = numberFormat(textDef, config.text.format, config, TEXT);
        return {
          signal: `format(${field(textDef, { datum: true })}, '${format}')`
        };
      } else if (TEMPORAL === textDef.type) {
        return {
          signal: timeFormatExpression(field(textDef, {datum: true}), textDef.timeUnit, config.text.format, config.text.shortTimeLabels, config)
        };
      } else {
        return { field: textDef.field };
      }
    } else if (textDef.value) {
      return { value: textDef.value };
    }
  }
  return {value: config.text.text};
}
