import {hasOwnProperty} from 'vega-util';
import {entries, isEmpty} from '../../../util.js';
import {getMarkPropOrConfig, signalOrValueRef} from '../../common.js';
import {VG_MARK_INDEX} from './../../../vega.schema.js';
import {UnitModel} from './../../unit.js';
import {wrapCondition} from './conditional.js';
import {textRef} from './text.js';
import {tooltipData} from './tooltip.js';

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

  const data = tooltipData(encoding, stack, config);

  if (isEmpty(data)) {
    return undefined;
  }

  return {
    description: {
      signal: entries(data)
        .filter(([key]) => !key.startsWith('_')) // remove internal/private signals from aria description
        .map(([key, value]) => [key, value.replaceAll('\\n', ' ')]) // replace newlines with spaces in aria description
        .map(([key, value], index) => `"${index > 0 ? '; ' : ''}${key}: " + (${value})`)
        .join(' + '),
    },
  };
}
