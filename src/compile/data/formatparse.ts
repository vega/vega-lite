import {isCountingAggregateOp} from '../../aggregate';
import {isNumberFieldDef, isTimeFieldDef} from '../../fielddef';
import * as log from '../../log';
import {forEachLeave} from '../../logical';
import {isFieldPredicate} from '../../predicate';
import {isCalculate, isFilter, Transform} from '../../transform';
import {accessPath, Dict, duplicate, keys, toSet} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';
import {isFacetModel, isUnitModel, Model} from '../model';
import {DataFlowNode} from './dataflow';


function parseExpression(field: string, parse: string): string {
  const f = `datum${accessPath(field)}`;
  if (parse === 'number') {
    return `toNumber(${f})`;
  } else if (parse === 'boolean') {
    return `toBoolean(${f})`;
  } else if (parse === 'string') {
    return `toString(${f})`;
  } else if (parse === 'date') {
    return `toDate(${f})`;
  } else if (parse.indexOf('date:') === 0) {
    const specifier = parse.slice(5, parse.length);
    return `timeParse(${f},${specifier})`;
  } else if (parse.indexOf('utc:') === 0) {
    const specifier = parse.slice(4, parse.length);
    return `utcParse(${f},${specifier})`;
  } else {
    log.warn(log.message.unrecognizedParse(parse));
    return null;
  }
}

export class ParseNode extends DataFlowNode {
  private _parse: Dict<string> = {};

  public clone() {
    return new ParseNode(duplicate(this.parse));
  }

  constructor(parse: Dict<string>) {
    super();

    this._parse = parse;
  }

  public static make(model: Model) {
    const parse = {};
    const calcFieldMap = {};

    (model.transforms || []).forEach((transform: Transform) => {
      if (isCalculate(transform)) {
        calcFieldMap[transform.as] = true;
      } else if (isFilter(transform)) {
        forEachLeave(transform.filter, (filter) => {
          if (isFieldPredicate(filter)) {
            if (filter.timeUnit) {
              parse[filter.field] = 'date';
            }
          }
        });
      }
    }, {});

    if (isUnitModel(model) || isFacetModel(model)) {
      // Parse encoded fields
      model.forEachFieldDef(fieldDef => {
        if (isTimeFieldDef(fieldDef)) {
          parse[fieldDef.field] = 'date';
        } else if (isNumberFieldDef(fieldDef)) {
          if (calcFieldMap[fieldDef.field] || isCountingAggregateOp(fieldDef.aggregate)) {
            return;
          }
          parse[fieldDef.field] = 'number';
        }
      });
    }

    // Custom parse should override inferred parse
    const data = model.data;
    if (data && data.format && data.format.parse) {
      const p = data.format.parse;
      keys(p).forEach(field => {
        parse[field] = p[field];
      });
    }

    // We should not parse what has already been parsed in a parent
    const modelParse = model.component.data.ancestorParse;
    keys(modelParse).forEach(field => {
      if (parse[field] !== modelParse[field]) {
        log.warn(log.message.differentParse(field, parse[field], modelParse[field]));
      } else {
        delete parse[field];
      }
    });

    if (keys(parse).length === 0) {
      return null;
    }

    return new ParseNode(parse);
  }

  public get parse() {
    return this._parse;
  }

  public merge(other: ParseNode) {
    this._parse = {...this._parse, ...other.parse};
    other.remove();
  }
  public assembleFormatParse() {
    return this._parse;
  }

  // format parse depends and produces all fields in its parse
  public producedFields() {
    return toSet(keys(this.parse));
  }

  public dependentFields() {
    return toSet(keys(this.parse));
  }

  public assembleTransforms(): VgFormulaTransform[] {
    return keys(this._parse).map(field => {
      const expr = parseExpression(field, this._parse[field]);
      if (!expr) {
        return null;
      }

      const formula: VgFormulaTransform = {
        type: 'formula',
        expr,
        as: field
      };
      return formula;
    }).filter(t => t !== null);
  }
}
