import {Formula} from '../../transform';
import {keys, Dict, StringSet} from '../../util';
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
import {formula} from './formula';
import {nonPositiveFilter} from './nonpositivenullfilter';
import {summary} from './summary';
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
  // TODO: need to revise if single VgData is sufficient with layer / concat
  stackScale: VgData;

  /** Dictionary mapping an output field name (hash) to the sort and rank transforms  */
  colorRank: Dict<VgTransform[]>;

  /** String set of time units that need their own data sources for scale domain */
  timeUnitDomain: StringSet;

  /** Array of summary component object for producing aggregates */
  summary: SummaryComponent;

  /** Whether we need the unaggrgeated data source or not. */
  usesRaw: boolean;
}

/**
 * Composable component for a model's summary data
 */
export interface SummaryComponent {
  /** String set for all dimension fields  */
  dimensions: StringSet;

  /** dictionary mapping field name to string set of aggregate ops */
  measures: Dict<StringSet>;
}

// TODO: split this file into multiple files and remove this linter flag
/* tslint:disable:no-use-before-declare */

/**
 * Create components for data source and transforms/ aggregates.
 */
export function parseUnitData(model: UnitModel): DataComponent {
  return {
    source: source.parseUnit(model),
    formatParse: formatParse.parseUnit(model),
    calculate: formula.parseUnit(model),
    filter: filter.parseUnit(model),
    bin: bin.parseUnit(model),
    timeUnit: timeUnit.parseUnit(model),
    summary: summary.parseUnit(model),
    colorRank: colorRank.parseUnit(model),
    stackScale: stackScale.parseUnit(model),
    nonPositiveFilter: nonPositiveFilter.parseUnit(model),
    nullFilter: nullFilter.parseUnit(model),
    timeUnitDomain: timeUnitDomain.parseUnit(model),
    usesRaw: false,
  };
}

/**
 * The data component for a facet is the data component of its child.
 * We only need to add the facet fields as dimensions to the summary component.
 */
export function parseFacetData(model: FacetModel): DataComponent {
  const child = model.child();
  const dataComponent = child.component.data;
  delete child.component.data;

  [SOURCE, RAW, RANK, SCALE, STACKED_SCALE].forEach((data) => {
    model.renameData(child.dataName(data), model.dataName(data));
  });

  summary.parseFacet(model, dataComponent.summary);
  stackScale.parseFacet(model, dataComponent.stackScale);

  return dataComponent;
}

/**
 * Merges data from children up if possible.
 */
export function parseLayerData(model: LayerModel): DataComponent {
  return null;
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
    formula.assemble(component),
    filter.assemble(component),
    nullFilter.assemble(component),
    bin.assemble(component),
    timeUnit.assemble(component)
  );

  if (component.usesRaw) {
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

  const aggregate = summary.assemble(component, model);
  if (aggregate.length > 0) {
    dataSource.transform = (dataSource.transform || []).concat(aggregate);
  }

  // add rank data source if needed
  const rank = colorRank.assemble(component);
  if (rank.length > 0) {
    data.push({
      name: model.dataName(RANK),
      source: dataSource.name,
      transform: [rank]
    });
  }

  // stack
  const stackData = stackScale.assemble(component);
  if (stackData) {
    stackData.name = model.dataName(STACKED_SCALE);
    stackData.source = dataSource.name;
    data.push(stackData);
  }

  // scale
  const scaleSource = component.usesRaw ? model.dataName(RAW) : dataSource.name;
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
