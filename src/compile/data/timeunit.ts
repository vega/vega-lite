import {TimeUnitTransform as VgTimeUnitTransform} from 'vega';
import {FormulaTransform as VgFormulaTransform} from 'vega';
import {FieldName, getBandPosition, vgField} from '../../channeldef.js';
import {
  TimeUnitParams,
  getDateTimePartAndStep,
  getSmallestTimeUnitPart,
  getTimeUnitParts,
  isBinnedTimeUnit,
  normalizeTimeUnit,
} from '../../timeunit.js';
import {TimeUnitTransform} from '../../transform.js';
import {
  accessWithDatumToUnescapedPath,
  Dict,
  duplicate,
  entries,
  hash,
  isEmpty,
  replacePathInField,
  unescapeSingleQuoteAndPathDot,
  vals,
} from '../../util.js';
import {ModelWithField, isUnitModel} from '../model.js';
import {DataFlowNode} from './dataflow.js';
import {isRectBasedMark} from '../../mark.js';
import {isXorY} from '../../channel.js';

export type TimeUnitComponent = (TimeUnitTransform | BinnedTimeUnitOffset) & {
  rectBandPosition?: number;
};

export interface BinnedTimeUnitOffset {
  timeUnit: TimeUnitParams;
  field: FieldName;
}

function isTimeUnitTransformComponent(timeUnitComponent: TimeUnitComponent): timeUnitComponent is TimeUnitTransform {
  return (timeUnitComponent as TimeUnitTransform).as !== undefined;
}

function offsetAs(field: FieldName) {
  return `${field}_end`;
}

export class TimeUnitNode extends DataFlowNode {
  public clone() {
    return new TimeUnitNode(null, duplicate(this.timeUnits));
  }

  constructor(
    parent: DataFlowNode,
    private timeUnits: Dict<TimeUnitComponent>,
  ) {
    super(parent);
  }

  public static makeFromEncoding(parent: DataFlowNode, model: ModelWithField) {
    const formula = model.reduceFieldDef((timeUnitComponent: TimeUnitComponent, fieldDef, channel) => {
      const {field, timeUnit} = fieldDef;

      if (timeUnit) {
        let component: TimeUnitComponent | undefined;

        if (isBinnedTimeUnit(timeUnit)) {
          // For binned time unit, only produce end if the mark is a rect-based mark (rect, bar, image, arc), which needs "range".

          if (isUnitModel(model)) {
            const {mark, markDef, config} = model;
            const bandPosition = getBandPosition({fieldDef, markDef, config});
            if (isRectBasedMark(mark) || !!bandPosition) {
              component = {
                timeUnit: normalizeTimeUnit(timeUnit),
                field,
              };
            }
          }
        } else {
          component = {
            as: vgField(fieldDef, {forAs: true}),
            field,
            timeUnit,
          };
        }

        if (isUnitModel(model)) {
          const {mark, markDef, config} = model;
          const bandPosition = getBandPosition({fieldDef, markDef, config});
          if (isRectBasedMark(mark) && isXorY(channel) && bandPosition !== 0.5) {
            component.rectBandPosition = bandPosition;
          }
        }

        if (component) {
          (timeUnitComponent as any)[hash(component)] = component;
        }
      }
      return timeUnitComponent;
    }, {} as Dict<TimeUnitComponent>);

    if (isEmpty(formula)) {
      return null;
    }

    return new TimeUnitNode(parent, formula);
  }

  public static makeFromTransform(parent: DataFlowNode, t: TimeUnitTransform) {
    const {timeUnit, ...other} = {...t};

    const normalizedTimeUnit = normalizeTimeUnit(timeUnit);

    const component = {
      ...other,
      timeUnit: normalizedTimeUnit,
    };

    return new TimeUnitNode(parent, {
      [hash(component)]: component,
    });
  }

  /**
   * Merge together TimeUnitNodes assigning the children of `other` to `this`
   * and removing `other`.
   */
  public merge(other: TimeUnitNode) {
    this.timeUnits = {...this.timeUnits};

    // if the same hash happen twice, merge
    for (const key in other.timeUnits) {
      if (!this.timeUnits[key]) {
        // copy if it's not a duplicate
        this.timeUnits[key] = other.timeUnits[key];
      }
    }

    for (const child of other.children) {
      other.removeChild(child);
      child.parent = this;
    }

    other.remove();
  }

