import {isNumber, isString} from 'vega-util';
import {isMinMaxOp} from '../../aggregate.js';
import {getMainRangeChannel} from '../../channel.js';
import {isFieldDef, isFieldOrDatumDefForTimeFormat, isScaleFieldDef, isTypedFieldDef} from '../../channeldef.js';
import {isGenerator} from '../../data.js';
import {isDateTime} from '../../datetime.js';
import * as log from '../../log/index.js';
import {forEachLeaf} from '../../logical.js';
import {isPathMark} from '../../mark.js';
import {
  isFieldEqualPredicate,
  isFieldGTEPredicate,
  isFieldGTPredicate,
  isFieldLTEPredicate,
  isFieldLTPredicate,
  isFieldOneOfPredicate,
  isFieldPredicate,
  isFieldRangePredicate,
} from '../../predicate.js';
import {isSortField} from '../../sort.js';
import {accessPathDepth, accessPathWithDatum, duplicate, hash, keys, removePathFromField} from '../../util.js';
import {signalRefOrValue} from '../common.js';
import {isFacetModel, isUnitModel} from '../model.js';
import {Split} from '../split.js';
import {DataFlowNode} from './dataflow.js';
/**
 * Remove quotes from a string.
 */
function unquote(pattern) {
  if ((pattern.startsWith("'") && pattern.endsWith("'")) || (pattern.startsWith('"') && pattern.endsWith('"'))) {
    return pattern.slice(1, -1);
  }
  return pattern;
}
/**
 * @param field The field.
 * @param parse What to parse the field as.
 */
function parseExpression(field, parse) {
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
  } else if (parse.startsWith('date:')) {
    const specifier = unquote(parse.slice(5, parse.length));
    return `timeParse(${f},'${specifier}')`;
  } else if (parse.startsWith('utc:')) {
    const specifier = unquote(parse.slice(4, parse.length));
    return `utcParse(${f},'${specifier}')`;
  } else {
    log.warn(log.message.unrecognizedParse(parse));
    return null;
  }
}
export function getImplicitFromFilterTransform(transform) {
  const implicit = {};
  forEachLeaf(transform.filter, (filter) => {
    if (isFieldPredicate(filter)) {
      // Automatically add a parse node for filters with filter objects
      let val = null;
      // For EqualFilter, just use the equal property.
      // For RangeFilter and OneOfFilter, all array members should have
      // the same type, so we only use the first one.
      if (isFieldEqualPredicate(filter)) {
        val = signalRefOrValue(filter.equal);
      } else if (isFieldLTEPredicate(filter)) {
        val = signalRefOrValue(filter.lte);
      } else if (isFieldLTPredicate(filter)) {
        val = signalRefOrValue(filter.lt);
      } else if (isFieldGTPredicate(filter)) {
        val = signalRefOrValue(filter.gt);
      } else if (isFieldGTEPredicate(filter)) {
        val = signalRefOrValue(filter.gte);
      } else if (isFieldRangePredicate(filter)) {
        // FIXME: remove as any
        val = filter.range[0];
      } else if (isFieldOneOfPredicate(filter)) {
        val = (filter.oneOf ?? filter.in)[0];
      } // else -- for filter expression, we can't infer anything
      if (val) {
        if (isDateTime(val)) {
          implicit[filter.field] = 'date';
        } else if (isNumber(val)) {
          implicit[filter.field] = 'number';
        } else if (isString(val)) {
          implicit[filter.field] = 'string';
        }
      }
      if (filter.timeUnit) {
        implicit[filter.field] = 'date';
      }
    }
  });
  return implicit;
}
/**
 * Creates a parse node for implicit parsing from a model and updates ancestorParse.
 */
export function getImplicitFromEncoding(model) {
  const implicit = {};
  function add(fieldDef) {
    if (isFieldOrDatumDefForTimeFormat(fieldDef)) {
      implicit[fieldDef.field] = 'date';
    } else if (
      fieldDef.type === 'quantitative' &&
      isMinMaxOp(fieldDef.aggregate) // we need to parse numbers to support correct min and max
    ) {
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
        const mainFieldDef = model.fieldDef(mainChannel);
        add({
          ...fieldDef,
          type: mainFieldDef.type,
        });
      }
    });
  }
  // Parse quantitative dimension fields of path marks as numbers so that we sort them correctly.
  if (isUnitModel(model)) {
    const {mark, markDef, encoding} = model;
    if (
      isPathMark(mark) &&
      // No need to sort by dimension if we have a connected scatterplot (order channel is present)
      !model.encoding.order
    ) {
      const dimensionChannel = markDef.orient === 'horizontal' ? 'y' : 'x';
      const dimensionChannelDef = encoding[dimensionChannel];
      if (
        isFieldDef(dimensionChannelDef) &&
        dimensionChannelDef.type === 'quantitative' &&
        !(dimensionChannelDef.field in implicit)
      ) {
        implicit[dimensionChannelDef.field] = 'number';
      }
    }
  }
  return implicit;
}
/**
 * Creates a parse node for implicit parsing from a model and updates ancestorParse.
 */
export function getImplicitFromSelection(model) {
  const implicit = {};
  if (isUnitModel(model) && model.component.selection) {
    for (const name of keys(model.component.selection)) {
      const selCmpt = model.component.selection[name];
      for (const proj of selCmpt.project.items) {
        if (!proj.channel && accessPathDepth(proj.field) > 1) {
          implicit[proj.field] = 'flatten';
        }
      }
    }
  }
  return implicit;
}
export class ParseNode extends DataFlowNode {
  _parse;
  clone() {
    return new ParseNode(null, duplicate(this._parse));
  }
  constructor(parent, parse) {
    super(parent);
    this._parse = parse;
  }
  hash() {
    return `Parse ${hash(this._parse)}`;
  }
  /**
   * Creates a parse node from a data.format.parse and updates ancestorParse.
   */
  static makeExplicit(parent, model, ancestorParse) {
    // Custom parse
    let explicit = {};
    const data = model.data;
    if (!isGenerator(data) && data?.format?.parse) {
      explicit = data.format.parse;
    }
    return this.makeWithAncestors(parent, explicit, {}, ancestorParse);
  }
  /**
   * Creates a parse node from "explicit" parse and "implicit" parse and updates ancestorParse.
   */
  static makeWithAncestors(parent, explicit, implicit, ancestorParse) {
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
  get parse() {
    return this._parse;
  }
  merge(other) {
    this._parse = {...this._parse, ...other.parse};
    other.remove();
  }
  /**
   * Assemble an object for Vega's format.parse property.
   */
  assembleFormatParse() {
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
  producedFields() {
    return new Set(keys(this._parse));
  }
  dependentFields() {
    return new Set(keys(this._parse));
  }
  assembleTransforms(onlyNested = false) {
    return keys(this._parse)
      .filter((field) => (onlyNested ? accessPathDepth(field) > 1 : true))
      .map((field) => {
        const expr = parseExpression(field, this._parse[field]);
        if (!expr) {
          return null;
        }
        const formula = {
          type: 'formula',
          expr,
          as: removePathFromField(field), // Vega output is always flattened
        };
        return formula;
      })
      .filter((t) => t !== null);
  }
}
//# sourceMappingURL=formatparse.js.map
