import {AggregateOp} from '../aggregate';
import {autoMaxBins} from '../bin';
import {Channel, COLOR} from '../channel';
import {SOURCE, STACKED_SCALE, SUMMARY} from '../data';
import {field, FieldDef, isCount} from '../fielddef';
import {ScaleType} from '../scale';
import {TimeUnit} from '../timeunit';
import {Formula} from '../transform';
import {QUANTITATIVE, TEMPORAL, ORDINAL} from '../type';
import {extend, keys, vals, reduce, contains, flatten, Dict, StringSet} from '../util';
import {VgData, VgTransform} from '../vega.schema';

import {FacetModel} from './facet';
import {Model} from './model';
import {parseExpression, rawDomain} from './time';
import {UnitModel} from './unit';

const DEFAULT_NULL_FILTERS = {
  nominal: false,
  ordinal: false,
  quantitative: true,
  temporal: true
};

/**
 * Composable component instance of a model's data.
 */
export interface DataComponent {
  source?: VgData;

  /** Mapping from field name to primitive data type.  */
  formatParse?: Dict<string>;

  /** String set of fields for null filtering */
  nullFilter?: StringSet;

  /** Hashset of a formula object */
  calculate?: Dict<Formula>;

  /** Filter test expression */
  filter?: string;

  /** Dictionary mapping a bin parameter hash to transforms of the binned field */
  bin?: Dict<VgTransform[]>;

  /** Dictionary mapping an output field name (hash) to the time unit transform  */
  timeUnit?: Dict<VgTransform>;

  /** String set of fields to be filtered */
  nonPositiveFilter?: StringSet;

  /** Data source for feeding stacked scale. */
  // TODO: need to revise if single VgData is sufficient with layer / concat
  stackScale?: VgData;

  /** Dictionary mapping an output field name (hash) to the sort and rank transforms  */
  colorRank?: Dict<VgTransform[]>;

  /** String set of time units that need their own data sources for scale domain */
  timeUnitDomain?: StringSet;

  /** Array of summary component object for producing summary (aggregate) data source */
  summary?: SummaryComponent[];
}

/**
 * Composable component for a model's summary data
 */
interface SummaryComponent {
  /** Name of the summary data source */
  name: string;

  /** Source for the summary data source */
  source: string;

  /** String set for all dimension fields  */
  dimensions: StringSet;

  /** dictionary mapping field name to string set of aggregate ops */
  measures: Dict<StringSet>;
}

// TODO: split this file into multiple files and remove this linter flag
/* tslint:disable:no-use-before-declare */

export function parseUnitData(model: UnitModel): DataComponent {
  let data: DataComponent = {};
  data.source = source.parseUnit(model);
  data.formatParse = formatParse.parseUnit(model);
  data.nullFilter = nullFilter.parseUnit(model);
  data.filter = filter.parseUnit(model);
  data.bin = bin.parseUnit(model);
  data.calculate = formula.parseUnit(model);
  data.timeUnit = timeUnit.parseUnit(model);
  data.timeUnitDomain = timeUnitDomain.parseUnit(model);
  data.summary = summary.parseUnit(model);
  data.stackScale = stackScale.parseUnit(model);
  data.colorRank = colorRank.parseUnit(model);
  data.nonPositiveFilter = nonPositiveFilter.parseUnit(model);
  return data;
}

export function parseFacetData(model: FacetModel): DataComponent {
  let data: DataComponent = {};
  data.source = source.parseFacet(model);
  data.formatParse = formatParse.parseFacet(model);
  data.nullFilter = nullFilter.parseFacet(model);
  data.filter = filter.parseFacet(model);
  data.bin = bin.parseFacet(model);
  data.calculate = formula.parseFacet(model);
  data.timeUnit = timeUnit.parseFacet(model);
  data.timeUnitDomain = timeUnitDomain.parseFacet(model);
  data.summary = summary.parseFacet(model);
  data.stackScale = stackScale.parseFacet(model);
  data.colorRank = colorRank.parseFacet(model);
  data.nonPositiveFilter = nonPositiveFilter.parseFacet(model);
  return data;
}
/* tslint:enable:no-use-before-declare */

