import {SOURCE} from '../../data';
import {FieldDef} from '../../fielddef';
import {Formula} from '../../transform';
import {Dict, StringSet} from '../../util';
import {VgData, VgSort, VgTransform} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';
import {UnitModel} from './../unit';

import {source} from './source';
import {formatParse} from './formatparse';
import {nullFilter} from './nullfilter';
import {filter} from './filter';
import {bin} from './bin';
import {formula} from './formula';
import {pathOrder} from './pathorder';
import {nonPositiveFilter} from './nonpositivefilter';
import {summary} from './summary';
import {stack, StackComponent} from './stack';
import {timeUnit} from './timeunit';

/**
 * Composable component instance of a model's data.
 */
export interface DataComponent {
  source: VgData;

  /** Mapping from field name to primitive data type.  */
  formatParse: Dict<string>;

  /** String set of fields for null filtering */
  nullFilter: Dict<FieldDef>;

  /** Hashset of a formula object */
  calculate: Dict<Formula>;

  /** Filter test expression */
  filter: string;

  /** Dictionary mapping a bin parameter hash to transforms of the binned field */
  bin: Dict<VgTransform[]>;

  /** Dictionary mapping an output field name (hash) to the time unit transform  */
  timeUnit: Dict<VgTransform>;

  /** String set of fields to be filtered */
  nonPositiveFilter: Dict<boolean>;

  /** Sort order to apply at the end */
  pathOrder: VgSort;

  /**
   * Stack transforms to be applied.
   */
  stack: StackComponent;

  /** Array of summary component object for producing summary (aggregate) data source */
  summary: SummaryComponent[];
}

/**
 * Composable component for a model's summary data
 */
export interface SummaryComponent {
  /** Name of the summary data source */
  name: string;

  /** String set for all dimension fields  */
  dimensions: StringSet;

  /** dictionary mapping field name to string set of aggregate ops */
  measures: Dict<StringSet>;
}

// TODO: split this file into multiple files and remove this linter flag
/* tslint:disable:no-use-before-declare */

export function parseUnitData(model: UnitModel): DataComponent {
  return {
    formatParse: formatParse.parseUnit(model),
    nullFilter: nullFilter.parseUnit(model),
    filter: filter.parseUnit(model),
    nonPositiveFilter: nonPositiveFilter.parseUnit(model),
    pathOrder: pathOrder.parseUnit(model),

    source: source.parseUnit(model),
    bin: bin.parseUnit(model),
    calculate: formula.parseUnit(model),
    timeUnit: timeUnit.parseUnit(model),
    summary: summary.parseUnit(model),
    stack: stack.parseUnit(model)
  };
}

export function parseFacetData(model: FacetModel): DataComponent {
  return {
    formatParse: formatParse.parseFacet(model),
    nullFilter: nullFilter.parseFacet(model),
    filter: filter.parseFacet(model),
    nonPositiveFilter: nonPositiveFilter.parseFacet(model),
    pathOrder: pathOrder.parseFacet(model),

    source: source.parseFacet(model),
    bin: bin.parseFacet(model),
    calculate: formula.parseFacet(model),
    timeUnit: timeUnit.parseFacet(model),
    summary: summary.parseFacet(model),
    stack: stack.parseFacet(model)
  };
}

export function parseLayerData(model: LayerModel): DataComponent {
  return {
    // filter and formatParse could cause us to not be able to merge into parent
    // so let's parse them first
    filter: filter.parseLayer(model),
    formatParse: formatParse.parseLayer(model),
    nullFilter: nullFilter.parseLayer(model),
    nonPositiveFilter: nonPositiveFilter.parseLayer(model),
    pathOrder: pathOrder.parseLayer(model),

    // everything after here does not affect whether we can merge child data into parent or not
    source: source.parseLayer(model),
    bin: bin.parseLayer(model),
    calculate: formula.parseLayer(model),
    timeUnit: timeUnit.parseLayer(model),
    summary: summary.parseLayer(model),
    stack: stack.parseLayer(model)
  };
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
  const dataComponent = model.component.data;

  const sourceData = source.assemble(dataComponent);
  if (sourceData) {
    data.push(sourceData);
  }

  summary.assemble(dataComponent.summary || [], model.dataName(SOURCE)).forEach(function(summaryData) {
    data.push(summaryData);
  });

  // nonPositiveFilter
  const nonPositiveFilterTransform = nonPositiveFilter.assemble(dataComponent.nonPositiveFilter);
  if (nonPositiveFilterTransform.length > 0) {
    if (data.length > 0) {
      const dataTable = data[data.length - 1];
      dataTable.transform = (dataTable.transform || []).concat(nonPositiveFilterTransform);
    } else { /* istanbul ignore else: should never reach here */
      throw new Error('Invalid nonPositiveFilter not merged');
    }
  }

  // stack
  const stackData = stack.assemble(dataComponent.stack);
  if (stackData) {
    data.push(stackData);
  }

  // Path Order
  const pathOrderCollectTransform = pathOrder.assemble(dataComponent.pathOrder);
  if (pathOrderCollectTransform) {
    const dataTable = data[data.length - 1];
    if (data.length > 0) {
      dataTable.transform = (dataTable.transform || []).concat([pathOrderCollectTransform]);
    } else { /* istanbul ignore else: should never reach here */
      throw new Error('Invalid path order collect transform not added');
    }
  }

  return data;
}
