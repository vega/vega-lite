import * as util from '../../util';
import {VgEncodeEntry} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {UnitModel} from '../unit';

import * as ref from './valueref';


export function applyColor(e: VgEncodeEntry, model: UnitModel) {
  const config = model.config;
  const filled = config.mark.filled;

  let colorRef = ref.midPoint('color', model.encoding.color, model.scaleName('color'), model.scale('color'), undefined);

  if (colorRef !== undefined) {
    if (filled) {
      e.fill = colorRef;
    } else {
      e.stroke = colorRef;
    }
  } else {
    const colorValue = getMarkConfig('color', model.mark(), config);
    // apply color config if there is no fill / stroke config
    if (colorValue) {
      e[filled ? 'fill' : 'stroke'] = {value: colorValue};
    }
  }

  // If there is no fill, always fill symbols
  // with transparent fills https://github.com/vega/vega-lite/issues/1316
  if (!e.fill && util.contains(['bar', 'point', 'circle', 'square'], model.mark())) {
    e.fill = {value: 'transparent'};
  }
}

