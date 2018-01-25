import {Axis, AXIS_PROPERTY_TYPE, AxisEncoding, isAxisProperty, VG_AXIS_PROPERTIES} from '../../axis';
import {POSITION_SCALE_CHANNELS, PositionScaleChannel} from '../../channel';
import {keys, some} from '../../util';
import {AxisOrient, VgAxis, VgAxisEncode} from '../../vega.schema';
import {getSpecifiedOrDefaultValue, numberFormat, titleMerger} from '../common';
import {LayerModel} from '../layer';
import {parseGuideResolve} from '../resolve';
import {defaultTieBreaker, Explicit, mergeValuesWithExplicit} from '../split';
import {UnitModel} from '../unit';
import {AxisComponent, AxisComponentIndex, AxisComponentPart} from './component';
import {getAxisConfig} from './config';
import * as encode from './encode';
import * as properties from './properties';

type AxisPart = keyof AxisEncoding;
const AXIS_PARTS: AxisPart[] = ['domain', 'grid', 'labels', 'ticks', 'title'];

export function parseUnitAxis(model: UnitModel): AxisComponentIndex {
  return POSITION_SCALE_CHANNELS.reduce(function(axis, channel) {
    if (model.component.scales[channel] && model.axis(channel)) {
      const axisComponent: AxisComponent = {};
      // TODO: support multiple axis
      const main = parseMainAxis(channel, model);
      if (main && isVisibleAxis(main)) {
        axisComponent.main = main;
      }

      const grid = parseGridAxis(channel, model);
      if (grid && isVisibleAxis(grid)) {
        axisComponent.grid = grid;
      }

      axis[channel] = [axisComponent];
    }
    return axis;
  }, {} as AxisComponentIndex);
}

const OPPOSITE_ORIENT: {[K in AxisOrient]: AxisOrient} = {
  bottom: 'top',
  top: 'bottom',
  left: 'right',
  right: 'left'
};

export function parseLayerAxis(model: LayerModel) {
  const {axes, resolve} = model.component;
  const axisCount: {
    // Using Mapped Type to declare type (https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types)
    [k in AxisOrient]: number
  } = {top: 0, bottom: 0, right: 0, left: 0};

  for (const child of model.children) {
    child.parseAxisAndHeader();

    for (const channel of keys(child.component.axes)) {
      resolve.axis[channel] = parseGuideResolve(model.component.resolve, channel);
      if (resolve.axis[channel] === 'shared') {
        // If the resolve says shared (and has not been overridden)
        // We will try to merge and see if there is a conflict

        axes[channel] = mergeAxisComponents(axes[channel], child.component.axes[channel]);

        if (!axes[channel]) {
          // If merge returns nothing, there is a conflict so we cannot make the axis shared.
          // Thus, mark axis as independent and remove the axis component.
          resolve.axis[channel] = 'independent';
          delete axes[channel];
        }
      }
    }
  }

  // Move axes to layer's axis component and merge shared axes
  for (const channel of ['x', 'y']) {
    for (const child of model.children) {
      if (!child.component.axes[channel]) {
        // skip if the child does not have a particular axis
        continue;
      }

      if (resolve.axis[channel] === 'independent') {
        // If axes are independent, concat the axisComponent array.
        axes[channel] = (axes[channel] || []).concat(child.component.axes[channel]);

        // Automatically adjust orient
        for (const axisComponent of child.component.axes[channel]) {
          const {value: orient, explicit} = axisComponent.main.getWithExplicit('orient');
          if (axisCount[orient] > 0 && !explicit) {
            // Change axis orient if the number do not match
            const oppositeOrient = OPPOSITE_ORIENT[orient];
            if (axisCount[orient] > axisCount[oppositeOrient]) {
              axisComponent.main.set('orient', oppositeOrient, false);
            }
          }
          axisCount[orient]++;

          // TODO(https://github.com/vega/vega-lite/issues/2634): automaticaly add extra offset?
        }
      }

      // After merging, make sure to remove axes from child
      delete child.component.axes[channel];
    }
  }
}

