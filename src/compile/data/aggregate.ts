import {AggregateOp} from '../../aggregate';
import {Channel} from '../../channel';
import {SOURCE} from '../../data';
import {field, FieldDef} from '../../fielddef';
import {keys, vals, reduce, stableStringify, Dict, StringSet, allSame, empty} from '../../util';
import {VgData} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent, AggregateComponent} from './data';


export namespace aggregate {
  function addDimension(dims: { [field: string]: boolean }, fieldDef: FieldDef) {
    if (fieldDef.bin) {
      // To avoid confusion, group by all types of bin values, so we always have them to use.
      // TODO: handle if bin parameters are different
      dims[field(fieldDef, { binSuffix: '_start' })] = true;
      dims[field(fieldDef, { binSuffix: '_mid' })] = true;
      dims[field(fieldDef, { binSuffix: '_end' })] = true;
      dims[field(fieldDef, { binSuffix: '_range' })] = true;
    } else {
      dims[field(fieldDef)] = true;
    }
    return dims;
  }

  export function parse(model: Model): AggregateComponent {
    /* string set for dimensions */
    let dims: StringSet = {};

    /* dictionary mapping field name => dict set of aggregation functions */
    let meas: Dict<StringSet> = {};

    model.forEach(function (fieldDef: FieldDef, channel: Channel) {
      if (fieldDef.aggregate) {
        if (fieldDef.aggregate === AggregateOp.COUNT) {
          meas['*'] = meas['*'] || {};
          meas['*']['count'] = true; // tslint:disable-line:no-string-literal
        } else {
          meas[fieldDef.field] = meas[fieldDef.field] || {};
          meas[fieldDef.field][fieldDef.aggregate] = true;
        }
      } else {
        addDimension(dims, fieldDef);
      }
    });

    return {
      dimensions: dims,
      measures: meas
    };
  }

  export const parseUnit = parse;

  export function mergeMeasures(parentMeasures: Dict<Dict<boolean>>, childMeasures: Dict<Dict<boolean>>) {
    for (const field in childMeasures) {
      if (childMeasures.hasOwnProperty(field)) {
        // when we merge a measure, we either have to add an aggregation operator or even a new field
        const ops = childMeasures[field];
        for (const op in ops) {
          if (ops.hasOwnProperty(op)) {
            if (!(field in parentMeasures)) {
              parentMeasures[field] = {};
            }
            parentMeasures[field][op] = true;
          }
        }
      }
    }
  }

  /**
   * Add facet fields as dimensions.
   */
  export function parseFacet(model: FacetModel): AggregateComponent {
    const childComponent = model.child().component;
    const aggregateComponent = childComponent.data.aggregate;

    if (aggregateComponent) {
      // add facet fields as dimensions
      aggregateComponent.dimensions = model.reduce(addDimension, aggregateComponent.dimensions);
      delete childComponent.data.aggregate;
    }

    return aggregateComponent;
  }

  /**
   * Merges the aggregates from the children into the data component.
   */
  export function merge(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    const dimensions = childDataComponents.reduce((collector, data) => {
      return collector.concat(stableStringify(keys(data.aggregate.dimensions)));
    }, keys(dataComponent.aggregate.dimensions).length ? [stableStringify(keys(dataComponent.aggregate.dimensions))] : []);

    if (allSame(dimensions)) {
      dataComponent.aggregate.measures = childDataComponents.reduce((collector, data) => {
        mergeMeasures(collector, data.aggregate.measures);
        return collector;
      }, dataComponent.aggregate.measures);

      if (empty(dataComponent.aggregate.dimensions)) {
        dataComponent.aggregate.dimensions = childDataComponents[0].aggregate.dimensions;
      }
      childDataComponents.forEach((childData) => {
        delete childData.aggregate;
      });
    }
  }

  /**
   * Assemble the aggregate. Needs a rename function because we cannot guarantee that the
   * parent data before the children data.
   */
  export function assemble(component: DataComponent, model: Model) {
    const aggregateComponent = component.aggregate;

    if (!aggregateComponent) {
      return [];
    }

    const dims = aggregateComponent.dimensions;
    const meas = aggregateComponent.measures;

    // short-format summarize object for Vega's aggregate transform
    // https://github.com/vega/vega/wiki/Data-Transforms#-aggregate
    const summarize = reduce(meas, function (aggregator, fnDictSet, field) {
      aggregator[field] = keys(fnDictSet);
      return aggregator;
    }, {});

    if (keys(meas).length > 0) { // has aggregate
      return [{
        type: 'aggregate',
        groupby: keys(dims),
        summarize: summarize
      }];
    }
    return [];
  }
}
