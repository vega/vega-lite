import {Config} from '../../config';
import {Encoding} from '../../encoding';
import {MarkDef} from '../../mark';
import {getFirstDefined} from '../../util';
import {getMarkConfig, getStyleConfig} from '../common';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';
import * as ref from './valueref';

export const text: MarkCompiler = {
  vgMark: 'text',

  encodeEntry: (model: UnitModel) => {
    const {config, encoding, width, height, markDef} = model;

    // We have to support mark property and config for both size and fontSize for text
    // - size is from original Vega-Lite, which allows users to easily transition from size channel of other marks to text.
    // - fontSize is from Vega and we need support it to make sure that all Vega configs all work correctly in Vega-Lite.
    // Precedence: markDef > style config > mark-specific config
    // For each of them, fontSize is more specific than size, thus has higher precedence
    const defaultValue = getFirstDefined(
      markDef.fontSize,
      markDef.size,
      getStyleConfig('fontSize', markDef, config.style),
      getStyleConfig('size', markDef, config.style),
      config[markDef.type].fontSize,
      config[markDef.type].size
      // general mark config shouldn't be used as they are only for point/circle/square
    );

    return {
      ...mixins.baseEncodeEntry(model, {size: 'ignore', orient: 'ignore'}),
      ...mixins.pointPosition('x', model, ref.mid(width)),
      ...mixins.pointPosition('y', model, ref.mid(height)),
      ...mixins.text(model),
      ...mixins.nonPosition('size', model, {
        defaultValue,
        vgChannel: 'fontSize' // VL's text size is fontSize
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
