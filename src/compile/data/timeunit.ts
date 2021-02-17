import {TimeUnitTransform as VgTimeUnitTransform} from 'vega';
import {vgField} from '../../channeldef';
import {getTimeUnitParts, normalizeTimeUnit} from '../../timeunit';
import {TimeUnitTransform} from '../../transform';
import {Dict, duplicate, entries, hash, isEmpty, replacePathInField, vals} from '../../util';
import {ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';

export type TimeUnitComponent = TimeUnitTransform;

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
        const as = vgField(fieldDef, {forAs: true});
        timeUnitComponent[
          hash({
            as,
            field,
            timeUnit
          })
        ] = {
          as,
          field,
          timeUnit
        };
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

    for (const [key, timeUnit] of entries(this.formula)) {
      if (!fields.has(timeUnit.as)) {
        newFormula[key] = timeUnit;
      }
    }

    this.formula = newFormula;
  }

  public producedFields() {
    return new Set(vals(this.formula).map(f => f.as));
  }

  public dependentFields() {
    return new Set(vals(this.formula).map(f => f.field));
  }

  public hash() {
    return `TimeUnit ${hash(this.formula)}`;
  }

  public assemble() {
    const transforms: VgTimeUnitTransform[] = [];

    for (const f of vals(this.formula)) {
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
    }

    return transforms;
  }
}
