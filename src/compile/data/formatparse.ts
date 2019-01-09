import {isNumber, isString} from 'vega-util';
import {AncestorParse} from '.';
import {isMinMaxOp} from '../../aggregate';
import {getMainRangeChannel, SingleDefChannel} from '../../channel';
import {Parse} from '../../data';
import {DateTime, isDateTime} from '../../datetime';
import {isNumberFieldDef, isScaleFieldDef, isTimeFieldDef, isTypedFieldDef, TypedFieldDef} from '../../fielddef';
import * as log from '../../log';
import {forEachLeaf} from '../../logical';
import {isFieldEqualPredicate, isFieldOneOfPredicate, isFieldPredicate, isFieldRangePredicate} from '../../predicate';
import {isSortField} from '../../sort';
import {FilterTransform} from '../../transform';
import {accessPathDepth, accessPathWithDatum, duplicate, hash, keys, removePathFromField} from '../../util';
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
  private _parse: Parse;

  public clone() {
    return new ParseNode(null, duplicate(this._parse));
  }

  constructor(parent: DataFlowNode, parse: Parse) {
    super(parent);

    this._parse = parse;
  }

  public hash() {
    return `Parse ${hash(this._parse)}`;
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

  public static makeImplicitFromFilterTransform(
    parent: DataFlowNode,
    transform: FilterTransform,
    ancestorParse: AncestorParse
  ) {
    const parse = {};
    forEachLeaf(transform.filter, filter => {
      if (isFieldPredicate(filter)) {
        // Automatically add a parse node for filters with filter objects
        let val: string | number | boolean | DateTime = null;

        // For EqualFilter, just use the equal property.
        // For RangeFilter and OneOfFilter, all array members should have
        // the same type, so we only use the first one.
        if (isFieldEqualPredicate(filter)) {
          val = filter.equal;
        } else if (isFieldRangePredicate(filter)) {
          val = filter.range[0];
        } else if (isFieldOneOfPredicate(filter)) {
          val = (filter.oneOf || filter['in'])[0];
        } // else -- for filter expression, we can't infer anything
        if (val) {
          if (isDateTime(val)) {
            parse[filter.field] = 'date';
          } else if (isNumber(val)) {
            parse[filter.field] = 'number';
          } else if (isString(val)) {
            parse[filter.field] = 'string';
          }
        }

        if (filter.timeUnit) {
          parse[filter.field] = 'date';
        }
      }
    });

    if (keys(parse).length === 0) {
      return null;
    }

    return this.makeWithAncestors(parent, {}, parse, ancestorParse);
  }

  /**
   * Creates a parse node for implicit parsing from a model and updates ancestorParse.
   */
  public static makeImplicitFromEncoding(parent: DataFlowNode, model: Model, ancestorParse: AncestorParse) {
    const implicit = {};

    function add(fieldDef: TypedFieldDef<string>) {
      if (isTimeFieldDef(fieldDef)) {
        implicit[fieldDef.field] = 'date';
      } else if (isNumberFieldDef(fieldDef) && isMinMaxOp(fieldDef.aggregate)) {
        implicit[fieldDef.field] = 'number';
      } else if (accessPathDepth(fieldDef.field) > 1) {
        // For non-date/non-number (strings and booleans), derive a flattened field for a referenced nested field.
        // (Parsing numbers / dates already flattens numeric and temporal fields.)
        if (!(fieldDef.field in implicit)) {
          implicit[fieldDef.field] = 'flatten';
        }
      } else if (isScaleFieldDef(fieldDef) && isSortField(fieldDef.sort) && accessPathDepth(fieldDef.sort.field) > 1) {
        // Flatten fields that we sort by but that are not otherwise flattened.
        if (!(fieldDef.sort.field in implicit)) {
          implicit[fieldDef.sort.field] = 'flatten';
        }
      }
    }

    if (isUnitModel(model) || isFacetModel(model)) {
      // Parse encoded fields
      model.forEachFieldDef((fieldDef, channel) => {
        if (isTypedFieldDef(fieldDef)) {
          add(fieldDef);
        } else {
          const mainChannel = getMainRangeChannel(channel);
          if (mainChannel !== channel) {
            const mainFieldDef = model.fieldDef(mainChannel as SingleDefChannel) as TypedFieldDef<string>;
            add({
              ...fieldDef,
              type: mainFieldDef.type
            });
          } else {
            throw new Error(
              `Non-secondary channel ${channel} must have type in its field definition ${JSON.stringify(fieldDef)}`
            );
          }
        }
      });
    }
    return this.makeWithAncestors(parent, {}, implicit, ancestorParse);
  }

  /**
   * Creates a parse node from "explicit" parse and "implicit" parse and updates ancestorParse.
   */
  private static makeWithAncestors(
    parent: DataFlowNode,
    explicit: Parse,
    implicit: Parse,
    ancestorParse: AncestorParse
  ) {
    // We should not parse what has already been parsed in a parent (explicitly or implicitly) or what has been derived (maked as "derived"). We also don't need to flatten a field that has already been parsed.
    for (const field of keys(implicit)) {
      const parsedAs = ancestorParse.getWithExplicit(field);
      if (parsedAs.value !== undefined) {
        // We always ignore derived fields even if they are implicitly defined because we expect users to create the right types.
        if (
          parsedAs.explicit ||
          parsedAs.value === implicit[field] ||
          parsedAs.value === 'derived' ||
          implicit[field] === 'flatten'
        ) {
          delete implicit[field];
        } else {
          log.warn(log.message.differentParse(field, implicit[field], parsedAs.value));
        }
      }
    }

    for (const field of keys(explicit)) {
      const parsedAs = ancestorParse.get(field);
      if (parsedAs !== undefined) {
        // Don't parse a field again if it has been parsed with the same type already.
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

    // copy only non-null parses
    const p = {};
    for (const key of keys(parse.combine())) {
      const val = parse.get(key);
      if (val !== null) {
        p[key] = val;
      }
    }

    if (keys(p).length === 0 || ancestorParse.parseNothing) {
      return null;
    }

    return new ParseNode(parent, p);
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
      if (accessPathDepth(field) === 1) {
        formatParse[field] = p;
      }
    }
    return formatParse;
  }

  // format parse depends and produces all fields in its parse
  public producedFields() {
    return new Set(keys(this._parse));
  }

  public dependentFields() {
    return new Set(keys(this._parse));
  }

  public assembleTransforms(onlyNested = false): VgFormulaTransform[] {
    return keys(this._parse)
      .filter(field => (onlyNested ? accessPathDepth(field) > 1 : true))
      .map(field => {
        const expr = parseExpression(field, this._parse[field]);
        if (!expr) {
          return null;
        }

        const formula: VgFormulaTransform = {
          type: 'formula',
          expr,
          as: removePathFromField(field) // Vega output is always flattened
        };
        return formula;
      })
      .filter(t => t !== null);
  }
}
