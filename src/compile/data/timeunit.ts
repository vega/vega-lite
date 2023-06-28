import {TimeUnitTransform as VgTimeUnitTransform} from 'vega';
import {FormulaTransform as VgFormulaTransform} from 'vega';
import {FieldName, vgField} from '../../channeldef';
import {
  TimeUnitParams,
  getDateTimePartAndStep,
  getSmallestTimeUnitPart,
  getTimeUnitParts,
  isBinnedTimeUnit,
  normalizeTimeUnit
} from '../../timeunit';
import {TimeUnitTransform} from '../../transform';
import {Dict, duplicate, entries, hash, isEmpty, replacePathInField, vals} from '../../util';
import {ModelWithField, isUnitModel} from '../model';
import {DataFlowNode} from './dataflow';
import {isRectBasedMark} from '../../mark';

export type TimeUnitComponent = TimeUnitTransform | BinnedTimeUnitOffset;

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
    return new TimeUnitNode(null, duplicate(this.formula));
  }

  constructor(parent: DataFlowNode, private formula: Dict<TimeUnitComponent>) {
    super(parent);
  }

  public static makeFromEncoding(parent: DataFlowNode, model: ModelWithField) {
    const formula = model.reduceFieldDef((timeUnitComponent: TimeUnitComponent, fieldDef) => {
      const {field, timeUnit} = fieldDef;

      if (timeUnit) {
        let component: TimeUnitComponent | undefined;
        if (isBinnedTimeUnit(timeUnit)) {
          // For binned time unit, only produce end if the mark is a rect-based mark (rect, bar, image, arc), which needs "range".

          if (isUnitModel(model)) {
            const {mark} = model;
            if (isRectBasedMark(mark) || !!fieldDef.bandPosition) {
              component = {
                timeUnit: normalizeTimeUnit(timeUnit),
                field
              };
            }
          }
        } else {
          component = {
            as: vgField(fieldDef, {forAs: true}),
            field,
            timeUnit
          };
        }
        if (component) {
          timeUnitComponent[hash(component)] = component;
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
      timeUnit: normalizedTimeUnit
    };

    return new TimeUnitNode(parent, {
      [hash(component)]: component
    });
  }

  /**
   * Merge together TimeUnitNodes assigning the children of `other` to `this`
   * and removing `other`.
   */
  public merge(other: TimeUnitNode) {
    this.formula = {...this.formula};

    // if the same hash happen twice, merge
    for (const key in other.formula) {
      if (!this.formula[key]) {
        // copy if it's not a duplicate
        this.formula[key] = other.formula[key];
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
    const newFormula = {};

    for (const [key, timeUnitComponent] of entries(this.formula)) {
      const fieldAs = isTimeUnitTransformComponent(timeUnitComponent)
        ? timeUnitComponent.as
        : `${timeUnitComponent.field}_end`;
      if (!fields.has(fieldAs)) {
        newFormula[key] = timeUnitComponent;
      }
    }

    this.formula = newFormula;
  }

  public producedFields() {
    return new Set(
      vals(this.formula).map(f => {
        return isTimeUnitTransformComponent(f) ? f.as : offsetAs(f.field);
      })
    );
  }

  public dependentFields() {
    return new Set(vals(this.formula).map(f => f.field));
  }

  public hash() {
    return `TimeUnit ${hash(this.formula)}`;
  }

  public assemble() {
    const transforms: (VgTimeUnitTransform | VgFormulaTransform)[] = [];

    for (const f of vals(this.formula)) {
      if (isTimeUnitTransformComponent(f)) {
        const {field, as, timeUnit} = f;
        const {unit, utc, ...params} = normalizeTimeUnit(timeUnit);

        transforms.push({
          field: replacePathInField(field),
          type: 'timeunit',
          ...(unit ? {units: getTimeUnitParts(unit)} : {}),
          ...(utc ? {timezone: 'utc'} : {}),
          ...params,
          as: [as, `${as}_end`]
        });
      } else if (f) {
        const {field, timeUnit} = f;
        const smallestUnit = getSmallestTimeUnitPart(timeUnit?.unit);
        const {part, step} = getDateTimePartAndStep(smallestUnit, timeUnit.step);
        transforms.push({
          type: 'formula',
          expr: `timeOffset('${part}', datum['${field}'], ${step})`,
          as: offsetAs(field)
        });
      }
    }

    return transforms;
  }
}
