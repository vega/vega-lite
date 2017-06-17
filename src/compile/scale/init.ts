import {Channel} from '../../channel';
import {Config} from '../../config';
import {FieldDef} from '../../fielddef';
import * as log from '../../log';
import {Mark} from '../../mark';
import {channelScalePropertyIncompatability, Scale, ScaleConfig, scaleTypeSupportProperty} from '../../scale';
import {Split} from '../split';
import scaleType from './type';

/**
 * Initialize Vega-Lite Scale's properties
 *
 * Note that we have to apply these rules here because:
 * - many other scale and non-scale properties (including layout, mark) depend on scale type
 * - layout depends on padding
 * - range depends on zero and size (width and height) depends on range
 */
export default function init(
    channel: Channel, fieldDef: FieldDef<string>, specifiedScale: Scale = {}, config: Config,
    mark: Mark | undefined): Split<Scale> {

  // FIXME make this return Scale, not Split<Scale> and move scaleType to parseScaleCore
  const splitScale = new Split<Scale>(specifiedScale);

  const sType = scaleType(
    specifiedScale.type, channel, fieldDef, mark,
    specifiedScale.rangeStep, config.scale
  );
  splitScale.set('type', sType, sType === specifiedScale.type);

  return splitScale;
}
