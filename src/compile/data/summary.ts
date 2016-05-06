import {AggregateOp} from '../../aggregate';
import {Channel} from '../../channel';
import {SOURCE} from '../../data';
import {field, FieldDef} from '../../fielddef';
import {keys, vals, reduce, hash, Dict, StringSet} from '../../util';
import {VgData} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent, SummaryComponent} from './data';


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

  export function parseUnit(model: Model): SummaryComponent {
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

    return {
      dimensions: dims,
      measures: meas
    };
  }

  function mergeMeasures(parentMeasures: Dict<Dict<boolean>>, childMeasures: Dict<Dict<boolean>>) {
    for (const field in childMeasures) {
      if (childMeasures.hasOwnProperty(field)) {
        // when we merge a measure, we either have to add an aggregation operator or even a new field
        const ops = childMeasures[field];
        for (const op in ops) {
          if (ops.hasOwnProperty(op)) {
            if (field in parentMeasures) {
              // add operator to existing measure field
              parentMeasures[field][op] = true;
            } else {
              parentMeasures[field] = { op: true };
            }
          }
        }
      }
    }
  }

  /**
   * Add facet fields as dimensions.
   */
  export function parseFacet(model: FacetModel, summaryComponent: SummaryComponent) {
    summaryComponent.dimensions = model.reduce(addDimension, summaryComponent.dimensions);
  }

  /**
   * Assemble the summary. Needs a rename function because we cannot guarantee that the
   * parent data before the children data.
   */
  export function assemble(component: DataComponent, model: Model) {
    const summaryComponent = component.summary;
    const dims = summaryComponent.dimensions;
    const meas = summaryComponent.measures;

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
