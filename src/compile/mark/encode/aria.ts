import {hasOwnProperty} from 'vega-util';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common.js';
import {VG_MARK_INDEX} from './../../../vega.schema.js';
import {UnitModel} from './../../unit.js';
import {wrapCondition} from './conditional.js';
import {textRef} from './text.js';
import {tooltipDataTuples} from './tooltip.js';
import type {TooltipTuple} from './tooltip.js';

export function aria(model: UnitModel) {
  const {markDef, config} = model;

  const enableAria = getMarkPropOrConfig('aria', markDef, config);

  // We can ignore other aria properties if ariaHidden is true.
  if (enableAria === false) {
    // getMarkGroups sets aria to false already so we don't have to set it in the encode block
    return {};
  }

  return {
    ...(enableAria ? {aria: enableAria} : {}),
    ...ariaRoleDescription(model),
    ...description(model),
  };
}

function ariaRoleDescription(model: UnitModel) {
  const {mark, markDef, config} = model;

  if (config.aria === false) {
    return {};
  }

  const ariaRoleDesc = getMarkPropOrConfig('ariaRoleDescription', markDef, config);

  if (ariaRoleDesc != null) {
    return {ariaRoleDescription: {value: ariaRoleDesc}};
  }

  return hasOwnProperty(VG_MARK_INDEX, mark) ? {} : {ariaRoleDescription: {value: mark}};
}

export function description(model: UnitModel) {
  const {encoding, markDef, config, stack} = model;
  const channelDef = encoding.description;

  if (channelDef) {
    return wrapCondition({
      model,
      channelDef,
      vgChannel: 'description',
      mainRefFn: (cDef) => textRef(cDef, model.config),
      invalidValueRef: undefined, // aria encoding doesn't have continuous scales and thus can't have invalid values
    });
  }

  // Use default from mark def or config if defined.
  // Functions in encode usually just return undefined but since we are defining a default below, we need to check the default here.
  const descriptionValue = getMarkPropOrConfig('description', markDef, config);
  if (descriptionValue != null) {
    return {
      description: signalOrValueRef(descriptionValue),
    };
  }

  if (config.aria === false) {
    return {};
  }

  const data = tooltipDataTuples(encoding, stack, config)
    // remove internal/private signals from aria description
    .filter(({key}) => !key.startsWith('_'));

  if (data.length === 0) {
    return undefined;
  }

  return {
    description: {
      signal: ariaDescription(data),
    },
  };
}

function ariaDescription(data: TooltipTuple[]) {
  // replace newlines with spaces in aria description
  const entries = data.map(({key, value, test}) => ({key, value: value.replaceAll('\\n', ' '), test}));

  if (entries.every(({test}) => !test)) {
    return entries.map(({key, value}, index) => `"${index > 0 ? '; ' : ''}${key}: " + (${value})`).join(' + ');
  }

  // Prefix every field with a separator and strip the leading separator so that
  // separators only appear between fields that pass their tests.
  const segments = entries.map(({key, value, test}) => {
    const segment = `"; ${key}: " + (${value})`;
    return test ? `((${test}) ? ${segment} : "")` : segment;
  });
  return `slice(${segments.join(' + ')}, 2)`;
}
