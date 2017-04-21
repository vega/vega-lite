import {SpawnSyncOptionsWithStringEncoding} from 'child_process';
import {field, FieldDef} from '../../fielddef';
import {fieldExpr, TimeUnit} from '../../timeunit';
import {TEMPORAL} from '../../type';
import {Dict, duplicate, extend, StringSet, vals} from '../../util';
import {VgFormulaTransform, VgTransform} from '../../vega.schema';
import {format} from '../axis/rules';
import {ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';


export interface TimeUnitComponent {
  as: string;
  timeUnit: TimeUnit;
  field: string;
}

export class TimeUnitNode extends DataFlowNode {
  public clone() {
    return new TimeUnitNode(duplicate(this.formula));
  }

  constructor(private formula: Dict<TimeUnitComponent>) {
    super();
  }

  public static make(model: ModelWithField) {
    const formula = model.reduceFieldDef((timeUnitComponent: TimeUnitComponent, fieldDef) => {
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

    if (Object.keys(formula).length === 0) {
      return null;
    }

    return new TimeUnitNode(formula);
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