/**
 * Creates Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
export function assembleData(model: Model, data: VgData[]) {
  const component = model.component.data;

  const sourceData = source.assemble(component);
  if (sourceData) {
    data.push(sourceData);
  }

  summary.assemble(component).forEach(function(summaryData) {
    data.push(summaryData);
  });

  if (data.length > 0) {
    const dataTable = data[data.length - 1];

    // color rank
    const colorRankTransform = colorRank.assemble(component);
    if (colorRankTransform.length > 0) {
      dataTable.transform = (dataTable.transform || []).concat(colorRankTransform);
    }

    // nonPositiveFilter
    const nonPositiveFilterTransform = nonPositiveFilter.assemble(component);
    if (nonPositiveFilterTransform.length > 0 ) {
      dataTable.transform = (dataTable.transform || []).concat(nonPositiveFilterTransform);
    }
  } else {
    if (keys(component.colorRank).length > 0) {
      throw new Error('Invalid colorRank not merged');
    } else if (keys(component.nonPositiveFilter).length > 0) {
      throw new Error('Invalid nonPositiveFilter not merged');
    }
  }

  // stack
  // TODO: revise if this actually should be an array
  const stackData = stackScale.assemble(component);
  if (stackData) {
    data.push(stackData);
  }

  timeUnitDomain.assemble(component).forEach(function(timeUnitDomainData) {
    data.push(timeUnitDomainData);
  });
  return data;
}

export namespace source {
  function parse(model: Model): VgData {
    let data = model.data();

    if (data) {
      // If data is explicitly provided

      let sourceData: VgData = { name: model.dataName(SOURCE) };
      if (data.values && data.values.length > 0) {
        sourceData.values = model.data().values;
        sourceData.format = { type: 'json' };
      } else if (data.url) {
        sourceData.url = data.url;

        // Extract extension from URL using snippet from
        // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
        let defaultExtension = /(?:\.([^.]+))?$/.exec(sourceData.url)[1];
        if (!contains(['json', 'csv', 'tsv'], defaultExtension)) {
          defaultExtension = 'json';
        }
        sourceData.format = { type: model.data().formatType || defaultExtension };
      }
      return sourceData;
    } else if (!model.parent()) {
      // If data is not explicitly provided but the model is a root,
      // need to produce a source as well

      return { name: model.dataName(SOURCE) };
    }
    return undefined;
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let sourceData = parse(model);
    if (!model.child().component.data.source) {
      // If the child does not have its own source, have to rename its source.
      model.child().renameData(model.child().dataName(SOURCE), model.dataName(SOURCE));
    }

    return sourceData;
  }

  export function assemble(component: DataComponent) {
    if (component.source) {
      let sourceData: VgData = component.source;

      if (component.formatParse) {
        component.source.format = component.source.format || {};
        component.source.format.parse = component.formatParse;
      }

      // null filter comes first so transforms are not performed on null values
      // time and bin should come before filter so we can filter by time and bin
      sourceData.transform = [].concat(
        nullFilter.assemble(component),
        formula.assemble(component),
        filter.assemble(component),
        bin.assemble(component),
        timeUnit.assemble(component)
      );

      return sourceData;
    }
    return null;
  }
}

export namespace formatParse {
  // TODO: need to take calculate into account across levels when merging
  function parse(model: Model) {
    const calcFieldMap = (model.transform().calculate || []).reduce(function(fieldMap, formula) {
        fieldMap[formula.field] = true;
        return fieldMap;
    }, {});

    let parseComponent;
    // use forEach rather than reduce so that it can return undefined
    // if there is no parse needed
    model.forEach(function(fieldDef: FieldDef) {
      if (fieldDef.type === TEMPORAL) {
        parseComponent = parseComponent || {};
        parseComponent[fieldDef.field] = 'date';
      } else if (fieldDef.type === QUANTITATIVE) {
        if (isCount(fieldDef) || calcFieldMap[fieldDef.field]) {
            return;
        }
        parseComponent = parseComponent || {};
        parseComponent[fieldDef.field] = 'number';
      }
    });
    return parseComponent;
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let parseComponent = parse(model);

    // If child doesn't have its own data source, but has its own parse, then merge
    const childDataComponent = model.child().component.data;
    if (!childDataComponent.source && childDataComponent.formatParse) {
      parseComponent = extend(parseComponent || {}, childDataComponent.formatParse);
      delete childDataComponent.formatParse;
    }
    return parseComponent;
  }

  // Assemble for formatParse is an identity functio, no need to declare
}


export namespace timeUnit {
  function parse(model: Model) {
    return model.reduce(function(timeUnitComponent, fieldDef: FieldDef, channel: Channel) {
      const ref = field(fieldDef, { nofn: true, datum: true });
      if (fieldDef.type === TEMPORAL && fieldDef.timeUnit) {

        const hash = field(fieldDef);

        timeUnitComponent[hash] = {
          type: 'formula',
          field: field(fieldDef),
          expr: parseExpression(fieldDef.timeUnit, ref)
        };
      }
      return timeUnitComponent;
    }, {});
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let timeUnitComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(timeUnitComponent, childDataComponent.timeUnit);
      delete childDataComponent.timeUnit;
    }
    return timeUnitComponent;
  }

  export function assemble(component: DataComponent) {
    // just join the values, which are already transforms
    return vals(component.timeUnit);
  }
}

export namespace bin {
  function parse(model: Model) {
    return model.reduce(function(binComponent, fieldDef: FieldDef, channel: Channel) {
      const bin = model.fieldDef(channel).bin;
      if (bin) {
        let binTrans = extend({
          type: 'bin',
          field: fieldDef.field,
          output: {
            start: field(fieldDef, { binSuffix: '_start' }),
            mid: field(fieldDef, { binSuffix: '_mid' }),
            end: field(fieldDef, { binSuffix: '_end' })
          }
        },
          // if bin is an object, load parameter here!
          typeof bin === 'boolean' ? {} : bin
        );

        if (!binTrans.maxbins && !binTrans.step) {
          // if both maxbins and step are not specified, need to automatically determine bin
          binTrans.maxbins = autoMaxBins(channel);
        }

        const transform = [binTrans];
        const isOrdinalColor = model.isOrdinalScale(channel) || channel === COLOR;
        // color ramp has type linear or time
        if (isOrdinalColor) {
          transform.push({
            type: 'formula',
            field: field(fieldDef, { binSuffix: '_range' }),
            expr: field(fieldDef, { datum: true, binSuffix: '_start' }) +
            ' + \'-\' + ' +
            field(fieldDef, { datum: true, binSuffix: '_end' })
          });
        }
        // FIXME: current merging logic can produce redundant transforms when a field is binned for color and for non-color
        const hash = JSON.stringify(bin) + '_' + fieldDef.field + 'oc:' + isOrdinalColor;
        binComponent[hash] = transform;
      }
      return binComponent;
    }, {});
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let binComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      // FIXME: current merging logic can produce redundant transforms when a field is binned for color and for non-color
      extend(binComponent, childDataComponent.bin);
      delete childDataComponent.bin;
    }
    return binComponent;
  }

  export function assemble(component: DataComponent) {
    return flatten(vals(component.bin));
  }
}

export namespace nullFilter {
  /** Return Hashset of fields for null filtering (key=field, value = true). */
  function parse(model: Model) {
    const filterNull = model.transform().filterNull;
    return model.reduce(function(aggregator, fieldDef: FieldDef) {
      if (filterNull ||
        (filterNull === undefined && fieldDef.field && fieldDef.field !== '*' && DEFAULT_NULL_FILTERS[fieldDef.type])) {
        aggregator[fieldDef.field] = true;
      }
      return aggregator;
    }, {});
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let nullFilterComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(nullFilterComponent, childDataComponent.nullFilter);
      delete childDataComponent.nullFilter;
    }
    return nullFilterComponent;
  }

  /** Convert the hashset of fields to a filter transform.  */
  export function assemble(component: DataComponent) {
    const filteredFields = keys(component.nullFilter);
    return filteredFields.length > 0 ?
      [{
        type: 'filter',
        test: filteredFields.map(function(fieldName) {
          return 'datum.' + fieldName + '!==null';
        }).join(' && ')
      }] : [];
  }
}