function mergeAxisComponents(mergedAxisCmpts: AxisComponent[], childAxisCmpts: AxisComponent[]): AxisComponent[] {
  if (mergedAxisCmpts) {
    if (mergedAxisCmpts.length !== childAxisCmpts.length) {
      return undefined; // Cannot merge axis component with different number of axes.
    }
    const length = mergedAxisCmpts.length;
    for (let i = 0; i < length ; i++) {
      const mergedMain = mergedAxisCmpts[i].main;
      const childMain = childAxisCmpts[i].main;

      if ((!!mergedMain) !== (!!childMain)) {
        return undefined;
      } else if (mergedMain && childMain) {
        const mergedOrient = mergedMain.getWithExplicit('orient');
        const childOrient = childMain.getWithExplicit('orient');

        if (mergedOrient.explicit && childOrient.explicit && mergedOrient.value !== childOrient.value) {
          // TODO: throw warning if resolve is explicit (We don't have info about explicit/implicit resolve yet.)
          // Cannot merge due to inconsistent orient
          return undefined;
        } else {
          mergedAxisCmpts[i].main = mergeAxisComponentPart(mergedMain, childMain);
        }
      }

      const mergedGrid = mergedAxisCmpts[i].grid;
      const childGrid = childAxisCmpts[i].grid;
      if ((!!mergedGrid) !== (!!childGrid)) {
        return undefined;
      } else if (mergedGrid && childGrid) {
        mergedAxisCmpts[i].grid = mergeAxisComponentPart(mergedGrid, childGrid);
      }
    }
  } else {
    // For first one, return a copy of the child
    return childAxisCmpts.map(axisComponent => ({
      ...(axisComponent.main ? {main: axisComponent.main.clone()} : {}),
      ...(axisComponent.grid ? {grid: axisComponent.grid.clone()} : {})
    }));
  }
  return mergedAxisCmpts;
}

function mergeAxisComponentPart(merged: AxisComponentPart, child: AxisComponentPart): AxisComponentPart {
  for (const prop of VG_AXIS_PROPERTIES) {
    const mergedValueWithExplicit = mergeValuesWithExplicit<VgAxis, any>(
      merged.getWithExplicit(prop),
      child.getWithExplicit(prop),
      prop, 'axis',

      // Tie breaker function
      (v1: Explicit<any>, v2: Explicit<any>) => {
        switch (prop) {
          case 'title':
            return titleMerger(v1, v2);
          case 'gridScale':
            return {
              explicit: v1.explicit, // keep the old explicit
              value: v1.value || v2.value
            };
        }
        return defaultTieBreaker<VgAxis, any>(v1, v2, prop, 'axis');
      }
    );
    merged.setWithExplicit(prop, mergedValueWithExplicit);
  }
  return merged;
}

function isFalseOrNull(v: boolean | null) {
  return v === false || v === null;
}

/**
 * Return if an axis is visible (shows at least one part of the axis).
 */
function isVisibleAxis(axis: AxisComponentPart) {
  return some(AXIS_PARTS, (part) => hasAxisPart(axis, part));
}

function hasAxisPart(axis: AxisComponentPart, part: AxisPart) {
  // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.

  if (part === 'axis') {
    return true;
  }

  if (part === 'grid' || part === 'title') {
    return !!axis.get(part);
  }
  // Other parts are enabled by default, so they should not be false or null.
  return !isFalseOrNull(axis.get(part));
}

/**
 * Make an inner axis for showing grid for shared axis.
 */
export function parseGridAxis(channel: PositionScaleChannel, model: UnitModel): AxisComponentPart {
  // FIXME: support adding ticks for grid axis that are inner axes of faceted plots.
  return parseAxis(channel, model, true);
}

export function parseMainAxis(channel: PositionScaleChannel, model: UnitModel): AxisComponentPart {
  return parseAxis(channel, model, false);
}

