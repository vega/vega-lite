import {DataComponentCompiler} from './base';

import {expression} from '../../filter';
import {isCalculate, isFilter, Transform} from '../../transform';
import {VgTransform} from '../../vega.schema';
import {Model} from '../model';

function parse(model: Model): Transform[] {
  return model.transforms;
}

export const transforms: DataComponentCompiler<Transform[]> = {
  parseUnit: parse,

  parseFacet: parse,

  parseLayer: parse,

  assemble: function(transformArray: Transform[]): VgTransform[] {
    const func: (t:Transform) => VgTransform = (t: Transform) => {
      if (isCalculate(t)) {
        return {
          type: 'formula',
          expr: t.calculate,
          as: t.as
        };
      }

      if (isFilter(t)) {
        return {
          type: 'filter',
          expr: expression(t.filter)
        };
      }

      return null;
    };

    return transformArray.map(func);
  }
};