export namespace filter {
  function parse(model: Model): string {
    return model.transform().filter;
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let filterComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source but has filter, then merge
    if (!childDataComponent.source && childDataComponent.filter) {
      // merge by adding &&
      filterComponent =
        (filterComponent ?  filterComponent + ' && ' : '') +
        childDataComponent.filter;
      delete childDataComponent.filter;
    }
    return filterComponent;
  }

  export function assemble(component: DataComponent) {
    const filter = component.filter;
    return filter ? [{
      type: 'filter',
      test: filter
    }] : [];
  }
}

export namespace formula {
  function parse(model: Model): Dict<Formula> {
    return (model.transform().calculate || []).reduce(function(formulaComponent, formula) {
      formulaComponent[JSON.stringify(formula)] = formula;
      return formulaComponent;
    }, {} as Dict<Formula>);
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    let formulaComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      extend(formulaComponent, childDataComponent.calculate);
      delete childDataComponent.calculate;
    }
    return formulaComponent;
  }

  export function assemble(component: DataComponent) {
    return vals(component.calculate).reduce(function(transform, formula) {
      transform.push(extend({ type: 'formula' }, formula));
      return transform;
    }, []);
  }
}

export namespace summary {
  function addDimension(dims: { [field: string]: boolean }, fieldDef: FieldDef) {
    if (fieldDef.bin) {
      dims[field(fieldDef, { binSuffix: '_start' })] = true;
      dims[field(fieldDef, { binSuffix: '_mid' })] = true;
      dims[field(fieldDef, { binSuffix: '_end' })] = true;

      // const scale = model.scale(channel);
      // if (scaleType(scale, fieldDef, channel, model.mark()) === ScaleType.ORDINAL) {
      // also produce bin_range if the binned field use ordinal scale
      dims[field(fieldDef, { binSuffix: '_range' })] = true;
      // }
    } else {
      dims[field(fieldDef)] = true;
    }
    return dims;
  }

