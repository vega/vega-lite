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

  const data = tooltipDataTuples(encoding, stack, config).filter(({key}) => !key.startsWith('_'));

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
  if (data.every(({test}) => !test)) {
    return data
      .map(({key, value}) => [key, value.replaceAll('\\n', ' ')])
      .map(([key, value], index) => `"${index > 0 ? '; ' : ''}${key}: " + (${value})`)
      .join(' + ');
  }

  const segments: string[] = [];
  let priorIncluded: string | undefined;

  for (const {key, value, test} of data) {
    const segment = `"${key}: " + (${value.replaceAll('\\n', ' ')})`;
    const prefix = priorIncluded ? (priorIncluded === 'true' ? '"; " + ' : `((${priorIncluded}) ? "; " : "") + `) : '';

    if (test) {
      segments.push(`((${test}) ? (${prefix}${segment}) : "")`);
      priorIncluded = priorIncluded
        ? priorIncluded === 'true'
          ? 'true'
          : `${priorIncluded} || (${test})`
        : `(${test})`;
    } else {
      segments.push(`${prefix}${segment}`);
      priorIncluded = 'true';
    }
  }

  return segments.join(' + ');
}
