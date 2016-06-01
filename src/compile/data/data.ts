import {Formula} from '../../transform';
import {keys, Dict, StringSet, unique, hash, allSame, differ, any, all, map, extend, forEach, empty, duplicate} from '../../util';
import {VgData, VgTransform} from '../../vega.schema';
import {SOURCE, RAW, STACKED_SCALE} from '../../data';

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

  /** Data transform for stacked scale. */
  stackScale: {type: string, groupby: string[], summarize: any[]};

  /** Dictionary mapping an output field name (hash) to the sort and rank transforms  */
  colorRank: Dict<VgTransform[]>;

  /** String set of time units that need their own data sources for scale domain */
  timeUnitDomain: StringSet;

  /** Array of summary component object for producing aggregates */
  aggregate: AggregateComponent;
}

/**
 * Component for aggregations.
 */
export interface AggregateComponent {
  /** String set for all dimension fields  */
  dimensions: StringSet;

  /** dictionary mapping field name to string set of aggregate ops */
  measures: Dict<StringSet>;

  /**
   * Whether we need the unaggrgeated data source.
   * Should be set when we parse the scales.
   */
  assembleRaw?: boolean;
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
  const child = model.child();

  // TODO: enforce this in the schema
  if (child.data() || !empty(child.transform())) {
    model.addWarning('Facet child should not define data source or transform.');
  }

  // rename all references to child data, everything should have been merged up
  [RAW, SOURCE, STACKED_SCALE].forEach((data) => {
    model.renameData(child.dataName(data), model.dataName(data));
  });

  // we should completely move the data component to the facet because
  // the child does not need its own data

  return {
    source: source.parseFacet(model),
    formatParse: formatParse.parseFacet(model),
    calculate: calculate.parseFacet(model),
    filter: filter.parseFacet(model),
    bin: bin.parseFacet(model),
    timeUnit: timeUnit.parseFacet(model),
    aggregate: aggregate.parseFacet(model),
    colorRank: colorRank.parseFacet(model),
    stackScale: stackScale.parseFacet(model),
    nonPositiveFilter: nonPositiveFilter.parseFacet(model),
    nullFilter: nullFilter.parseFacet(model),
    timeUnitDomain: timeUnitDomain.parseFacet(model)
  };
}

/**
 * Merge data components from children into data component.
 * Expects that a single source is either defined in the parent or in all
 * sources (has to be the same source).
 */
function mergeChildren(model: Model, dataComponent: DataComponent, children: UnitModel[]): DataComponent {
  if (children.length === 0) {
    return dataComponent;
  }

  const childDataComponents = children.map((child: UnitModel) => child.component.data);

  // set the parent source as child source
  childDataComponents.forEach((childData) => {
    if (childData.source === undefined) {
      // child does not define its own source
      childData.source = {
        source: model.dataName(SOURCE)
      };
    } else {
      childData.source.source = model.dataName(SOURCE);
    }
    delete childData.source.format;
    delete childData.source.url;
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
  function dataHash(component: DataComponent): string {
    const source = component.source;
    if (!source) {
      return null;
    }
    if (source.values) {
      return hash(source.values);
    }
    return hash(source.url + source.format);
  }

  // merge time unit domains by moving them up
  timeUnitDomain.merge(dataComponent, model.children());

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
      const source = model.children()[0].component.data.source;
      dataComponent.source = source ? duplicate(source) : source;

      return mergeChildren(model, dataComponent, model.children());
    }

    // Children have different sources but they could be undefined and thus need to be linked up.
    // The specific case is a layer inside a facet where one layer has a data source.
    // debugger;

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

  if (!component || !component.source) {
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

  let rawSource;
  const assembleRaw = component.aggregate && component.aggregate.assembleRaw;
  if (assembleRaw) {
    // create an intermediate data source for raw data
    const sourceName = dataSource.name;
    const rawName = model.dataName(RAW);
    rawSource = dataSource;
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
  const stackTransform = stackScale.assemble(component);
  if (stackTransform) {
    data.push({
      name: model.dataName(STACKED_SCALE),
      source: dataSource.name,
      transform: [stackTransform]
    });
  }

  // scale
  const posFilter = nonPositiveFilter.assemble(component);
  if (posFilter) {
    if (assembleRaw) {
      rawSource.transform = (rawSource.transform || []).concat(posFilter);
    } else {
      dataSource.transform = (dataSource.transform || []).concat(posFilter);
    }
  }

  // time unit domain
  const tuDomain = timeUnitDomain.assemble(component);
  if (tuDomain) {
    data.push.apply(data, tuDomain);
  }

  // remove data sources that are not needed
  let index = data.length - 1;
  while (index >= 0) {
    const ds = data[index];

    // delete empty transforms
    if (empty(ds.transform)) {
      delete ds.transform;
    }

    // rename sources to close gaps
    if (ds.source) {
      ds.source = model.renamedDataName(ds.source);
    }

    // delete data sources that are empty
    if (!ds.transform && ds.source) {
      model.renameData(ds.name, ds.source);
      data.splice(index, 1);
    }
    index -= 1;
  }

  return data;
}
