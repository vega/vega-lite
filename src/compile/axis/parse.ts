import {Axis, AXIS_PROPERTIES, AXIS_PROPERTY_TYPE, AxisEncoding, VG_AXIS_PROPERTIES} from '../../axis';
import {SPATIAL_SCALE_CHANNELS, SpatialScaleChannel} from '../../channel';
import {Encoding} from '../../encoding';
import {keys, some} from '../../util';
import {AxisOrient} from '../../vega.schema';
import {VgAxis, VgAxisEncode} from '../../vega.schema';
import {getSpecifiedOrDefaultValue, numberFormat, titleMerger} from '../common';
import {LayerModel} from '../layer';
import {parseGuideResolve} from '../resolve';
import {defaultTieBreaker, Explicit, mergeValuesWithExplicit} from '../split';
import {UnitModel} from '../unit';
import {AxisComponent, AxisComponentIndex, AxisComponentPart} from './component';
import * as encode from './encode';
import * as rules from './rules';

type AxisPart = keyof AxisEncoding;
const AXIS_PARTS: AxisPart[] = ['domain', 'grid', 'labels', 'ticks', 'title'];

export function parseUnitAxis(model: UnitModel): AxisComponentIndex {
  return SPATIAL_SCALE_CHANNELS.reduce(function (axis, channel) {
    // geoshape marks with shape channel are not neccessarily scales
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

    keys(child.component.axes).forEach((channel: SpatialScaleChannel) => {
      const channelResolve = model.component.resolve[channel];
      channelResolve.axis = parseGuideResolve(model.component.resolve, channel);
      if (channelResolve.axis === 'shared') {
        // If the resolve says shared (and has not been overridden)
        // We will try to merge and see if there is a conflict

        axes[channel] = mergeAxisComponents(axes[channel], child.component.axes[channel]);

        if (!axes[channel]) {
          // If merge returns nothing, there is a conflict so we cannot make the axis shared.
          // Thus, mark axis as independent and remove the axis component.
          channelResolve.axis = 'independent';
          delete axes[channel];
        }
      }
    });
  }

  // Move axes to layer's axis component and merge shared axes
  ['x', 'y'].forEach((channel: SpatialScaleChannel) => {
    for (const child of model.children) {
      if (!child.component.axes[channel]) {
        // skip if the child does not have a particular axis
        continue;
      }

      if (resolve[channel].axis === 'independent') {
        // If axes are independent, concat the axisComponent array.
        axes[channel] = (axes[channel] || []).concat(child.component.axes[channel]);

        // Automatically adjust orient
        child.component.axes[channel].forEach(axisComponent => {
          const {value: orient, explicit} = axisComponent.main.getWithExplicit('orient');
          if (axisCount[orient] > 0 && !explicit) {
            // Change axis orient if the number do not match
            const oppositeOrient = OPPOSITE_ORIENT[orient];
            if (axisCount[orient] > axisCount[oppositeOrient]) {
              axisComponent.main.set('orient', oppositeOrient,  false);
            }
          }
          axisCount[orient]++;

          // TODO(https://github.com/vega/vega-lite/issues/2634): automaticaly add extra offset?
        });
      }

      // After merging, make sure to remove axes from child
      delete child.component.axes[channel];
    }
  });
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
export function parseGridAxis(channel: SpatialScaleChannel, model: UnitModel): AxisComponentPart {
  // FIXME: support adding ticks for grid axis that are inner axes of faceted plots.
  return parseAxis(channel, model, true);
}

export function parseMainAxis(channel: SpatialScaleChannel, model: UnitModel): AxisComponentPart {
  return parseAxis(channel, model, false);
}

function parseAxis(channel: SpatialScaleChannel, model: UnitModel, isGridAxis: boolean): AxisComponentPart {
  const axis = model.axis(channel);

  const axisComponent = new AxisComponentPart(
    {},
    {scale: model.scaleName(channel)} // implicit
  );

  // 1.2. Add properties
  AXIS_PROPERTIES.forEach(function(property) {
    const value = getProperty(property, axis, channel, model, isGridAxis);
    if (value !== undefined) {
      const explicit = property === 'values' ?
        !!axis.values :  // specified axis.values is already respected, but may get transformed.
        value === axis[property];

      axisComponent.set(property, value, explicit);
    }
  });

  // Special case for gridScale since gridScale is not a Vega-Lite Axis property.
  const gridScale = rules.gridScale(model, channel, isGridAxis);
  if (gridScale !== undefined) {
    axisComponent.set('gridScale', gridScale, false);
  }

  // 2) Add guide encode definition groups

  const axisEncoding = axis.encoding || {};
  const axisEncode = AXIS_PARTS.reduce((e: VgAxisEncode, part) => {
    if (!hasAxisPart(axisComponent, part)) {
      // No need to create encode for a disabled part.
      return e;
    }

    const value = part === 'labels' ?
      encode.labels(model, channel, axisEncoding.labels || {}, axisComponent) :
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

function getProperty<K extends keyof (Axis|VgAxis)>(property: K, specifiedAxis: Axis, channel: SpatialScaleChannel, model: UnitModel, isGridAxis: boolean): VgAxis[K] {
  const fieldDef = model.fieldDef(channel);

  if ((isGridAxis && AXIS_PROPERTY_TYPE[property] === 'main') ||
      (!isGridAxis && AXIS_PROPERTY_TYPE[property] === 'grid')) {
    // Do not apply unapplicable properties
    return undefined;
  }

  switch (property) {
    case 'domain':
      return rules.domain(property, specifiedAxis, isGridAxis, channel);
    case 'format':
      return numberFormat(fieldDef, specifiedAxis.format, model.config);
    case 'grid': {
      const scaleType = model.component.scales[channel].get('type');
      return getSpecifiedOrDefaultValue(specifiedAxis.grid, rules.grid(scaleType, fieldDef));
    }
    case 'labels':
      return isGridAxis ? false : specifiedAxis.labels;
    case 'labelOverlap': {
      const scaleType = model.component.scales[channel].get('type');
      return rules.labelOverlap(fieldDef, specifiedAxis, channel, scaleType);
    }
    case 'minExtent': {
      const scaleType = model.component.scales[channel].get('type');
      return rules.minMaxExtent(specifiedAxis.minExtent, isGridAxis);
    }
    case 'maxExtent': {
      const scaleType = model.component.scales[channel].get('type');
      return rules.minMaxExtent(specifiedAxis.maxExtent, isGridAxis);
    }
    case 'orient':
      return getSpecifiedOrDefaultValue(specifiedAxis.orient, rules.orient(channel));
    case 'tickCount': {
      const scaleType = model.component.scales[channel].get('type');
      const sizeType = channel === 'x' ? 'width' : channel === 'y' ? 'height' : undefined;
      const size = sizeType ? model.getSizeSignalRef(sizeType)
       : undefined;
      return getSpecifiedOrDefaultValue(specifiedAxis.tickCount, rules.tickCount(channel, fieldDef, scaleType, size));
    }
    case 'ticks':
      return rules.ticks(property, specifiedAxis, isGridAxis, channel);
    case 'title':
      return getSpecifiedOrDefaultValue(specifiedAxis.title, rules.title(specifiedAxis.titleMaxLength, fieldDef, model.config));
    case 'values':
      return rules.values(specifiedAxis, model, fieldDef);
    case 'zindex':
      return getSpecifiedOrDefaultValue(specifiedAxis.zindex, rules.zindex(isGridAxis));
  }
  // Otherwise, return specified property.
  return specifiedAxis[property];
}
