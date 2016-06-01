import {autoMaxBins} from '../../bin';
import {Channel, COLOR} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import {extend, vals, flatten, hash, Dict, isObject} from '../../util';
import {VgTransform} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

import {DataComponent} from './data';

export namespace bin {
  function parse(model: Model): Dict<VgTransform[]> {
    return model.reduce(function(binComponent, fieldDef: FieldDef, channel: Channel) {
      const bin = model.fieldDef(channel).bin;
      if (bin) {
        let binTrans = extend({
          type: 'bin',
          field: fieldDef.field,
          output: {
            start: field(fieldDef, { binSuffix: '_start' }),
            mid: field(fieldDef, { binSuffix: '_mid' }),
            end: field(fieldDef, { binSuffix: '_end' })
          }
        },
          // if bin is an object, load parameter here!
          isObject(bin) ? bin : {}
        );

        if (!binTrans.maxbins && !binTrans.step) {
          // if both maxbins and step are not specified, need to automatically determine bin
          binTrans.maxbins = autoMaxBins(channel);
        }

        const transform = [binTrans];
        const isOrdinalColor = model.isOrdinalScale(channel) || channel === COLOR;
        // color ramp has type linear or time
        if (isOrdinalColor) {
          transform.push({
            type: 'formula',
            field: field(fieldDef, { binSuffix: '_range' }),
            expr: field(fieldDef, { datum: true, binSuffix: '_start' }) +
            ' + \'-\' + ' +
            field(fieldDef, { datum: true, binSuffix: '_end' })
          });
        }
        // FIXME: current merging logic can produce redundant transforms when a field is binned for color and for non-color
        const key = (typeof bin !== 'boolean' ? hash(bin) + '_' : '') + fieldDef.field + 'oc:' + isOrdinalColor;
        binComponent[key] = transform;
      }
      return binComponent;
    }, {});
  }

  export function parseFacet(model: FacetModel) {
    const binComponent = parse(model);
    const childDataComponent = model.child().component.data;

    extend(binComponent, childDataComponent.bin);
    return binComponent;
  }

  export function merge(dataComponent: DataComponent, childDataComponents: DataComponent[]) {
    childDataComponents.forEach((childData) => {
      extend(dataComponent.bin, childData.bin);
      delete childData.bin;
    });
  }

  export const parseUnit = parse;

  export function assemble(component: DataComponent) {
    return flatten(vals(component.bin));
  }
}
