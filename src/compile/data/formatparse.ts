import {toSet} from 'vega-util';
import {AncestorParse} from '.';
import {isCountingAggregateOp} from '../../aggregate';
import {isNumberFieldDef, isTimeFieldDef} from '../../fielddef';
import * as log from '../../log';
import {accessPathDepth, accessPathWithDatum, Dict, duplicate, keys, removePathFromField, StringSet} from '../../util';
import {VgFormulaTransform} from '../../vega.schema';
import {isFacetModel, isUnitModel, Model} from '../model';
import {Split} from '../split';
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
  } else if (parse === null || parse === 'derived') {
    return null;  // not not parse field
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
  private _parse: Dict<string>;

  public clone() {
    return new ParseNode(null, duplicate(this.parse));
  }

  constructor(parent: DataFlowNode, parse: Dict<string>) {
    super(parent);

    this._parse = parse;
  }

  /**
   * Creates a parse node from a data.format.parse and updates ancestorParse.
   */
  public static makeExplicit(parent: DataFlowNode, model: Model, ancestorParse: AncestorParse) {
    // Custom parse
    let explicit = {};
    const data = model.data;
    if (data && data.format && data.format.parse) {
      explicit = data.format.parse;
    }

    return this.makeWithAncestors(parent, explicit, {}, ancestorParse);
  }

  /**
   * Creates a parse node for implicit parsing from a model and updates ancestorParse.
   */
  public static makeImplicit(parent: DataFlowNode, model: Model, ancestorParse: AncestorParse) {
    const implicit = {};

    if (isUnitModel(model) || isFacetModel(model)) {
      // Parse encoded fields
      model.forEachFieldDef(fieldDef => {
        if (isTimeFieldDef(fieldDef)) {
          implicit[fieldDef.field] = 'date';
        } else if (isNumberFieldDef(fieldDef)) {
          if (isCountingAggregateOp(fieldDef.aggregate)) {
            return;
          }
          implicit[fieldDef.field] = 'number';
        } else if (accessPathDepth(fieldDef.field) > 1) {
          // For non-date/non-number (strings and booleans), derive a flattened field for a referenced nested field.
          // (Parsing numbers / dates already flattens numeric and temporal fields.)
          implicit[fieldDef.field] = 'flatten';
        }
      });
    }

    return this.makeWithAncestors(parent, {}, implicit, ancestorParse);
  }

  /**
   * Creates a parse node from two sets of explicit and implicit parse and updates ancestorParse.
   */
  public static makeWithAncestors(parent: DataFlowNode, explicit: Dict<string>, implicit: Dict<string>, ancestorParse: AncestorParse) {
    // We should not parse what has already been parsed in a parent (explicitly or implicitly) or what has been derived (maked as "derived").
    for (const field of keys(implicit)) {
      const parsedAs = ancestorParse.getWithExplicit(field);
      if (parsedAs.value !== undefined) {
        // We always ignore derived fields even if they are implicitly defined because we expects users to create the right types.
        if (parsedAs.explicit || parsedAs.value === implicit[field] || parsedAs.value === 'derived') {
          delete implicit[field];
        } else {
          log.warn(log.message.differentParse(field, implicit[field], parsedAs.value));
        }
      }
    }

    for (const field of keys(explicit)) {
      const parsedAs = ancestorParse.get(field);
      if (parsedAs !== undefined) {
        if (parsedAs === explicit[field]) {
          delete explicit[field];
      } else {
          log.warn(log.message.differentParse(field, explicit[field], parsedAs));
        }
      }
    }

    const parse = new Split(explicit, implicit);

    // add the format parse from this model so that children don't parse the same field again
    ancestorParse.copyAll(parse);

    if (keys(parse.combine()).length === 0 || ancestorParse.parseNothing) {
      return null;
    }

    return new ParseNode(parent, parse.combine());
  }

  public get parse() {
    return this._parse;
  }

  public merge(other: ParseNode) {
    this._parse = {...this._parse, ...other.parse};
    other.remove();
  }

  /**
   * Assemble an object for Vega's format.parse property.
   */
  public assembleFormatParse() {
    const formatParse = {};
    for (const field of keys(this._parse)) {
      const p = this._parse[field];
      if (p !== null && p !== 'derived' && accessPathDepth(field) === 1) {
        formatParse[field] = p;
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
