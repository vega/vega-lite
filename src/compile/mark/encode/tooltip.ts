import {array, isArray, isObject, isString} from 'vega-util';
import {isBinned} from '../../../bin.js';
import {getMainRangeChannel, isXorY, Channel, THETA, RADIUS} from '../../../channel.js';
import {
  defaultTitle,
  getFieldDef,
  getFormatMixins,
  hasConditionalFieldDef,
  isFieldDef,
  isTypedFieldDef,
  SecondaryFieldDef,
  TypedFieldDef,
  vgField,
} from '../../../channeldef.js';
import {Config} from '../../../config.js';
import {Encoding, forEach} from '../../../encoding.js';
import {StackProperties} from '../../../stack.js';
import {Dict, entries, hasProperty} from '../../../util.js';
import {isSignalRef, VgValueRef} from '../../../vega.schema.js';
import {getMarkPropOrConfig} from '../../common.js';
import {binFormatExpression, formatSignalRef} from '../../format.js';
import {UnitModel} from '../../unit.js';
import {wrapCondition} from './conditional.js';
import {textRef} from './text.js';
import {isDiscrete} from '../../../type.js';

export function tooltip(model: UnitModel, opt: {reactiveGeom?: boolean} = {}) {
  const {encoding, markDef, config, stack} = model;
  const channelDef = encoding.tooltip;

  if (isArray(channelDef)) {
    return {tooltip: tooltipRefForEncoding({tooltip: channelDef}, stack, config, opt)};
  } else {
    const datum = opt.reactiveGeom ? 'datum.datum' : 'datum';
    const mainRefFn = (cDef: Encoding<string>['tooltip']) => {
      // use valueRef based on channelDef first
      const tooltipRefFromChannelDef = addLineBreaksToTooltip(cDef, config, datum);
      if (tooltipRefFromChannelDef) {
        return tooltipRefFromChannelDef;
      }

      if (cDef === null) {
        // Allow using encoding.tooltip = null to disable tooltip
        return undefined;
      }

      let markTooltip = getMarkPropOrConfig('tooltip', markDef, config);

      if (markTooltip === true) {
        markTooltip = {content: 'encoding'};
      }

      if (isString(markTooltip)) {
        return {value: markTooltip};
      } else if (isObject(markTooltip)) {
        // `tooltip` is `{fields: 'encodings' | 'fields'}`
        if (isSignalRef(markTooltip)) {
          return markTooltip;
        } else if (markTooltip.content === 'encoding') {
          return tooltipRefForEncoding(encoding, stack, config, opt);
        } else {
          return {signal: datum};
        }
      }

      return undefined;
    };

    return wrapCondition({
      model,
      channelDef,
      vgChannel: 'tooltip',
      mainRefFn,
      invalidValueRef: undefined, // tooltip encoding doesn't have continuous scales and thus can't have invalid values
    });
  }
}

export function tooltipData(
  encoding: Encoding<string>,
  stack: StackProperties,
  config: Config,
  {reactiveGeom}: {reactiveGeom?: boolean} = {},
) {
  const formatConfig = {...config, ...config.tooltipFormat};
  const toSkip = new Set();
  const expr = reactiveGeom ? 'datum.datum' : 'datum';
  const tuples: {channel: Channel; key: string; value: string}[] = [];

  function add(fDef: TypedFieldDef<string> | SecondaryFieldDef<string>, channel: Channel) {
    const mainChannel = getMainRangeChannel(channel);

    const fieldDef: TypedFieldDef<string> = isTypedFieldDef(fDef)
      ? fDef
      : {
          ...fDef,
          type: (encoding[mainChannel] as TypedFieldDef<any>).type, // for secondary field def, copy type from main channel
        };

    const title = fieldDef.title || defaultTitle(fieldDef, formatConfig);
    const key = array(title).join(', ').replaceAll(/"/g, '\\"');

    let value: string;

    if (isXorY(channel)) {
      const channel2 = channel === 'x' ? 'x2' : 'y2';
      const fieldDef2 = getFieldDef(encoding[channel2]);

      if (isBinned(fieldDef.bin) && fieldDef2) {
        const startField = vgField(fieldDef, {expr});
        const endField = vgField(fieldDef2, {expr});
        const {format, formatType} = getFormatMixins(fieldDef);
        value = binFormatExpression(startField, endField, format, formatType, formatConfig);
        toSkip.add(channel2);
      }
    }

    if (
      (isXorY(channel) || channel === THETA || channel === RADIUS) &&
      stack &&
      stack.fieldChannel === channel &&
      stack.offset === 'normalize'
    ) {
      const {format, formatType} = getFormatMixins(fieldDef);
      value = formatSignalRef({
        fieldOrDatumDef: fieldDef,
        format,
        formatType,
        expr,
        config: formatConfig,
        normalizeStack: true,
      }).signal;
    }

    value ??= addLineBreaksToTooltip(fieldDef, formatConfig, expr).signal;

    tuples.push({channel, key, value});
  }

  forEach(encoding, (channelDef, channel) => {
    if (isFieldDef(channelDef)) {
      add(channelDef, channel);
    } else if (hasConditionalFieldDef(channelDef)) {
      add(channelDef.condition, channel);
    }
  });

  const out: Dict<string> = {};
  for (const {channel, key, value} of tuples) {
    if (!toSkip.has(channel) && !out[key]) {
      out[key] = value;
    }
  }

  return out;
}

export function tooltipRefForEncoding(
  encoding: Encoding<string>,
  stack: StackProperties,
  config: Config,
  {reactiveGeom}: {reactiveGeom?: boolean} = {},
) {
  const data = tooltipData(encoding, stack, config, {reactiveGeom});

  const keyValues = entries(data).map(([key, value]) => `"${key}": ${value}`);
  return keyValues.length > 0 ? {signal: `{${keyValues.join(', ')}}`} : undefined;
}

/**
 * Transforms a tooltip value that is an array to a string with line breaks
 */
function addLineBreaksToTooltip(
  channelDef: Encoding<string>['text' | 'tooltip'],
  config: Config,
  expr: 'datum' | 'datum.datum' = 'datum',
): VgValueRef {
  if (isFieldDef(channelDef) && isDiscrete(channelDef.type) && !hasProperty(channelDef, 'format')) {
    const fieldString = `datum["${channelDef.field}"]`;
    return {
      signal: `isValid(${fieldString}) ? isArray(${fieldString}) ? join(${fieldString}, '\\n') : ${fieldString} : ""+${fieldString}`,
    };
  }

  return textRef(channelDef, config, expr);
}
