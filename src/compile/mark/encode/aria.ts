import {entries} from '../../../util';
import {getMarkPropOrConfig} from '../../common';
import {UnitModel} from './../../unit';
import {wrapCondition} from './conditional';
import {textRef} from './text';
import {tooltipData} from './tooltip';

export function aria(model: UnitModel) {
  const {mark, markDef, config} = model;

  const ariaHidden = getMarkPropOrConfig('ariaHidden', markDef, config);

  // we can ignore other aria properties if ariaHidden is true
  if (ariaHidden === true) {
    return {
      ariaHidden: {
        value: true
      }
    };
  }

  return {
    ...(ariaHidden ? {ariaHidden} : {}),
    ariaRoleDescription: {value: mark},
    ariaRole: {value: 'graphics-symbol'},
    ...ariaLabel(model)
  };
}

export function ariaLabel(model: UnitModel) {
  const {encoding, markDef, config, stack} = model;
  const channelDef = encoding.ariaLabel;

  if (channelDef) {
    return wrapCondition(model, channelDef, 'ariaLabel', cDef => textRef(cDef, model.config));
  }

  // Use default from mark def or config if defined.
  // We usually just return undefined but since we are defining a default below, we need to check the default here.
  const ariaLabelValue = getMarkPropOrConfig('ariaLabel', markDef, config);
  if (ariaLabelValue) {
    return {
      ariaLabel: {
        value: ariaLabelValue
      }
    };
  }

  const data = tooltipData(encoding, stack, config);

  return {
    ariaLabel: {
      signal: entries(data)
        .map(({key, value}) => `${key} + " is " + (${value})`)
        .join(' + ", " + ')
    }
  };
}
