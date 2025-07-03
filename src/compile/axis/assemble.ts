import {Axis as VgAxis, AxisEncode, NewSignal, SignalRef, Text} from 'vega';
import {array, isArray} from 'vega-util';
import {
  AXIS_PARTS,
  AXIS_PROPERTY_TYPE,
  CONDITIONAL_AXIS_PROP_INDEX,
  ConditionalAxisProp,
  isConditionalAxisValue,
} from '../../axis.js';
import {POSITION_SCALE_CHANNELS} from '../../channel.js';
import {defaultTitle, FieldDefBase} from '../../channeldef.js';
import {Config} from '../../config.js';
import {isText} from '../../title.js';
import {contains, getFirstDefined, isEmpty, replaceAll} from '../../util.js';
import {isSignalRef, VgEncodeChannel, VgValueRef} from '../../vega.schema.js';
import {exprFromValueRefOrSignalRef} from '../common.js';
import {Model} from '../model.js';
import {expression} from '../predicate.js';
import {AxisComponent, AxisComponentIndex} from './component.js';

function assembleTitle(title: Text | FieldDefBase<string>[] | SignalRef, config: Config): Text | SignalRef {
  if (!title) {
    return undefined;
  }
  if (isArray(title) && !isText(title)) {
    return title.map((fieldDef) => defaultTitle(fieldDef, config)).join(', ');
  }
  return title;
}

function setAxisEncode(
  axis: Omit<VgAxis, 'orient' | 'scale'>,
  part: keyof AxisEncode,
  vgProp: VgEncodeChannel,
  vgRef: VgValueRef | readonly VgValueRef[],
) {
  axis.encode ??= {};
  axis.encode[part] ??= {};
  axis.encode[part].update ??= {};
  // TODO: remove as any after https://github.com/prisma/nexus-prisma/issues/291
  (axis.encode[part].update[vgProp] as any) = vgRef;
}

