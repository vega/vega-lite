import {Formula} from '../../transform';
import {keys, Dict, StringSet, unique, hash, allSame, differ, any, all, map, extend, forEach, empty, duplicate} from '../../util';
import {VgData, VgTransform} from '../../vega.schema';
import {SOURCE, RAW, RANK, SCALE, STACKED_SCALE} from '../../data';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';
import {UnitModel} from './../unit';

import {source} from './source';
import {formatParse} from './formatparse';
import {nullFilter} from './nullfilter';
import {filter} from './filter';
import {bin} from './bin';
import {calculate} from './calculate';
import {nonPositiveFilter} from './nonpositivenullfilter';
import {aggregate} from './aggregate';
import {stackScale} from './stackscale';
import {timeUnit} from './timeunit';
import {timeUnitDomain} from './timeunitdomain';
import {colorRank} from './colorrank';


/**
 * Composable component instance of a model's data.
 */
export interface DataComponent {
  // data source or reference to data source
  source: VgData;

  /** Mapping from field name to primitive data type.  */
  formatParse: Dict<string>;

  /** String set of fields for null filtering */
  nullFilter: Dict<boolean>;

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

  /** Data source for feeding stacked scale. */
  stackScale: VgData;

  /** Dictionary mapping an output field name (hash) to the sort and rank transforms  */
  colorRank: Dict<VgTransform[]>;

  /** String set of time units that need their own data sources for scale domain */
  timeUnitDomain: StringSet;

  /** Array of summary component object for producing aggregates */
  aggregate: AggregateComponent;

  /**
   * Whether we need the unaggrgeated data source or not.
   * Should be set when we parse the scales.
   */
  includeRawDomain?: boolean;
}

/**
 * Component for aggregations.
 */
export interface AggregateComponent {
  /** String set for all dimension fields  */
  dimensions: StringSet;

  /** dictionary mapping field name to string set of aggregate ops */
  measures: Dict<StringSet>;
}

// TODO: split this file into multiple files and remove this linter flag
/* tslint:disable:no-use-before-declare */

/**
 * Parses a model with data.
 */
function parseData(model: Model): DataComponent {
  return {
    source: source.parseUnit(model),
    formatParse: formatParse.parseUnit(model),
    calculate: calculate.parseUnit(model),
    filter: filter.parseUnit(model),
    bin: bin.parseUnit(model),
    timeUnit: timeUnit.parseUnit(model),
    aggregate: aggregate.parseUnit(model),
    colorRank: colorRank.parseUnit(model),
    stackScale: stackScale.parseUnit(model),
    nonPositiveFilter: nonPositiveFilter.parseUnit(model),
    nullFilter: nullFilter.parseUnit(model),
    timeUnitDomain: timeUnitDomain.parseUnit(model)
  };
}

/**
 * Create components for data source and transforms/ aggregates.
 */
export function parseUnitData(model: UnitModel): DataComponent {
  return parseData(model);
}

/**
 * The data component for a facet is the data component of its child.
 * We only need to add the facet fields as dimensions to the summary component.
 */
export function parseFacetData(model: FacetModel): DataComponent {
  // TODO: treat data in the facet and in the child differently

  const child = model.child();
  const dataComponent = child.component.data;
  delete child.component.data;

  [SOURCE, RAW, RANK, SCALE, STACKED_SCALE].forEach((data) => {
    model.renameData(child.dataName(data), model.dataName(data));
  });

  if (dataComponent.aggregate) {
    aggregate.parseFacet(model, dataComponent.aggregate);
  }
  if (dataComponent.stackScale) {
    stackScale.parseFacet(model, dataComponent.stackScale);
  }

  return dataComponent;
}