function parseAxis(channel: PositionScaleChannel, model: UnitModel, isGridAxis: boolean): AxisComponentPart {
  const axis = model.axis(channel);

  const axisComponent = new AxisComponentPart();

  // 1.2. Add properties
  VG_AXIS_PROPERTIES.forEach(function(property) {
    const value = getProperty(property, axis, channel, model, isGridAxis);
    if (value !== undefined) {
      const explicit =
        // specified axis.values is already respected, but may get transformed.
        property === 'values' ? !!axis.values :
        // both VL axis.encoding and axis.labelAngle affect VG axis.encode
        property === 'encode' ? !!axis.encoding || !!axis.labelAngle :
        value === axis[property];

      const configValue = getAxisConfig(property, model.config, channel, axisComponent.get('orient'), model.getScaleComponent(channel).get('type'));

      if (
        explicit || configValue === undefined ||
        // A lot of rules need to be applied for the grid axis
        // FIXME: this is not perfectly correct, but we need to rewrite axis component to have one axis and separate them later during assembly anyway.
        isGridAxis
      ) {
        // Do not apply implicit rule if there is a config value
        axisComponent.set(property, value, explicit);
      }
    }
  });

  // 2) Add guide encode definition groups
  const axisEncoding = axis.encoding || {};
  const axisEncode = AXIS_PARTS.reduce((e: VgAxisEncode, part) => {
    if (!hasAxisPart(axisComponent, part)) {
      // No need to create encode for a disabled part.
      return e;
    }

    const value = part === 'labels' ?
      encode.labels(model, channel, axisEncoding.labels || {}, axisComponent.get('orient')) :
      axisEncoding[part] || {};

    if (value !== undefined && keys(value).length > 0) {
      e[part] = {update: value};
    }
    return e;
  }, {} as VgAxisEncode);

  // FIXME: By having encode as one property, we won't have fine grained encode merging.
  if (keys(axisEncode).length > 0) {
    axisComponent.set('encode', axisEncode, !!axis.encoding || !!axis.labelAngle);
  }

  return axisComponent;
}

function getProperty<K extends keyof VgAxis>(property: K, specifiedAxis: Axis, channel: PositionScaleChannel, model: UnitModel, isGridAxis: boolean): VgAxis[K] {
  const fieldDef = model.fieldDef(channel);

  if ((isGridAxis && AXIS_PROPERTY_TYPE[property] === 'main') ||
      (!isGridAxis && AXIS_PROPERTY_TYPE[property] === 'grid')) {
    // Do not apply unapplicable properties
    return undefined;
  }

  switch (property) {
    case 'scale':
      return model.scaleName(channel);
    case 'gridScale':
      return properties.gridScale(model, channel, isGridAxis);

    case 'domain':
      return properties.domain(property, specifiedAxis, isGridAxis, channel);
    case 'format':
      // We don't include temporal field here as we apply format in encode block
      return numberFormat(fieldDef, specifiedAxis.format, model.config);
    case 'grid': {
      const scaleType = model.getScaleComponent(channel).get('type');
      return getSpecifiedOrDefaultValue(specifiedAxis.grid, properties.grid(scaleType, fieldDef));
    }
    case 'labels':
      return isGridAxis ? false : specifiedAxis.labels;
    case 'labelFlush':
      return properties.labelFlush(fieldDef, channel, specifiedAxis, isGridAxis);
    case 'labelOverlap': {
      const scaleType = model.getScaleComponent(channel).get('type');
      return properties.labelOverlap(fieldDef, specifiedAxis, channel, scaleType);
    }
    case 'minExtent': {
      return properties.minMaxExtent(specifiedAxis.minExtent, isGridAxis);
    }
    case 'maxExtent': {
      return properties.minMaxExtent(specifiedAxis.maxExtent, isGridAxis);
    }
    case 'orient':
      return getSpecifiedOrDefaultValue(specifiedAxis.orient, properties.orient(channel));
    case 'tickCount': {
      const scaleType = model.getScaleComponent(channel).get('type');
      const sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
      const size = sizeType ? model.getSizeSignalRef(sizeType)
       : undefined;
      return getSpecifiedOrDefaultValue(specifiedAxis.tickCount, properties.tickCount(channel, fieldDef, scaleType, size));
    }
    case 'ticks':
      return properties.ticks(property, specifiedAxis, isGridAxis, channel);
    case 'title':
      return getSpecifiedOrDefaultValue(specifiedAxis.title, properties.title(specifiedAxis.titleMaxLength, fieldDef, model.config));
    case 'values':
      return properties.values(specifiedAxis, model, fieldDef);
    case 'zindex':
      return getSpecifiedOrDefaultValue(specifiedAxis.zindex, properties.zindex(isGridAxis));
  }
  // Otherwise, return specified property.
  return isAxisProperty(property) ? specifiedAxis[property] : undefined;
}
