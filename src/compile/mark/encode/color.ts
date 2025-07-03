import * as log from '../../../log/index.js';
import {contains} from '../../../util.js';
import {VgEncodeEntry} from '../../../vega.schema.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common.js';
import {UnitModel} from '../../unit.js';
import {nonPosition} from './nonposition.js';

export function color(model: UnitModel, opt: {filled: boolean | undefined} = {filled: undefined}): VgEncodeEntry {
  const {markDef, encoding, config} = model;
  const {type: markType} = markDef;

  // Allow filled to be overridden (for trail's "filled")
  const filled = opt.filled ?? getMarkPropOrConfig('filled', markDef, config);

  const transparentIfNeeded = contains(['bar', 'point', 'circle', 'square', 'geoshape'], markType)
    ? 'transparent'
    : undefined;

  const defaultFill =
    getMarkPropOrConfig(filled === true ? 'color' : undefined, markDef, config, {vgChannel: 'fill'}) ??
    // need to add this manually as getMarkConfig normally drops config.mark[channel] if vgChannel is specified
    (config.mark as any)[filled === true && 'color'] ??
    // If there is no fill, always fill symbols, bar, geoshape
    // with transparent fills https://github.com/vega/vega-lite/issues/1316
    transparentIfNeeded;

  const defaultStroke =
    getMarkPropOrConfig(filled === false ? 'color' : undefined, markDef, config, {vgChannel: 'stroke'}) ??
    // need to add this manually as getMarkConfig normally drops config.mark[channel] if vgChannel is specified
    (config.mark as any)[filled === false && 'color'];

  const colorVgChannel = filled ? 'fill' : 'stroke';

  const fillStrokeMarkDefAndConfig: VgEncodeEntry = {
    ...(defaultFill ? {fill: signalOrValueRef(defaultFill)} : {}),
    ...(defaultStroke ? {stroke: signalOrValueRef(defaultStroke)} : {}),
  };

  if (markDef.color && (filled ? markDef.fill : markDef.stroke)) {
    log.warn(log.message.droppingColor('property', {fill: 'fill' in markDef, stroke: 'stroke' in markDef}));
  }

  return {
    ...fillStrokeMarkDefAndConfig,
    ...nonPosition('color', model, {
      vgChannel: colorVgChannel,
      defaultValue: filled ? defaultFill : defaultStroke,
    }),
    ...nonPosition('fill', model, {
      // if there is encoding.fill, include default fill just in case we have conditional-only fill encoding
      defaultValue: encoding.fill ? defaultFill : undefined,
    }),
    ...nonPosition('stroke', model, {
      // if there is encoding.stroke, include default fill just in case we have conditional-only stroke encoding
      defaultValue: encoding.stroke ? defaultStroke : undefined,
    }),
  };
}
