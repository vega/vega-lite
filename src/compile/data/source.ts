import {SOURCE} from '../../data';
import {contains, empty} from '../../util';
import {VgData, isVgData} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';
import {nullFilter} from './nullfilter';
import {filter} from './filter';
import {bin} from './bin';
import {calculate} from './calculate';
import {timeUnit} from './timeunit';
import {formatParse} from './formatparse';

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
      let sourceData: VgData = component.source;

      const parse = formatParse.assemble(component);
      if (parse && !empty(parse)) {
        sourceData.format = sourceData.format || {};
        sourceData.format.parse = parse;
      }

      return sourceData;
    }
    return null;
  }
}
