import {DataFormat, SOURCE} from '../../data';
import {contains, extend} from '../../util';
import {VgData} from '../../vega.schema';

import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {Model} from './../model';

import {DataComponent} from './data';
import {nullFilter} from './nullfilter';
import {filter} from './filter';
import {bin} from './bin';
import {formula} from './formula';
import {timeUnit} from './timeunit';

export namespace source {
  function parse(model: Model): VgData {
    let data = model.data();

    if (data) {
      // If data is explicitly provided

      let sourceData: VgData = { name: model.dataName(SOURCE) };
      if (data.values && data.values.length > 0) {
        sourceData.values = data.values;
        sourceData.format = { type: 'json' };
      } else if (data.url) {
        sourceData.url = data.url;

        // Extract extension from URL using snippet from
        // http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript
        let defaultExtension = /(?:\.([^.]+))?$/.exec(sourceData.url)[1];
        if (!contains(['json', 'csv', 'tsv', 'topojson'], defaultExtension)) {
          defaultExtension = 'json';
        }
        const dataFormat: DataFormat = data.format || {};

        // For backward compatability for former `data.formatType` property
        const formatType: DataFormat = dataFormat.type || data['formatType'];
        sourceData.format =
          extend(
            { type: formatType ? formatType : defaultExtension },
            dataFormat.property ? { property: dataFormat.property } : {},
            // Feature and mesh are two mutually exclusive properties
            dataFormat.feature ?
              { feature : dataFormat.feature } :
            dataFormat.mesh ?
              { mesh : dataFormat.mesh } :
              {}
          );
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
        const canMerge = !childData.filter && !childData.formatParse && !childData.nullFilter;
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

  export function assemble(model: Model, component: DataComponent) {
    if (component.source) {
      let sourceData: VgData = component.source;

      if (component.formatParse) {
        component.source.format = component.source.format || {};
        component.source.format.parse = component.formatParse;
      }

      // null filter comes first so transforms are not performed on null values
      // time and bin should come before filter so we can filter by time and bin
      sourceData.transform = [].concat(
        formula.assemble(component),
        nullFilter.assemble(component),
        filter.assemble(component),
        bin.assemble(component),
        timeUnit.assemble(component)
      );

      return sourceData;
    }
    return null;
  }
}
