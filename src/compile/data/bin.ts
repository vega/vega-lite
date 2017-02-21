import {DataComponentCompiler} from './base';

import {autoMaxBins} from '../../bin';
import {Channel} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import {extend, vals, flatten, hash, isBoolean,Dict} from '../../util';
import {VgTransform} from '../../vega.schema';
import {hasDiscreteDomain} from '../../scale';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';


function numberFormatExpr(expr: string, format: string) {
  return `format(${expr}, '${format}')`;
}

function parse(model: Model): Dict<VgTransform[]> {
  return model.reduceFieldDef(function(binComponent: Dict<VgTransform[]>, fieldDef: FieldDef, channel: Channel) {
    // Extracting the bin
    const bin = model.fieldDef(channel).bin;
    if (bin) {
      // If bin exists, then binTrans is created which is a Bin & ???
      let binTrans: VgTransform = extend({
        type: 'bin',
        field: fieldDef.field,
        as: [field(fieldDef, {binSuffix: 'start'}), field(fieldDef, {binSuffix: 'end'})]
      },
        // if bin is an object, load parameter here!
        isBoolean(bin) ? {} : bin
      );

      const transform: VgTransform[] = [];
      if (!binTrans.extent) {
        const extentSignal = model.getName(/*channel + '_' + */fieldDef.field + '_extent');
        // Not going to use channel to differentiate extent signals.
        // Just here for the moment so that I know what the viz must look like
        transform.push({
          type: 'extent',
          field: fieldDef.field,
          signal: extentSignal
        });

        binTrans.extent = {signal: extentSignal};
      }

      if (!binTrans.maxbins && !binTrans.step) {
        // if both maxbins and step are not specified, need to automatically determine bin
        binTrans.maxbins = autoMaxBins(channel);
      }

      transform.push(binTrans);

      const hasDiscreteDomainOrHasLegend = hasDiscreteDomain(model.scale(channel).type) || model.legend(channel);
      if (hasDiscreteDomainOrHasLegend) {
        // read format from axis or legend, if there is no format then use config.numberFormat
        const format = (model.axis(channel) || model.legend(channel) || {}).format ||
          model.config.numberFormat;

        const startField = field(fieldDef, {datum: true, binSuffix: 'start'});
        const endField = field(fieldDef, {datum: true, binSuffix: 'end'});

        transform.push({
          type: 'formula',
          as: field(fieldDef, {binSuffix: 'range'}),
          expr: `${numberFormatExpr(startField, format)} + ' - ' + ${numberFormatExpr(endField, format)}`
        });
      }
      // FIXME: current merging logic can produce redundant transforms when a field is binned for color and for non-color
      let res = '_';
      for (const property in bin.valueOf()) {
        if (bin[property]) {
          res += '_' + property + '_' + bin[property].toString();
        }
      }
      const key = hash(bin) + res + fieldDef.field/* + (hasDiscreteDomainOrHasLegend ? '_range' : '') */;
      binComponent[key] = transform;
    }
    return binComponent;
  }, {});
}

export const bin: DataComponentCompiler<Dict<VgTransform[]>> = {
  parseUnit: parse,

  parseFacet: function(model: FacetModel) {
    let binComponent = parse(model);

    const childDataComponent = model.child.component.data;

    // If child doesn't have its own data source, then merge
    if (!childDataComponent.source) {
      // FIXME: current merging logic can produce redundant transforms when a field is binned for color and for non-color
      extend(binComponent, childDataComponent.bin);
      delete childDataComponent.bin;
    }
    return binComponent;
  },

  parseLayer: function (model: LayerModel) {
    let binComponent = parse(model);

    model.children.forEach((child) => {
      const childDataComponent = child.component.data;

      // If child doesn't have its own data source, then merge
      if (!childDataComponent.source) {
        extend(binComponent, childDataComponent.bin);
        delete childDataComponent.bin;
      }
    });

    return binComponent;
  },

  assemble: function (component: Dict<VgTransform[]>) {
    return flatten(vals(component));
  }
};
