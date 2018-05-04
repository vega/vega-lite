import {toSet} from 'vega-util';

import {isCountingAggregateOp} from '../../aggregate';
import {isNumberFieldDef, isTimeFieldDef} from '../../fielddef';
import * as log from '../../log';
import {forEachLeaf} from '../../logical';
import {isFieldPredicate} from '../../predicate';
import {isCalculate, isFilter, Transform} from '../../transform';
import {accessPathDepth, accessPathWithDatum, Dict, duplicate, keys, removePathFromField, StringSet} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';
import {isFacetModel, isUnitModel, Model} from '../model';
import {DataFlowNode} from './dataflow';

/**
 * @param field The field.
 * @param parse What to parse the field as.
 */
function parseExpression(field: string, parse: string): string {
  const f = accessPathWithDatum(field);
  if (parse === 'number') {
    return `toNumber(${f})`;
  } else if (parse === 'boolean') {
    return `toBoolean(${f})`;
  } else if (parse === 'string') {
    return `toString(${f})`;
  } else if (parse === 'date') {
    return `toDate(${f})`;
  } else if (parse === 'flatten') {
    return f;
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
    return new ParseNode(null, duplicate(this.parse));
  }

  constructor(parent: DataFlowNode, parse: Dict<string>) {
    super(parent);

    this._parse = parse;
  }

  public static make(parent: DataFlowNode, model: Model) {
    const parse = {};
    const calcFieldMap = {};

    (model.transforms || []).forEach((transform: Transform) => {
      if (isCalculate(transform)) {
        calcFieldMap[transform.as] = true;
      } else if (isFilter(transform)) {
        forEachLeaf(transform.filter, (filter) => {
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
        } else if (accessPathDepth(fieldDef.field) > 1) {
          // For non-date/non-number (strings and booleans), derive a flattened field for a referenced nested field.
          // (Parsing numbers / dates already flattens numeric and temporal fields.)
          parse[fieldDef.field] = 'flatten';
        }
      });
    }

    // Custom parse should override inferred parse
    const data = model.data;
    if (data && data.format) {
      const p = data.format.parse;
      if (p === null) {
        return null;  // disable parsing completely
      } else if (p) {
        keys(p).forEach(field => {
          parse[field] = p[field];
        });
      }
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

    // filter out parse == null (do not parse the field)
    for (const field of keys(parse)) {
      if (parse[field] === null) {
        delete parse[field];
      }
    }

    if (keys(parse).length === 0) {
      return null;
    }

    return new ParseNode(parent, parse);
  }

  public get parse() {
    return this._parse;
  }

  public merge(other: ParseNode) {
    this._parse = {...this._parse, ...other.parse};
    other.remove();
  }
  public assembleFormatParse() {
    const formatParse = {};
    for (const field of keys(this._parse)) {
      if (accessPathDepth(field) === 1) {
        formatParse[field] = this._parse[field];
      }
    }
    return formatParse;
  }

  // format parse depends and produces all fields in its parse
  public producedFields(): StringSet {
    return toSet(keys(this.parse));
  }

  public dependentFields(): StringSet {
    return toSet(keys(this.parse));
  }

  public assembleTransforms(onlyNested = false): VgFormulaTransform[] {
    return keys(this._parse)
      .filter(field => onlyNested ? accessPathDepth(field) > 1 : true)
      .map(field => {
        const expr = parseExpression(field, this._parse[field]);
        if (!expr) {
          return null;
        }

        const formula: VgFormulaTransform = {
          type: 'formula',
          expr,
          as: removePathFromField(field)  // Vega output is always flattened
        };
        return formula;
      }).filter(t => t !== null);
  }
}
