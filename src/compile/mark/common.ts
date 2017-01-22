import {FILL_CONFIG, STROKE_CONFIG} from '../../mark';
import * as util from '../../util';
import {VgEncodeEntry} from '../../vega.schema';

import {applyMarkConfig} from '../common';
import {UnitModel} from '../unit';

import * as ref from './valueref';


export function applyColorAndOpacity(e: VgEncodeEntry, model: UnitModel) {
  const config = model.config();
  const filled = config.mark.filled;

  // TODO: remove this once we correctly integrate theme
  // Apply fill stroke config first so that color field / value can override
  // fill / stroke
  if (filled) {
    applyMarkConfig(e, model, FILL_CONFIG);
  } else {
    applyMarkConfig(e, model, STROKE_CONFIG);
  }

  let colorRef= ref.midPoint('color', model.encoding().color, model.scaleName('color'), model.scale('color'), undefined);
  let opacityRef = ref.midPoint('opacity', model.encoding().opacity, model.scaleName('opacity'), model.scale('opacity'), {value: config.mark.opacity});

  if (colorRef !== undefined) {
    if (filled) {
      e.fill = colorRef;
    } else {
      e.stroke = colorRef;
    }
  } else { // TODO: remove this once we correctly integrate theme
    // apply color config if there is no fill / stroke config
    e[filled ? 'fill' : 'stroke'] = e[filled ? 'fill' : 'stroke'] ||
      {value: model.config().mark.color};
  }

  // If there is no fill, always fill symbols
  // with transparent fills https://github.com/vega/vega-lite/issues/1316
  if (!e.fill && util.contains(['bar', 'point', 'circle', 'square'], model.mark())) {
    e.fill = {value: 'transparent'};
  }

  if (opacityRef !== undefined) {
    e.opacity = opacityRef;
  }
}
