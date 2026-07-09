import {array, isArray, isObject, isString} from 'vega-util';
import {isBinned} from '../../../bin.js';
import {Channel, getMainRangeChannel, isXorY, RADIUS, THETA, TOOLTIP} from '../../../channel.js';
import {
  defaultTitle,
  getFieldDef,
  getFormatMixins,
  hasConditionalFieldDef,
  isFieldDef,
  isTypedFieldDef,
  SecondaryFieldDef,
  TooltipFieldFilter,
  TooltipFieldPredicate,
  TypedFieldDef,
  vgField,
} from '../../../channeldef.js';
import {Config} from '../../../config.js';
import {Encoding, forEach} from '../../../encoding.js';
import * as log from '../../../log/index.js';
import {
  fieldFilterExpression,
  FieldPredicate,
  isFieldEqualPredicate,
  isFieldGTEPredicate,
  isFieldGTPredicate,
  isFieldLTEPredicate,
  isFieldLTPredicate,
  isFieldOneOfPredicate,
  isFieldRangePredicate,
  isFieldValidPredicate,
} from '../../../predicate.js';
import {StackProperties} from '../../../stack.js';
import {isDiscrete} from '../../../type.js';
import {Dict, hasProperty, logicalExpr} from '../../../util.js';
import {isSignalRef, VgValueRef} from '../../../vega.schema.js';
import {getMarkPropOrConfig} from '../../common.js';
import {binFormatExpression, formatSignalRef} from '../../format.js';
import {UnitModel} from '../../unit.js';
import {wrapCondition} from './conditional.js';
import {textRef} from './text.js';

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
  const out: Dict<string> = {};
  for (const {key, value, test} of tooltipDataTuples(encoding, stack, config, {reactiveGeom})) {
    out[key] = test ? `(${test}) ? ${value} : ""` : value;
  }

  return out;
}

export type TooltipTuple = {channel: Channel; key: string; value: string; test?: string};

type FilterableTooltipFieldDef = (TypedFieldDef<string> | SecondaryFieldDef<string>) & {
  filter?: TooltipFieldFilter;
};

export function tooltipDataTuples(
  encoding: Encoding<string>,
  stack: StackProperties,
  config: Config,
  {reactiveGeom}: {reactiveGeom?: boolean} = {},
) {
  const formatConfig = {...config, ...config.tooltipFormat};
  const toSkip = new Set();
  const expr = reactiveGeom ? 'datum.datum' : 'datum';
  const tuples: TooltipTuple[] = [];

  function add(fDef: FilterableTooltipFieldDef, channel: Channel) {
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
        toSkip.add(channel2);
      }
    }

    const test = tooltipFieldFilterExpression(fieldDef, channel, expr);
    if (test === false) {
      return;
    }

    if (isXorY(channel)) {
      const channel2 = channel === 'x' ? 'x2' : 'y2';
      const fieldDef2 = getFieldDef(encoding[channel2]);

      if (isBinned(fieldDef.bin) && fieldDef2) {
        const startField = vgField(fieldDef, {expr});
        const endField = vgField(fieldDef2, {expr});
        const {format, formatType} = getFormatMixins(fieldDef);
        value = binFormatExpression(startField, endField, format, formatType, formatConfig);
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

    tuples.push({channel, key, value, test});
  }

  forEach(encoding, (channelDef, channel) => {
    if (isFieldDef(channelDef)) {
      add(channelDef, channel);
    } else if (hasConditionalFieldDef(channelDef)) {
      add(channelDef.condition, channel);
    }
  });

  const out: TooltipTuple[] = [];
  const keys = new Set<string>();
  for (const {channel, key, value, test} of tuples) {
    if (!toSkip.has(channel) && !keys.has(key)) {
      out.push({channel, key, value, test});
      keys.add(key);
    }
  }

  return out;
}

function tooltipFieldFilterExpression(
  fieldDef: FilterableTooltipFieldDef,
  channel: Channel,
  expr: 'datum' | 'datum.datum',
): string | false | undefined {
  if (fieldDef.tooltip === false) {
    // Omit field entirely
    return false;
  }

  if (channel !== TOOLTIP || !hasProperty(fieldDef, 'filter')) {
    return undefined;
  }

  if (!fieldDef.field) {
    log.warn(log.message.tooltipFilterRequiresField());
    return undefined;
  }

  const test = filterExpression(fieldDef.filter, {...fieldDef, field: fieldDef.field}, expr);
  if (!test) {
    log.warn(log.message.invalidTooltipFilter(fieldDef.filter));
  }
  return test;
}

