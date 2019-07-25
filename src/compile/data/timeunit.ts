import {vgField} from '../../channeldef';
import {fieldExpr} from '../../timeunit';
import {TimeUnitTransform} from '../../transform';
import {Dict, duplicate, hash, keys, vals} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';
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
    const formula = model.reduceFieldDef(
      (timeUnitComponent: TimeUnitComponent, fieldDef) => {
        const {timeUnit, field} = fieldDef;
        if (timeUnit) {
          const as = vgField(fieldDef, {forAs: true});
          const component = {as, timeUnit, field};
          timeUnitComponent[hash(component)] = component;
        }
        return timeUnitComponent;
      },
      {} as Dict<TimeUnitComponent>
    );

    if (keys(formula).length === 0) {
      return null;
    }

    return new TimeUnitNode(parent, formula);
  }

  public static makeFromTransform(parent: DataFlowNode, t: TimeUnitTransform) {
    const component = {...t};

    return new TimeUnitNode(parent, {
      [hash(component)]: component
    });
  }

  /**
   * Merge together TimeUnitNodes assigning the children of `other` to `this`
   * and removing `other`.
   */
  public merge(other: TimeUnitNode) {
    this.formula = {...this.formula, ...other.formula};
    for (const child of other.children) {
      other.removeChild(child);
      child.parent = this;
    }
    other.remove();
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
    return vals(this.formula).map(c => {
      return {
        type: 'formula',
        as: c.as,
        expr: fieldExpr(c.timeUnit, c.field)
      } as VgFormulaTransform;
    });
  }
}
