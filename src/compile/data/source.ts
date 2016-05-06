import {SOURCE} from '../../data';
import {contains} from '../../util';
import {VgData, isVgData} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';
import {nullFilter} from './nullfilter';
import {filter} from './filter';
import {bin} from './bin';
import {formula} from './formula';
import {timeUnit} from './timeunit';

export namespace source {
  export function parseUnit(model: Model): VgData {
    let data = model.data();
    if (data) {
      let sourceData: VgData = {};
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
    }
    return undefined;
  }

  export function assemble(model: Model, component: DataComponent) {
    if (component.source) {
      let sourceData: VgData = {};
      if (isVgData(component.source)) {
        sourceData = component.source;
      }

      if (component.formatParse) {
        sourceData.format = sourceData.format || {};
        sourceData.format.parse = component.formatParse;
      }

      return sourceData;
    }
    return null;
  }
}
