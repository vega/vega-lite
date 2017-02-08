import {COLUMN, X, Channel} from '../../channel';
import {NOMINAL, ORDINAL, TEMPORAL} from '../../type';
import {contains, keys, extend} from '../../util';
import {VgAxis} from '../../vega.schema';

import {timeFormatExpression} from '../common';
import {Model} from '../model';

// TODO: @yuhanlu -- please change method signature to require only what are really needed
export function domain(model: Model, channel: Channel, domainPropsSpec: any, _?: VgAxis) {
  const axis = model.axis(channel);

  return extend(
    axis.axisColor !== undefined ?
      {stroke: {value: axis.axisColor}} :
      {},
    axis.axisWidth !== undefined ?
      {strokeWidth: {value: axis.axisWidth}} :
      {},
    domainPropsSpec || {}
  );
}

// TODO: @yuhanlu -- please change method signature to require only what are really needed
export function grid(model: Model, channel: Channel, gridPropsSpec: any, _?: VgAxis) {
  const axis = model.axis(channel);

  return extend(
    axis.gridColor !== undefined ? {stroke: {value: axis.gridColor}} : {},
    axis.gridOpacity !== undefined ? {strokeOpacity: {value: axis.gridOpacity}} : {},
    axis.gridWidth !== undefined ? {strokeWidth : {value: axis.gridWidth}} : {},
    axis.gridDash !== undefined ? {strokeDashOffset : {value: axis.gridDash}} : {},
    gridPropsSpec || {}
  );
}

// TODO: @yuhanlu -- please change method signature to require only what are really needed
export function labels(model: Model, channel: Channel, labelsSpec: any, def: VgAxis) {
  const fieldDef = model.fieldDef(channel);
  const axis = model.axis(channel);
  const config = model.config();

  // Text
  if (contains([NOMINAL, ORDINAL], fieldDef.type) && axis.labelMaxLength) {
    // TODO replace this with Vega's labelMaxLength once it is introduced
    labelsSpec = extend({
      text: {
        signal: `truncate(datum.value, ${axis.labelMaxLength})`
      }
    }, labelsSpec || {});
  } else if (fieldDef.type === TEMPORAL) {
    labelsSpec = extend({
      text: {
        signal: timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, axis.shortTimeLabels, config)
      }
    }, labelsSpec);
  }

  // Label Angle
  if (axis.labelAngle !== undefined) {
    labelsSpec.angle = {value: axis.labelAngle};
  } else {
    // auto rotate for X
    if (channel === X && (contains([NOMINAL, ORDINAL], fieldDef.type) || !!fieldDef.bin || fieldDef.type === TEMPORAL)) {
      labelsSpec.angle = {value: 270};
    }
  }

  if (axis.labelAlign !== undefined) {
    labelsSpec.align = {value: axis.labelAlign};
  } else {
    // Auto set align if rotated
    // TODO: consider other value besides 270, 90
    if (labelsSpec.angle) {
      if (labelsSpec.angle.value === 270) {
        labelsSpec.align = {
          value: def.orient === 'top' ? 'left':
                  (channel === X || channel === COLUMN) ? 'right' :
                  'center'
        };
      } else if (labelsSpec.angle.value === 90) {
        labelsSpec.align = {value: 'center'};
      }
    }
  }

  if (axis.labelBaseline !== undefined) {
    labelsSpec.baseline = {value: axis.labelBaseline};
  } else {
    if (labelsSpec.angle) {
      // Auto set baseline if rotated
      // TODO: consider other value besides 270, 90
      if (labelsSpec.angle.value === 270) {
        labelsSpec.baseline = {value: (channel === X || channel === COLUMN) ? 'middle' : 'bottom'};
      } else if (labelsSpec.angle.value === 90) {
        labelsSpec.baseline = {value: 'bottom'};
      }
    }
  }

  if (axis.tickLabelColor !== undefined) {
      labelsSpec.fill = {value: axis.tickLabelColor};
  }

  if (axis.tickLabelFont !== undefined) {
      labelsSpec.font = {value: axis.tickLabelFont};
  }

  if (axis.tickLabelFontSize !== undefined) {
      labelsSpec.fontSize = {value: axis.tickLabelFontSize};
  }

  return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}

// TODO: @yuhanlu -- please change method signature to require only what are really needed
export function ticks(model: Model, channel: Channel, ticksPropsSpec: any, _?: VgAxis) {
  const axis = model.axis(channel);

  return extend(
    axis.tickColor !== undefined ? {stroke : {value: axis.tickColor}} : {},
    axis.tickWidth !== undefined ? {strokeWidth: {value: axis.tickWidth}} : {},
    ticksPropsSpec || {}
  );
}

// TODO: @yuhanlu -- please change method signature to require only what are really needed
export function title(model: Model, channel: Channel, titlePropsSpec: any, _?: VgAxis) {
  const axis = model.axis(channel);

  return extend(
    axis.titleColor !== undefined ? {fill : {value: axis.titleColor}} : {},
    axis.titleFont !== undefined ? {font: {value: axis.titleFont}} : {},
    axis.titleFontSize !== undefined ? {fontSize: {value: axis.titleFontSize}} : {},
    axis.titleFontWeight !== undefined ? {fontWeight: {value: axis.titleFontWeight}} : {},

    titlePropsSpec || {}
  );
}
