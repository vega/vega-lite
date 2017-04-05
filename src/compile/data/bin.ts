import {DataComponentCompiler} from './base';

import {Bin, binToString} from '../../bin';
import {Channel} from '../../channel';
import {field, FieldDef} from '../../fielddef';
import {hasDiscreteDomain} from '../../scale';
import {Dict, extend, flatten, isBoolean, vals, varName} from '../../util';
import {VgBinTransform, VgTransform} from '../../vega.schema';

import {FacetModel} from './../facet';
import {LayerModel} from './../layer';
import {Model} from './../model';


function numberFormatExpr(expr: string, format: string) {
  return `format(${expr}, '${format}')`;
}

function addRangeFormula(model: Model, transform: VgTransform[], fieldDef: FieldDef, channel: Channel) {
    const discreteDomain = hasDiscreteDomain(model.scale(channel).type);
    if  (discreteDomain) {
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
}

function parse(model: Model): Dict<VgTransform[]> {
  return model.reduceFieldDef(function(binComponent: Dict<VgTransform[]>, fieldDef: FieldDef, channel: Channel) {
    const fieldDefBin = model.fieldDef(channel).bin;
    if (fieldDefBin) {
      const bin: Bin = isBoolean(fieldDefBin) ? {} : fieldDefBin;
      if (!bin.maxbins && !bin.steps) {
        bin.maxbins = model.config.maxbins;
      }
      const key = `${binToString(fieldDef.bin)}_${fieldDef.field}`;
      let transform: VgTransform[] = binComponent[key];
      if (!transform) {
        binComponent[key] = transform = [];
        const extentSignal = model.getName(key + '_extent');
        // const binTrans: VgBinTransform = {
        //   ...{
        //     type: 'bin',
        //     field: fieldDef.field,
        //     as: [field(fieldDef, {binSuffix: 'start'}), field(fieldDef, {binSuffix: 'end'})],
        //     signal: varName(model.getName(key + '_bins'))
        //   },
        //   ...bin,
        //   // add extent if it's not specified
        //   ...(!bin.extent ? {extent: {signal: extentSignal}} : {}),
        // };
        let binTrans: VgBinTransform = {
            type: 'bin',
            field: fieldDef.field,
            as: [field(fieldDef, {binSuffix: 'start'}), field(fieldDef, {binSuffix: 'end'})],
            signal: varName(model.getName(key + '_bins'))
        };
        extend(binTrans, bin);
        if (!bin.extent) {
          transform.push({
            type: 'extent',
            field: fieldDef.field,
            signal: extentSignal
          });
          binTrans.extent = {signal: extentSignal};
        }
        transform.push(binTrans);
      }
      // if formula doesn't exist already
      if (transform.length > 0 && transform[transform.length - 1].type !== 'formula') {
        addRangeFormula(model, binComponent[key], fieldDef, channel);
      }
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