  /**
   * Remove time units coming from the other node.
   */
  public removeFormulas(fields: Set<string>) {
    const newFormula: Dict<TimeUnitComponent> = {};

    for (const [key, timeUnitComponent] of entries(this.timeUnits)) {
      const fieldAs = isTimeUnitTransformComponent(timeUnitComponent)
        ? timeUnitComponent.as
        : `${timeUnitComponent.field}_end`;
      if (!fields.has(fieldAs)) {
        newFormula[key] = timeUnitComponent;
      }
    }

    this.timeUnits = newFormula;
  }

  public producedFields() {
    return new Set(
      vals(this.timeUnits).map((f) => {
        return isTimeUnitTransformComponent(f) ? f.as : offsetAs(f.field);
      }),
    );
  }

  public dependentFields() {
    return new Set(vals(this.timeUnits).map((f) => f.field));
  }

  public hash() {
    return `TimeUnit ${hash(this.timeUnits)}`;
  }

  public assemble() {
    const transforms: (VgTimeUnitTransform | VgFormulaTransform)[] = [];

    for (const f of vals(this.timeUnits)) {
      const {rectBandPosition} = f;
      const normalizedTimeUnit = normalizeTimeUnit(f.timeUnit);

      if (isTimeUnitTransformComponent(f)) {
        const {field, as} = f;
        const {unit, utc, ...params} = normalizedTimeUnit;

        const startEnd: [string, string] = [as, `${as}_end`];

        transforms.push({
          field: replacePathInField(field),
          type: 'timeunit',
          ...(unit ? {units: getTimeUnitParts(unit)} : {}),
          ...(utc ? {timezone: 'utc'} : {}),
          ...params,
          as: startEnd,
        });

        transforms.push(...offsetedRectFormulas(startEnd, rectBandPosition, normalizedTimeUnit));
      } else if (f) {
        const {field: escapedField} = f;
        // since this is a expression, we want the unescaped field name
        const field = unescapeSingleQuoteAndPathDot(escapedField);
        const expr = offsetExpr({timeUnit: normalizedTimeUnit, field});
        const endAs = offsetAs(field);
        transforms.push({
          type: 'formula',
          expr,
          as: endAs,
        });

        transforms.push(...offsetedRectFormulas([field, endAs], rectBandPosition, normalizedTimeUnit));
      }
    }

    return transforms;
  }
}

export const OFFSETTED_RECT_START_SUFFIX = 'offsetted_rect_start';
export const OFFSETTED_RECT_END_SUFFIX = 'offsetted_rect_end';

function offsetExpr({timeUnit, field, reverse}: {timeUnit: TimeUnitParams; field: string; reverse?: boolean}) {
  const {unit, utc} = timeUnit;
  const smallestUnit = getSmallestTimeUnitPart(unit);
  const {part, step} = getDateTimePartAndStep(smallestUnit, timeUnit.step);
  const offsetFn = utc ? 'utcOffset' : 'timeOffset';
  const expr = `${offsetFn}('${part}', ${accessWithDatumToUnescapedPath(field)}, ${reverse ? -step : step})`;
  return expr;
}

function offsetedRectFormulas(
  [startField, endField]: [string, string],
  rectBandPosition: number | undefined,
  timeUnit: TimeUnitParams,
): VgFormulaTransform[] {
  if (rectBandPosition !== undefined && rectBandPosition !== 0.5) {
    const startExpr = accessWithDatumToUnescapedPath(startField);
    const endExpr = accessWithDatumToUnescapedPath(endField);
    return [
      {
        type: 'formula',
        expr: interpolateExpr(
          [
            offsetExpr({
              timeUnit,
              field: startField,
              reverse: true,
            }),
            startExpr,
          ],
          rectBandPosition + 0.5,
        ),
        as: `${startField}_${OFFSETTED_RECT_START_SUFFIX}`,
      },
      {
        type: 'formula',
        expr: interpolateExpr([startExpr, endExpr], rectBandPosition + 0.5),
        as: `${startField}_${OFFSETTED_RECT_END_SUFFIX}`,
      },
    ];
  }
  return [];
}

function interpolateExpr([start, end]: [string, string], fraction: number) {
  return `${1 - fraction} * ${start} + ${fraction} * ${end}`;
}
