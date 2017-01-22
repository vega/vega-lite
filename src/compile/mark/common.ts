import {field, isFieldDef} from '../../fielddef';
import * as util from '../../util';
import {VgEncodeEntry, VgValueRef} from '../../vega.schema';
import {applyMarkConfig} from '../common';
import {UnitModel} from '../unit';

// TODO: figure if we really need opacity in both
export const STROKE_CONFIG = ['stroke', 'strokeWidth',
  'strokeDash', 'strokeDashOffset', 'strokeOpacity', 'opacity'];

export const FILL_CONFIG = ['fill', 'fillOpacity',
  'opacity'];

export const FILL_STROKE_CONFIG = util.union(STROKE_CONFIG, FILL_CONFIG);

export function applyColorAndOpacity(e: VgEncodeEntry, model: UnitModel) {
  const filled = model.config().mark.filled;
  const colorDef = model.encoding().color;

  // Apply fill stroke config first so that color field / value can override
  // fill / stroke
  if (filled) {
    applyMarkConfig(e, model, FILL_CONFIG);
  } else {
    applyMarkConfig(e, model, STROKE_CONFIG);
  }

  let colorValue: VgValueRef;
  let opacityValue: VgValueRef;
  if (isFieldDef(colorDef)) {
    colorValue = {
      scale: model.scaleName('color'),
      field: field(colorDef)
    };
  } else if (colorDef && colorDef.value) {
    colorValue = { value: colorDef.value };
  }

  const opacityDef = model.encoding().opacity;
  if (isFieldDef(opacityDef)) {
    opacityValue = {
      scale: model.scaleName('opacity'),
      field: field(opacityDef)
    };
  } else if (opacityDef && opacityDef.value) {
    opacityValue = { value: opacityDef.value };
  }

  if (colorValue !== undefined) {
    if (filled) {
      e.fill = colorValue;
    } else {
      e.stroke = colorValue;
    }
  } else {
    // apply color config if there is no fill / stroke config
    e[filled ? 'fill' : 'stroke'] = e[filled ? 'fill' : 'stroke'] ||
      {value: model.config().mark.color};
  }

  // If there is no fill, always fill symbols
  // with transparent fills https://github.com/vega/vega-lite/issues/1316
  if (!e.fill && util.contains(['bar', 'point', 'circle', 'square'], model.mark())) {
    e.fill = {value: 'transparent'};
  }

  if (opacityValue !== undefined) {
    e.opacity = opacityValue;
  }
}