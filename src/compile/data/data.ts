import {Formula, Lookup} from '../../transform';
import {keys, Dict, StringSet, extend, isArray, isObject} from '../../util';
import {VgData, VgTransform} from '../../vega.schema';

import {FacetModel} from '../facet';
import {RepeatModel} from '../repeat';
import {LayerModel} from '../layer';
import {ConcatModel} from './../concat';
import {Model} from '../model';
import {UnitModel} from '../unit';

import {source} from './source';
import {formatParse} from './formatparse';
import {nullFilter} from './nullfilter';
import {filter} from './filter';
import {filterWith} from './filterwith';
import {bin} from './bin';
import {formula} from './formula';
import {nonPositiveFilter} from './nonpositivenullfilter';
import {summary} from './summary';
import {stackScale} from './stackscale';
import {timeUnit} from './timeunit';
import {timeUnitDomain} from './timeunitdomain';
import {colorRank} from './colorrank';
import {lookup} from './lookup';


/**
 * Composable component instance of a model's data.
 */
export interface DataComponent {
  source: VgData;

  /** Mapping from field name to primitive data type.  */
  formatParse: Dict<string>;

  /** String set of fields for null filtering */
  nullFilter: Dict<boolean>;

  /** Hashset of a formula object */
  calculate: Dict<Formula>;

  /** Filter test expression */
  filter: string;

  /** Filter test expression against selections */
  filterWith: string;

  /** Dictionary mapping a bin parameter hash to transforms of the binned field */
  bin: Dict<VgTransform[]>;

  /** Dictionary mapping an output field name (hash) to the time unit transform  */
  timeUnit: Dict<VgTransform>;

  /** String set of fields to be filtered */
  nonPositiveFilter: Dict<boolean>;

  /** Data source for feeding stacked scale. */
  // TODO: need to revise if single VgData is sufficient with layer / concat
  stackScale: VgData;

  /** Dictionary mapping an output field name (hash) to the sort and rank transforms  */
  colorRank: Dict<VgTransform[]>;

  /** String set of time units that need their own data sources for scale domain */
  timeUnitDomain: StringSet;

  /** Array of summary component object for producing summary (aggregate) data source */
  summary: SummaryComponent[];

  /** Hashset of looup objects */
  lookup?: Dict<Lookup>;
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
    filterWith: filterWith.parseUnit(model),

    source: source.parseUnit(model),
    lookup: lookup.parseUnit(model),
    bin: bin.parseUnit(model),
    calculate: formula.parseUnit(model),
    timeUnit: timeUnit.parseUnit(model),
    timeUnitDomain: timeUnitDomain.parseUnit(model),
    summary: summary.parseUnit(model),
    stackScale: stackScale.parseUnit(model),
    colorRank: colorRank.parseUnit(model)
  };
}

export function parseFacetData(model: FacetModel): DataComponent {
  return {
    formatParse: formatParse.parseFacet(model),
    nullFilter: nullFilter.parseFacet(model),
    filter: filter.parseFacet(model),
    nonPositiveFilter: nonPositiveFilter.parseFacet(model),
    filterWith: filterWith.parseFacet(model),

    source: source.parseFacet(model),
    lookup: lookup.parseFacet(model),
    bin: bin.parseFacet(model),
    calculate: formula.parseFacet(model),
    timeUnit: timeUnit.parseFacet(model),
    timeUnitDomain: timeUnitDomain.parseFacet(model),
    summary: summary.parseFacet(model),
    stackScale: stackScale.parseFacet(model),
    colorRank: colorRank.parseFacet(model)
  };
}

export function parseLayerData(model: LayerModel): DataComponent {
  return {
    // filter and formatParse could cause us to not be able to merge into parent
    // so let's parse them first
    formatParse: formatParse.parseLayer(model),
    nullFilter: nullFilter.parseLayer(model),
    filter: filter.parseLayer(model),
    nonPositiveFilter: nonPositiveFilter.parseLayer(model),
    filterWith: filterWith.parseLayer(model),

    // everything after here does not affect whether we can merge child data into parent or not
    source: source.parseLayer(model),
    lookup: lookup.parseLayer(model),
    bin: bin.parseLayer(model),
    calculate: formula.parseLayer(model),
    timeUnit: timeUnit.parseLayer(model),
    timeUnitDomain: timeUnitDomain.parseLayer(model),
    summary: summary.parseLayer(model),
    stackScale: stackScale.parseLayer(model),
    colorRank: colorRank.parseLayer(model)
  };
}

export function parseRepeatData(model: RepeatModel): DataComponent {
  const repeatData = {
    formatParse: formatParse.parseRepeat(model),
    nullFilter: nullFilter.parseRepeat(model),
    filter: filter.parseRepeat(model),
    nonPositiveFilter: nonPositiveFilter.parseRepeat(model),
    filterWith: filterWith.parseRepeat(model),

    source: source.parseRepeat(model),
    bin: bin.parseRepeat(model),
    calculate: formula.parseRepeat(model),
    timeUnit: timeUnit.parseRepeat(model),
    timeUnitDomain: timeUnitDomain.parseRepeat(model),
    summary: summary.parseRepeat(model),
    stackScale: stackScale.parseRepeat(model),
    colorRank: colorRank.parseRepeat(model)
  };

  // remove as soon as you can: überhack: add same binning to all source two children deep
  let binComponent = {} as Dict<VgTransform[]>;

  function iterate(f) {
    model.children().forEach((child: Model) => {
      f(child);
      child.children().forEach((child2) => {
        f(child2);
      });
    });
  }

  iterate((child) => {
    extend(binComponent, child.component.data.bin);
  });
  iterate((child) => {
    child.component.data.bin = binComponent;
  });

  return repeatData;
}

export function parseConcatData(model: ConcatModel): DataComponent {
  return {
    formatParse: formatParse.parseConcat(model),
    nullFilter: nullFilter.parseConcat(model),
    filter: filter.parseConcat(model),
    nonPositiveFilter: nonPositiveFilter.parseConcat(model),
    filterWith: filterWith.parseConcat(model),

    source: source.parseConcat(model),
    lookup: lookup.parseConcat(model),
    bin: bin.parseConcat(model),
    calculate: formula.parseConcat(model),
    timeUnit: timeUnit.parseConcat(model),
    timeUnitDomain: timeUnitDomain.parseConcat(model),
    summary: summary.parseConcat(model),
    stackScale: stackScale.parseConcat(model),
    colorRank: colorRank.parseConcat(model)
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
  const component = model.component.data;

  const sourceData = source.assemble(model, component);
  if (isArray(sourceData)) {
    data.push.apply(data, sourceData);
  } else if (isObject(sourceData)) {
    data.push(sourceData);
  }

  summary.assemble(component, model).forEach(function(summaryData) {
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
    if (nonPositiveFilterTransform.length > 0) {
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
