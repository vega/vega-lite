import {isTypedFieldDef, vgField} from '../../channeldef';
import {fieldExpr} from '../../timeunit';
import {TimeUnitTransform} from '../../transform';
import {contains, Dict, duplicate, hash, keys, vals} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';
import {isUnitModel, ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';

export type TimeUnitComponent = TimeUnitTransform & {
  /** whether to output time unit as a band (generate two formula including start and end) */
  band?: boolean;
};

export class TimeUnitNode extends DataFlowNode {
  public clone() {
    return new TimeUnitNode(null, duplicate(this.formula));
  }

  constructor(parent: DataFlowNode, private formula: Dict<TimeUnitComponent>) {
    super(parent);
  }

  public static makeFromEncoding(parent: DataFlowNode, model: ModelWithField) {
    const formula = model.reduceFieldDef(
      (timeUnitComponent: TimeUnitComponent, fieldDef, channel) => {
        const {timeUnit, field} = fieldDef;
        if (timeUnit) {
          const as = vgField(fieldDef, {forAs: true});
          const component = {
            as,
            timeUnit,
            field,
            band:
              isUnitModel(model) &&
              contains(['x', 'y'], channel) &&
              (isTypedFieldDef(fieldDef) && fieldDef.type === 'temporal')
          };
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
    const transforms: VgFormulaTransform[] = [];

    for (const f of vals(this.formula)) {
      const {timeUnit, field, as, band} = f;
      transforms.push({
        type: 'formula',
        as,
        expr: fieldExpr(timeUnit, field)
      });

      if (band) {
        transforms.push({
          type: 'formula',
          as: as + '_end',
          expr: fieldExpr(timeUnit, field, {end: true})
        });
      }
    }

    return transforms;
  }
}