  export function parseUnit(model: Model): SummaryComponent[] {
    /* string set for dimensions */
    let dims: StringSet = {};

    /* dictionary mapping field name => dict set of aggregation functions */
    let meas: Dict<StringSet> = {};

    model.forEach(function(fieldDef: FieldDef, channel: Channel) {
      if (fieldDef.aggregate) {
        if (fieldDef.aggregate === AggregateOp.COUNT) {
          meas['*'] = meas['*'] || {};
          /* tslint:disable:no-string-literal */
          meas['*']['count'] = true;
          /* tslint:enable:no-string-literal */
        } else {
          meas[fieldDef.field] = meas[fieldDef.field] || {};
          meas[fieldDef.field][fieldDef.aggregate] = true;
        }
      } else {
        addDimension(dims, fieldDef);
      }
    });

    return [{
      name: model.dataName(SUMMARY),
      source: model.dataName(SOURCE),
      dimensions: dims,
      measures: meas
    }];
  }

  export function parseFacet(model: FacetModel): SummaryComponent[] {
    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source but have a summary data source, then merge
    if (!childDataComponent.source && childDataComponent.summary) {
      let summaryComponents = childDataComponent.summary.map(function(summaryComponent) {
        // FIXME: the name and source aren't always correct yet when faceting layer/concat
        summaryComponent.name = model.dataName(SUMMARY);
        summaryComponent.source = model.dataName(SOURCE);

        // add facet fields as dimensions
        summaryComponent.dimensions = model.reduce(addDimension, summaryComponent.dimensions);
        return summaryComponent;
      });

      // FIXME revise if this line is correct
      model.child().renameData(model.child().dataName(SUMMARY), model.dataName(SUMMARY));
      delete childDataComponent.summary;
      return summaryComponents;
    }
    return [];
  }

  export function assemble(component: DataComponent): VgData[] {
    if (!component.summary) {
      return [];
    }
    return component.summary.reduce(function(summaryData, summaryComponent) {
      const dims = summaryComponent.dimensions;
      const meas = summaryComponent.measures;

      const groupby = keys(dims);

      // short-format summarize object for Vega's aggregate transform
      // https://github.com/vega/vega/wiki/Data-Transforms#-aggregate
      const summarize = reduce(meas, function(aggregator, fnDictSet, field) {
        aggregator[field] = keys(fnDictSet);
        return aggregator;
      }, {});

      if (keys(meas).length > 0) { // has aggregate
        summaryData.push({
          name: summaryComponent.name,
          source: summaryComponent.source,
          transform: [{
            type: 'aggregate',
            groupby: groupby,
            summarize: summarize
          }]
        });
      }
      return summaryData;
    }, []);
  }
}

/**
 * Stacked scale data source, for feeding the shared scale.
 */
export namespace stackScale {
  export function parseUnit(model: UnitModel):VgData {
    const stackProps = model.stack();

    if (stackProps) {
      // produce stacked scale
      const groupbyChannel = stackProps.groupbyChannel;
      const fieldChannel = stackProps.fieldChannel;
      return {
        name: model.dataName(STACKED_SCALE),
        source: model.dataName(SUMMARY), // always summary because stacked only works with aggregation
        transform: [{
          type: 'aggregate',
          // group by channel and other facets
          groupby: [model.field(groupbyChannel)],
          // produce sum of the field's value e.g., sum of sum, sum of distinct
          summarize: [{ops: ['sum'], field: model.field(fieldChannel)}]
        }]
      };
    }
    return null;
  };