export function assembleAxis(
  axisCmpt: AxisComponent,
  kind: 'main' | 'grid',
  config: Config<SignalRef>,
  opt: {
    header: boolean; // whether this is called via a header
  } = {header: false},
): VgAxis {
  const {disable, orient, scale, labelExpr, title, zindex, ...axis} = axisCmpt.combine();

  if (disable) {
    return undefined;
  }

  for (const p in axis) {
    const prop = p as keyof typeof axis;
    const propType = AXIS_PROPERTY_TYPE[prop];
    const propValue = axis[prop];

    if (propType && propType !== kind && propType !== 'both') {
      // Remove properties that are not valid for this kind of axis
      delete axis[prop];
    } else if (isConditionalAxisValue<any, SignalRef>(propValue)) {
      // deal with conditional axis value

      const {condition, ...valueOrSignalRef} = propValue as any;
      const conditions = array(condition);

      const propIndex = CONDITIONAL_AXIS_PROP_INDEX[prop as ConditionalAxisProp];
      if (propIndex) {
        const {vgProp, part} = propIndex;
        // If there is a corresponding Vega property for the channel,
        // use Vega's custom axis encoding and delete the original axis property to avoid conflicts

        const vgRef = [
          ...conditions.map((c) => {
            const {test, ...valueOrSignalCRef} = c;
            return {
              test: expression(null, test),
              ...valueOrSignalCRef,
            };
          }),
          valueOrSignalRef,
        ];
        setAxisEncode(axis, part, vgProp, vgRef);
        delete axis[prop];
      } else if (propIndex === null) {
        // If propIndex is null, this means we support conditional axis property by converting the condition to signal instead.
        const signalRef: SignalRef = {
          signal:
            conditions
              .map((c) => {
                const {test, ...valueOrSignalCRef} = c;
                return `${expression(null, test)} ? ${exprFromValueRefOrSignalRef(valueOrSignalCRef)} : `;
              })
              .join('') + exprFromValueRefOrSignalRef(valueOrSignalRef),
        };
        (axis as any)[prop] = signalRef;
      }
    } else if (isSignalRef(propValue)) {
      const propIndex = CONDITIONAL_AXIS_PROP_INDEX[prop as ConditionalAxisProp];
      if (propIndex) {
        const {vgProp, part} = propIndex;
        // FIXME: remove as any
        setAxisEncode(axis, part, vgProp, propValue as any);
        delete axis[prop];
      } // else do nothing since the property already supports signal
    }

    // Do not pass labelAlign/Baseline = null to Vega since it won't pass the schema
    // Note that we need to use null so the default labelAlign is preserved.
    if (contains(['labelAlign', 'labelBaseline'], prop) && axis[prop] === null) {
      delete axis[prop];
    }
  }

  if (kind === 'grid') {
    if (!axis.grid) {
      return undefined;
    }

    // Remove unnecessary encode block
    if (axis.encode) {
      // Only need to keep encode block for grid
      const {grid} = axis.encode;
      axis.encode = {
        ...(grid ? {grid} : {}),
      };

      if (isEmpty(axis.encode)) {
        delete axis.encode;
      }
    }

    return {
      scale,
      orient,
      ...axis,
      domain: false,
      labels: false,
      aria: false, // always hide grid axis

      // Always set min/maxExtent to 0 to ensure that `config.axis*.minExtent` and `config.axis*.maxExtent`
      // would not affect gridAxis
      maxExtent: 0,
      minExtent: 0,
      ticks: false,
      zindex: getFirstDefined(zindex, 0), // put grid behind marks by default
    };
  } else {
    // kind === 'main'

    if (!opt.header && axisCmpt.mainExtracted) {
      // if mainExtracted has been extracted to a separate facet
      return undefined;
    }

    if (labelExpr !== undefined) {
      let expr = labelExpr;
      if (axis.encode?.labels?.update && isSignalRef(axis.encode.labels.update.text)) {
        expr = replaceAll(labelExpr, 'datum.label', axis.encode.labels.update.text.signal);
      }
      setAxisEncode(axis, 'labels', 'text', {signal: expr});
    }

    if (axis.labelAlign === null) {
      delete axis.labelAlign;
    }

    // Remove unnecessary encode block
    if (axis.encode) {
      for (const part of AXIS_PARTS) {
        if (!axisCmpt.hasAxisPart(part)) {
          delete axis.encode[part];
        }
      }
      if (isEmpty(axis.encode)) {
        delete axis.encode;
      }
    }

    const titleString = assembleTitle(title, config);

    return {
      scale,
      orient,
      grid: false,
      ...(titleString ? {title: titleString} : {}),
      ...axis,
      ...(config.aria === false ? {aria: false} : {}),
      zindex: getFirstDefined(zindex, 0), // put axis line above marks by default
    };
  }
}

/**
 * Add axis signals so grid line works correctly
 * (Fix https://github.com/vega/vega-lite/issues/4226)
 */
export function assembleAxisSignals(model: Model): NewSignal[] {
  const {axes} = model.component;
  const signals: NewSignal[] = [];

  for (const channel of POSITION_SCALE_CHANNELS) {
    if (axes[channel]) {
      for (const axis of axes[channel]) {
        if (!axis.get('disable') && !axis.get('gridScale')) {
          // If there is x-axis but no y-scale for gridScale, need to set height/width so x-axis can draw the grid with the right height. Same for y-axis and width.

          const sizeType = channel === 'x' ? 'height' : 'width';
          const update = model.getSizeSignalRef(sizeType).signal;

          if (sizeType !== update) {
            signals.push({
              name: sizeType,
              update,
            });
          }
        }
      }
    }
  }
  return signals;
}

export function assembleAxes(axisComponents: AxisComponentIndex, config: Config<SignalRef>): VgAxis[] {
  const {x = [], y = []} = axisComponents;
  return [
    ...x.map((a) => assembleAxis(a, 'grid', config)),
    ...y.map((a) => assembleAxis(a, 'grid', config)),
    ...x.map((a) => assembleAxis(a, 'main', config)),
    ...y.map((a) => assembleAxis(a, 'main', config)),
  ].filter((a) => a); // filter undefined
}
