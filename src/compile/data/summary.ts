import {SUMMARY} from '../../data';
import {field, FieldDef} from '../../fielddef';
import {keys, vals, reduce, hash, Dict, StringSet} from '../../util';
import {VgData} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {SummaryComponent} from './data';


export namespace summary {
  function addDimension(dims: {[field: string]: boolean}, fieldDef: FieldDef) {
    if (fieldDef.bin) {
      dims[field(fieldDef, {binSuffix: 'start'})] = true;
      dims[field(fieldDef, {binSuffix: 'end'})] = true;

      // const scale = model.scale(channel);
      // if (scaleType(scale, fieldDef, channel, model.mark()) === ScaleType.ORDINAL) {
      // also produce bin_range if the binned field use ordinal scale
      dims[field(fieldDef, {binSuffix: 'range'})] = true;
      // }
    } else {
      dims[field(fieldDef)] = true;
    }
    return dims;
  }

  export function parseUnit(model: Model): SummaryComponent[] {
    /* string set for dimensions */
    const dims: StringSet = {};

    /* dictionary mapping field name => dict set of aggregation functions */
    const meas: Dict<StringSet> = {};

    model.forEachFieldDef(function(fieldDef, channel) {
      if (fieldDef.aggregate) {
        if (fieldDef.aggregate === 'count') {
          meas['*'] = meas['*'] || {};
          /* tslint:disable:no-string-literal */
          meas['*']['count'] = true;
          /* tslint:enable:no-string-literal */
        } else {
          meas[fieldDef.field] = meas[fieldDef.field] || {};
          meas[fieldDef.field][fieldDef.aggregate] = true;

          // add min/max so we can use their union as unaggregated domain
          const scale = model.scale(channel);
          if (scale && scale.domain === 'unaggregated') {
            meas[fieldDef.field]['min'] = true;
            meas[fieldDef.field]['max'] = true;
          }
        }
      } else {
        addDimension(dims, fieldDef);
      };
    });

    return [{
      name: model.dataName(SUMMARY),
      dimensions: dims,
      measures: meas
    }];
  }

  export function parseFacet(model: FacetModel): SummaryComponent[] {
    const childDataComponent = model.child.component.data;

    // FIXME: this could be incorrect for faceted layer charts.

    // If child doesn't have its own data source but has a summary data source, merge
    if (!childDataComponent.source && childDataComponent.summary) {
      let summaryComponents = childDataComponent.summary.map(function(summaryComponent) {
        // add facet fields as dimensions
        summaryComponent.dimensions = model.reduceFieldDef(addDimension, summaryComponent.dimensions);

        const summaryNameWithoutPrefix = summaryComponent.name.substr(model.child.getName('').length);
        model.child.renameData(summaryComponent.name, summaryNameWithoutPrefix);
        summaryComponent.name = summaryNameWithoutPrefix;
        return summaryComponent;
      });

      delete childDataComponent.summary;
      return summaryComponents;
    }
    return [];
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
              parentMeasures[field] = {op: true};
            }
          }
        }
      }
    }
  }

  export function parseLayer(model: LayerModel): SummaryComponent[] {
    // Index by the fields we are grouping by
    let summaries = {};

    // Combine summaries for children that don't have a distinct source
    // (either having its own data source, or its own tranformation of the same data source).
    model.children.forEach((child) => {
      const childDataComponent = child.component.data;
      if (!childDataComponent.source && childDataComponent.summary) {
        // Merge the summaries if we can
        childDataComponent.summary.forEach((childSummary) => {
          // The key is a hash based on the dimensions;
          // we use it to find out whether we have a summary that uses the same group by fields.
          const key = hash(childSummary.dimensions);
          if (key in summaries) {
            // yes, there is a summary hat we need to merge into
            // we know that the dimensions are the same so we only need to merge the measures
            mergeMeasures(summaries[key].measures, childSummary.measures);
          } else {
            // give the summary a new name
            childSummary.name = model.dataName(SUMMARY) + '_' + keys(summaries).length;
            summaries[key] = childSummary;
          }

          // remove summary from child
          child.renameData(child.dataName(SUMMARY), summaries[key].name);
          delete childDataComponent.summary;
        });
      }
    });

    return vals(summaries);
  }

  /**
   * Assemble the summary. Needs a rename function because we cannot guarantee that the
   * parent data before the children data.
   */
  export function assemble(component: SummaryComponent[], sourceName: string): VgData[] {
    return component.reduce(function(summaryData, summaryComponent) {
      const dims = summaryComponent.dimensions;
      const meas = summaryComponent.measures;

      if (keys(meas).length > 0) { // has aggregate
        const groupby = keys(dims);
        const transform = reduce(meas, function(t, fnDictSet, field) {
          const ops = keys(fnDictSet);
          for (const op of ops) {
            t.fields.push(field);
            t.ops.push(op);
          }
          return t;
        }, {
          type: 'aggregate',
          groupby: groupby,
          fields: [],
          ops: []
        });

        summaryData.push({
          name: summaryComponent.name,
          source: sourceName,
          transform: [transform]
        });
      }
      return summaryData;
    }, []);
  }
}
