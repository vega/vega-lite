import {SOURCE} from '../../data';
import {contains, keys} from '../../util';
import {VgData} from '../../vega.schema';

import {Model} from './../model';

import {DataComponent, SourceComponent} from './data';
import {formatParse} from './formatparse';

export namespace source {
  export function parse(model: Model): SourceComponent {
    let data = model.data();
    if (data) {
      let sourceData: SourceComponent = {};
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

  export const parseUnit = parse;

  // child cannot define data source so no need to merge up
  export const parseFacet = parse;

  export function assemble(model: Model, component: DataComponent): VgData {
    if (component.source) {
      let sourceData: VgData = component.source as VgData;
      // VgData requires name
      sourceData.name = model.dataName(SOURCE);

      const parse = formatParse.assemble(component);
      if (parse && keys(parse).length !== 0) {
        sourceData.format = sourceData.format || {};
        sourceData.format.parse = parse;
      }

      return sourceData;
    }
    return null;
  }
}
