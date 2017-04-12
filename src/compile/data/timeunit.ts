import {SpawnSyncOptionsWithStringEncoding} from 'child_process';
import {forEach} from '../../encoding';
import {field, FieldDef} from '../../fielddef';
import {fieldExpr, TimeUnit} from '../../timeunit';
import {TEMPORAL} from '../../type';
import {Dict, extend, StringSet, vals} from '../../util';
import {VgFormulaTransform, VgTransform} from '../../vega.schema';
import {format} from '../axis/rules';
import {Model} from '../model';
import {DataFlowNode, DependentNode, NewFieldNode} from './dataflow';

interface TimeUnitComponent {
    as: string;
    timeUnit: TimeUnit;
    field: string;
  }

export class TimeUnitNode extends DataFlowNode implements NewFieldNode, DependentNode {
  private formula: Dict<TimeUnitComponent>;

  constructor(model: Model) {
    super();

    this.formula = model.reduceFieldDef((timeUnitComponent: TimeUnitComponent, fieldDef: FieldDef) => {
      if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {
        const f = field(fieldDef);
        timeUnitComponent[f] = {
          as: f,
          timeUnit: fieldDef.timeUnit,
          field: fieldDef.field
        };
      }
      return timeUnitComponent;
    }, {} as Dict<TimeUnitComponent>);
  }

  public size() {
    return Object.keys(this.formula).length;
  }

  public merge(other: TimeUnitNode) {
    this.formula = extend(this.formula, other.formula);
    other.remove();
  }

  public producedFields() {
    const out = {};

    vals(this.formula).forEach(f => {
      out[f.as] = true;
    });

    return out;
  }

  public dependentFields() {
    const out = {};

    vals(this.formula).forEach(f => {
      out[f.field] = true;
    });

    return out;
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