function mergeChildren(model: Model, dataComponent: DataComponent, children: UnitModel[]): DataComponent {
  if (children.length === 0) {
    return dataComponent;
  }

  const childDataComponents = children.map((child: UnitModel) => child.component.data);

  // set the parent source as child source
  childDataComponents.forEach((data) => {
    if (data.source === undefined) {
      // child does not define its own source
      data.source = {
        source: model.dataName(SOURCE)
      };
    } else {
      data.source.source = model.dataName(SOURCE);
    }
    delete data.source.format;
    delete data.source.url;
  });

  formatParse.merge(dataComponent, childDataComponents);

  const mergedAllFormulas = calculate.merge(dataComponent, childDataComponents);

  if (!mergedAllFormulas) {
    // we could not merge all formula up so we have to stop merging because other
    // transforms depend on this
    return dataComponent;
  }

  timeUnit.merge(dataComponent, childDataComponents);

  const sameFilter = filter.mergeIfEqual(dataComponent, childDataComponents);
  const compatibleNullFilter = nullFilter.mergeIfCompatible(dataComponent, childDataComponents);

  if (!sameFilter || !compatibleNullFilter) {
    return dataComponent;
  }

  // merge up bin if the children have no nullfilter or filter defined
  // and the binning is the same
  bin.merge(dataComponent, childDataComponents);

  // TODO: selectionfilter

  aggregate.merge(dataComponent, childDataComponents);
  colorRank.merge(dataComponent, childDataComponents);

  nonPositiveFilter.mergeIfCompatible(dataComponent, childDataComponents);

  return dataComponent;
}

/**
 * Merges data from children up if possible.
 */
export function parseLayerData(model: LayerModel): DataComponent {
  const dataComponent = parseData(model);

  // function to compare the data sources
  function dataHash(component: DataComponent) {
    const source = component.source;
    if (source.values) {
      return hash(source.values);
    }
    return hash(source.url + source.format);
  }

  // move time unit domain by moving it up
  model.children().forEach((child) => {
    extend(dataComponent.timeUnitDomain, child.component.data.timeUnitDomain);
    delete child.component.data.timeUnitDomain;
  });

  if (dataComponent.source) {
    // merge up what we can from the children that have the same source as the layer data
    const parentHash = dataHash(dataComponent);
    return mergeChildren(model, dataComponent, model.children().filter((child) => {
      return child.component.data.source === undefined || parentHash === dataHash(child.component.data);
    }));
  } else {
    const sameSources = allSame(model.children().map((child: UnitModel) => {
      return dataHash(child.component.data);
    }));
    if (sameSources) {
      dataComponent.source = duplicate(model.children()[0].component.data.source);

      return mergeChildren(model, dataComponent, model.children());
    }
    // the children have different sources so let's give up
    return dataComponent;
  }
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

  if (!component) {
    return data;
  }

  let dataSource = source.assemble(model, component);
  dataSource.name = model.dataName(SOURCE);
  data.push(dataSource);

  dataSource.transform = [].concat(
    calculate.assemble(component),
    filter.assemble(component),
    nullFilter.assemble(component),
    bin.assemble(component),
    timeUnit.assemble(component)
  );

  if (component.includeRawDomain) {
    // create an intermediate data source for raw data
    const sourceName = dataSource.name;
    const rawName = model.dataName(RAW);
    dataSource.name = rawName;
    dataSource = {
      source: rawName,
      name: sourceName
    };
    data.push(dataSource);
  }

  const aggregates = aggregate.assemble(component, model);
  if (aggregates.length > 0) {
    dataSource.transform = (dataSource.transform || []).concat(aggregates);
  }

  // add rank transform
  const rank = colorRank.assemble(component);
  if (rank.length > 0) {
    dataSource.transform = (dataSource.transform || []).concat(rank);
  }

  if (empty(dataSource.transform)) {
    delete dataSource.transform;
  }

  // stack
  const stackData = stackScale.assemble(component);
  if (stackData) {
    stackData.name = model.dataName(STACKED_SCALE);
    stackData.source = dataSource.name;
    data.push(stackData);
  }

  // scale
  const scaleSource = component.includeRawDomain ? model.dataName(RAW) : dataSource.name;
  const posFilter = nonPositiveFilter.assemble(component);
  if (posFilter.length > 0) {
    data.push({
      source: scaleSource,
      name: model.dataName(SCALE),
      transform: posFilter
    });
  } else {
    data.push({
      source: scaleSource,
      name: model.dataName(SCALE),
    });
  }

  // time unit domain
  const tuDomain = timeUnitDomain.assemble(component);
  if (tuDomain) {
    data.push.apply(data, tuDomain);
  }

  return data;
}