// Converts a tooltip filter for the given field into a Vega expression, undefined when invalid.
function filterExpression(
  filter: TooltipFieldFilter,
  fieldDef: TypedFieldDef<string> & {field: string},
  expr: 'datum' | 'datum.datum',
): string | undefined {
  let valid = true;
  let leafCount = 0;
  const expression = logicalExpr(filter, (predicate: TooltipFieldPredicate) => {
    leafCount++;
    const predicateExpression = tooltipFieldPredicateExpression(predicate, fieldDef, expr);
    if (!predicateExpression) {
      valid = false;
      return '';
    }
    return predicateExpression;
  });

  return valid && leafCount > 0 ? expression : undefined;
}

function tooltipFieldPredicateExpression(
  predicate: TooltipFieldPredicate,
  fieldDef: TypedFieldDef<string> & {field: string},
  expr: 'datum' | 'datum.datum',
): string | undefined {
  if (!isObject(predicate)) {
    return undefined;
  }

  const fieldPredicate = {...fieldDef, ...predicate, field: fieldDef.field};

  if (isFieldEqualPredicate(fieldPredicate)) {
    if (fieldPredicate.equal === null) {
      return `${vgField(fieldPredicate, {expr})}===null`;
    }
  }

  if (isValidTooltipFieldPredicate(fieldPredicate)) {
    return fieldFilterExpression(fieldPredicate, true, expr);
  }

  return undefined;
}

function isValidTooltipFieldPredicate(predicate: unknown): predicate is FieldPredicate {
  return (
    isFieldEqualPredicate(predicate) ||
    (isFieldLTPredicate(predicate) && isOrderablePredicateValue(predicate.lt)) ||
    (isFieldLTEPredicate(predicate) && isOrderablePredicateValue(predicate.lte)) ||
    (isFieldGTPredicate(predicate) && isOrderablePredicateValue(predicate.gt)) ||
    (isFieldGTEPredicate(predicate) && isOrderablePredicateValue(predicate.gte)) ||
    isFieldRangePredicate(predicate) ||
    (isFieldOneOfPredicate(predicate) && isArray(predicate.oneOf)) ||
    (isFieldValidPredicate(predicate) && typeof predicate.valid === 'boolean')
  );
}

function isOrderablePredicateValue(value: unknown) {
  return value !== undefined && value !== null && typeof value !== 'boolean';
}

export function tooltipRefForEncoding(
  encoding: Encoding<string>,
  stack: StackProperties,
  config: Config,
  {reactiveGeom}: {reactiveGeom?: boolean} = {},
) {
  const tuples = tooltipDataTuples(encoding, stack, config, {reactiveGeom});
  if (tuples.length === 0) {
    return undefined;
  }

  const objectExpr = ({key, value}: TooltipTuple) => `{"${key}": ${value}}`;
  if (tuples.some(({test}) => !!test)) {
    const keyValues = tuples.map((tuple) =>
      tuple.test ? `(${tuple.test}) ? ${objectExpr(tuple)} : {}` : objectExpr(tuple),
    );
    const filteredOnly = tuples.every(({test}) => !!test);
    const value = `merge(${keyValues.join(', ')})`;
    const tests = tuples.map(({test}) => test).filter(isString);
    const hasVisibleField = tests.length === 1 ? tests[0] : tests.map((test) => `(${test})`).join(' || ');
    return {
      signal: filteredOnly ? `(${hasVisibleField}) ? ${value} : null` : value,
    };
  }

  const keyValues = tuples.map(({key, value}) => `"${key}": ${value}`);
  return {signal: `{${keyValues.join(', ')}}`};
}

/**
 * Transforms a tooltip value that is an array to a string with line breaks
 */
function addLineBreaksToTooltip(
  channelDef: Encoding<string>['text' | 'tooltip'],
  config: Config,
  expr: 'datum' | 'datum.datum' = 'datum',
): VgValueRef {
  if (
    isFieldDef(channelDef) &&
    isDiscrete(channelDef.type) &&
    !channelDef.timeUnit &&
    !getFormatMixins(channelDef).format &&
    !getFormatMixins(channelDef).formatType
  ) {
    const fieldString = `${expr}["${channelDef.field}"]`;
    return {
      signal: `isValid(${fieldString}) ? isArray(${fieldString}) ? join(${fieldString}, '\\n') : ${fieldString} : ""+${fieldString}`,
    };
  }

  return textRef(channelDef, config, expr);
}
