import {autoMaxBins} from '../../bin';
import {Channel, COLOR} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import {extend, vals, flatten, hash, Dict} from '../../util';
import {VgTransform} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';

export namespace bin {
  function numberFormatExpr(format: string, expr: string) {
    return `format('${format}', ${expr})`;
  }

  function parse(model: Model): Dict<VgTransform[]> {
    return model.reduce(function(binComponent: Dict<VgTransform[]>, fieldDef: FieldDef, channel: Channel) {
      const bin = model.fieldDef(channel).bin;
      if (bin) {
        let binTrans = extend({
          type: 'bin',
          field: fieldDef.field,
          as: [field(fieldDef, { binSuffix: 'start' }), field(fieldDef, { binSuffix: 'end'})]
        },
          // if bin is an object, load parameter here!
          typeof bin === 'boolean' ? {} : bin
        );

        if (!binTrans.maxbins && !binTrans.step) {
          // if both maxbins and step are not specified, need to automatically determine bin
          binTrans.maxbins = autoMaxBins(channel);
        }

        const transform: VgTransform[] = [binTrans];
        // If color ramp has type linear or time, we have to create new bin_range field
        // with correct number format
        const isOrdinalColor = model.hasDiscreteScale(channel) || channel === COLOR;
        if (isOrdinalColor) {
          // read format from axis or legend, if there is not format there then use config.numberFormat
          const format = (model.axis(channel) || model.legend(channel) || {}).format ||
            model.config().numberFormat;

          const startField = field(fieldDef, { datum: true, binSuffix: 'start' });
          const endField = field(fieldDef, { datum: true, binSuffix: 'end' });

          transform.push({
            type: 'formula',
            as: field(fieldDef, { binSuffix: 'range' }),
            expr: numberFormatExpr(format, startField) +
              ' + \'-\' + ' +
              numberFormatExpr(format, endField)
          });
        }
        // FIXME: current merging logic can produce redundant transforms when a field is binned for color and for non-color
        const key = hash(bin) + '_' + fieldDef.field + 'oc:' + isOrdinalColor;
        binComponent[key] = transform;
      }
      return binComponent;
    }, {});
  }

  export const parseUnit: (model: Model) => Dict<VgTransform[]> = parse;

  export function parseFacet(model: FacetModel) {
    let binComponent = parse(model);

    const childDataComponent = model.child().component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      // FIXME: current merging logic can produce redundant transforms when a field is binned for color and for non-color
      extend(binComponent, childDataComponent.bin);
      delete childDataComponent.bin;
    }
    return binComponent;
  }

  export function parseLayer(model: LayerModel) {
    let binComponent = parse(model);

    model.children().forEach((child) => {
      const childDataComponent = child.component.data;

      // If child doesn't have its own data source, then merge
      if (!childDataComponent.source) {
        extend(binComponent, childDataComponent.bin);
        delete childDataComponent.bin;
      }
    });

    return binComponent;
  }

  export function assemble(component: Dict<VgTransform[]>) {
    return flatten(vals(component));
  }
}
