import {isArray, isNumber, isString} from 'vega-util';
import {isFieldDef, vgField} from '../../channeldef.js';
import {VgPostEncodingTransform, VgWordcloudTransform} from '../../vega.schema.js';
import {getMarkPropOrConfig} from '../common.js';
import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const wordcloud: MarkCompiler = {
  vgMark: 'text',

  encodeEntry: (model: UnitModel) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'ignore',
        orient: 'ignore',
        theta: 'ignore',
        angle: 'ignore',
      }),
      ...encode.text(model),
      ...encode.valueIfDefined('align', 'center'),
      ...encode.valueIfDefined('baseline', 'alphabetic'),
      x: {field: 'x'},
      y: {field: 'y'},
      fontSize: {field: 'fontSize'},
      angle: {field: 'rotate'},
      font: {field: 'font'},
      fontStyle: {field: 'fontStyle'},
      fontWeight: {field: 'fontWeight'},
    };
  },

  postEncodingTransform: (model: UnitModel): VgPostEncodingTransform[] => {
    const {encoding, markDef, config} = model;

    const transform: VgWordcloudTransform = {
      type: 'wordcloud',
      size: [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')],
      text: {field: 'datum.text'},
    };

    const textDef = encoding.text;
    if (isFieldDef(textDef)) {
      transform.text = {field: `datum.${vgField(textDef)}`};
    }

    // Size encoding → fontSize + fontSizeRange on the transform.
    // The VL scale for size is suppressed (see scale/parse.ts); the transform
    // maps raw data values to font sizes internally via fontSizeRange.
    const sizeDef = encoding.size;
    if (isFieldDef(sizeDef)) {
      transform.fontSize = {field: `datum.${vgField(sizeDef)}`};

      const range = sizeDef.scale?.range;
      if (isArray(range) && range.length === 2 && isNumber(range[0]) && isNumber(range[1])) {
        transform.fontSizeRange = [range[0], range[1]];
      }
    } else {
      const fontSize = getMarkPropOrConfig('fontSize', markDef, config);
      if (isNumber(fontSize)) {
        transform.fontSize = fontSize;
      }
    }

    // Angle encoding → rotate on the transform. Conceptually an identity scale:
    // raw data values pass through to the transform as rotation degrees.
    const angleDef = encoding.angle;
    if (isFieldDef(angleDef)) {
      transform.rotate = {field: `datum.${vgField(angleDef)}`};
    } else {
      const angle = getMarkPropOrConfig('angle', markDef, config);
      if (isNumber(angle)) {
        transform.rotate = angle;
      }
    }

    const font = getMarkPropOrConfig('font', markDef, config);
    if (isString(font)) {
      transform.font = font;
    }

    const fontStyle = getMarkPropOrConfig('fontStyle', markDef, config);
    if (isString(fontStyle)) {
      transform.fontStyle = fontStyle;
    }

    const fontWeight = getMarkPropOrConfig('fontWeight', markDef, config);
    if (isNumber(fontWeight) || isString(fontWeight)) {
      transform.fontWeight = fontWeight;
    }

    if (markDef.padding !== undefined) {
      transform.padding = markDef.padding;
    }

    if (markDef.spiral !== undefined) {
      transform.spiral = markDef.spiral;
    }

    return [transform];
  },
};
