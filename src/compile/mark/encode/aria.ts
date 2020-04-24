import {entries} from '../../../util';
import {getMarkPropOrConfig} from '../../common';
import {UnitModel} from './../../unit';
import {wrapCondition} from './conditional';
import {textRef} from './text';
import {tooltipData} from './tooltip';

export function aria(model: UnitModel) {
  const {mark, markDef, config} = model;

  const enableAria = getMarkPropOrConfig('aria', markDef, config);

  // we can ignore other aria properties if ariaHidden is true
  if (enableAria === false) {
    return {
      aria: {
        value: false
      }
    };
  }

  return {
    ...(enableAria ? {aria: enableAria} : {}),
    ariaRoleDescription: {value: mark},
    ...description(model)
  };
}

export function description(model: UnitModel) {
  const {encoding, markDef, config, stack} = model;
  const channelDef = encoding.description;

  if (channelDef) {
    return wrapCondition(model, channelDef, 'description', cDef => textRef(cDef, model.config));
  }

  // Use default from mark def or config if defined.
  // Functions in encode usually just return undefined but since we are defining a default below, we need to check the default here.
  const descriptionValue = getMarkPropOrConfig('description', markDef, config);
  if (descriptionValue != null) {
    return {
      description: {
        value: descriptionValue
      }
    };
  }

  const data = tooltipData(encoding, stack, config);

  return {
    description: {
      signal: entries(data)
        .map(({key, value}) => `${key} + ": " + (${value})`)
        .join(' + "; " + ')
    }
  };
}
