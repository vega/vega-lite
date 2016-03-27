import {SOURCE} from '../../data';
import {contains, duplicate, keys, extend} from '../../util';
import {VgData} from '../../vega.schema';

import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {RepeatModel} from './../repeat';
import {Model, isUnitModel} from '../model';

import {DataComponent} from './data';
import {nullFilter} from './nullfilter';
import {filter} from './filter';
import {filterWith} from './filterwith';
import {bin} from './bin';
import {formula} from './formula';
import {timeUnit} from './timeunit';
import {compileSelectionPredicate} from '../common';

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

  export function parseLayer(model: LayerModel) {
    let sourceData = parse(model);
    model.children().forEach((child) => {
      const childData = child.component.data;

      if (model.compatibleSource(child)) {
        // we cannot merge if the child has filters defined even after we tried to move them up
        const canMerge = !childData.filter && !childData.formatParse && !childData.nullFilter && !childData.filterWith;
        if (canMerge) {
          // rename source because we can just remove it
          child.renameData(child.dataName(SOURCE), model.dataName(SOURCE));
          delete childData.source;
        } else {
          // child does not have data defined or the same source so just use the parents source
          childData.source = {
            name: child.dataName(SOURCE),
            source: model.dataName(SOURCE)
          };
        }
      }
    });
    return sourceData;
  }

  export function parseRepeat(model: RepeatModel) {
    let sourceData = parse(model.children()[0]);
    if (!sourceData) {
      // cannot merge from child because the direct child does not have any data
      // For example, when the child is a layer spec.
      return;
    }
    sourceData.name = model.dataName(SOURCE);

    model.children().forEach((child) => {
      const childData = child.component.data;

      // TODO: merge children into different groups that are mergable.  (Current we only merge into one.)

      const canMerge = !childData.filter && !childData.formatParse && !childData.nullFilter && !childData.filterWith;
      if (canMerge) {
        // rename source because we can just remove it
        child.renameData(child.dataName(SOURCE), model.dataName(SOURCE));
        delete childData.source;
      } else {
        // child does not have data defined or the same source so just use the parents source
        childData.source = {
          name: child.dataName(SOURCE),
          source: model.dataName(SOURCE)
        };
      }
    });
    return sourceData;
  }

  var PRELOOKUP = '_preLookup', LOOKUP = '_lookup_', POSTLOOKUP = '_postLookup';
  export function assemble(model: Model, component: DataComponent) {
    if (component.source) {
      let sourceData: VgData = component.source,
          name = sourceData.name,
          lookupDef = component.lookup,
          lookupData = [], transforms = [];

      if (component.formatParse) {
        component.source.format = component.source.format || {};
        component.source.format.parse = component.formatParse;
      }

      // null filter comes first so transforms are not performed on null values
      // time and bin should come before filter so we can filter by time and bin
      sourceData.transform = [].concat(
        // had to move formula before null filter because we cannot null filter something that does not exist
        formula.assemble(component),
        nullFilter.assemble(component),
        bin.assemble(component),
        filter.assemble(component),
        timeUnit.assemble(component),
        filterWith.assemble(component)
      );

      // HACK FOR INFOVIS
      if (component.lookup && isUnitModel(model)) {
        sourceData.name = name + PRELOOKUP;
        transforms = sourceData.transform.splice(0);
        lookupData.push(sourceData);

        keys(lookupDef).forEach(function(k) {
          lookupData.push({
            name: name + LOOKUP + k,
            source: name + PRELOOKUP,
            transform: [{
              type: 'filter',
              test: compileSelectionPredicate(model, lookupDef[k].selection)
            }]
          })
        });

        sourceData = duplicate(sourceData);
        sourceData.name = name;
        sourceData.source = name + PRELOOKUP;
        sourceData.transform = keys(lookupDef).map(function(k) {
          var keys = lookupDef[k].keys;
          return {
            type: 'lookup',
            on: name + LOOKUP + k,
            onKey: keys, keys: keys,
            as: [k], default: {}
          }
        }).concat(transforms);

        lookupData.push(sourceData);

        return lookupData;
      } else {
        return [sourceData];
      }
    }
    return null;
  }
}