  export function parseFacet(model: FacetModel) {
    const child = model.child();
    const childDataComponent = child.component.data;

    // If child doesn't have its own data source, but have stack scale source, then merge
    if (!childDataComponent.source && childDataComponent.stackScale) {
      let stackComponent = childDataComponent.stackScale;

      const newName = model.dataName(STACKED_SCALE);
      child.renameData(stackComponent.name, newName);
      stackComponent.name = newName;

      // Refer to facet's summary instead (always summary because stacked only works with aggregation)
      stackComponent.source = model.dataName(SUMMARY);

      // Add more dimensions for row/column
      stackComponent.transform[0].groupby = model.reduce(function(groupby, fieldDef) {
        groupby.push(field(fieldDef));
        return groupby;
      }, stackComponent.transform[0].groupby);

      delete childDataComponent.stackScale;
      return stackComponent;
    }
    return null;
  }

  export function assemble(component: DataComponent) {
    return component.stackScale;
  }
}


export namespace timeUnitDomain {
  function parse(model: Model) {
    return model.reduce(function(timeUnitDomainMap, fieldDef: FieldDef, channel: Channel) {
      if (fieldDef.timeUnit) {
        const domain = rawDomain(fieldDef.timeUnit, channel);
        if (domain) {
          timeUnitDomainMap[fieldDef.timeUnit] = true;
        }
      }
      return timeUnitDomainMap;
    }, {});
  }

  export const parseUnit = parse;

  export function parseFacet(model: FacetModel) {
    // always merge with child
    return extend(parse(model), model.child().component.data.timeUnitDomain);
  }

  export function assemble(component: DataComponent): VgData[] {
    return keys(component.timeUnitDomain).reduce(function(timeUnitData, tu: any) {
      const timeUnit: TimeUnit = tu; // cast string back to enum
      const domain = rawDomain(timeUnit, null); // FIXME fix rawDomain signature
      if (domain) {
        timeUnitData.push({
          name: timeUnit,
          values: domain,
          transform: [{
            type: 'formula',
            field: 'date',
            expr: parseExpression(timeUnit, 'datum.data', true)
          }]
        });
      }
      return timeUnitData;
    }, []);
  }
}

/**
 * We need to add a rank transform so that we can use the rank value as
 * input for color ramp's linear scale.
 */
export namespace colorRank {
  /**
   * Return hash dict from a color field's name to the sort and rank transforms
   */
  export function parseUnit(model: Model) {
    let colorRankComponent: Dict<VgTransform[]> = {};
    if (model.has(COLOR) && model.fieldDef(COLOR).type === ORDINAL) {
      colorRankComponent[model.field(COLOR)] = [{
        type: 'sort',
        by: model.field(COLOR)
      }, {
        type: 'rank',
        field: model.field(COLOR),
        output: {
          rank: model.field(COLOR, { prefn: 'rank_' })
        }
      }];
    }
    return colorRankComponent;
  }

  export function parseFacet(model: FacetModel) {
    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then consider merging
    if (!childDataComponent.source) {
      // TODO: we have to see if color has union scale here

      // For now, let's assume it always has union scale
      const colorRankComponent = childDataComponent.colorRank;
      delete childDataComponent.colorRank;
      return colorRankComponent;
    }
    return {} as Dict<VgTransform[]>;
  }

  export function assemble(component: DataComponent) {
    return flatten(vals(component.colorRank));
  }
}


/**
 * Filter non-positive value for log scale
 */
export namespace nonPositiveFilter {
  export function parseUnit(model: Model) {
    return model.channels().reduce(function(nonPositiveComponent, channel) {
      const scale = model.scale(channel);
      if (scale && scale.type === ScaleType.LOG) {
        nonPositiveComponent[model.field(channel)] = true;
      }
      return nonPositiveComponent;
    }, {} as StringSet);
  }

  export function parseFacet(model: FacetModel) {
    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then consider merging
    if (!childDataComponent.source) {
      // For now, let's assume it always has union scale
      const nonPositiveFilterComponent = childDataComponent.nonPositiveFilter;
      delete childDataComponent.nonPositiveFilter;
      return nonPositiveFilterComponent;
    }
    return {} as StringSet;
  }

  export function assemble(component: DataComponent) {
    return keys(component.nonPositiveFilter).map(function(field) {
      return {
        type: 'filter',
        test: 'datum.' + field + ' > 0'
      };
    });
  }
}
