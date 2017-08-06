import {UnitModel} from '../unit';
import * as mixins from './mixins';

import {Config} from '../../config';
import {Field, FieldDef, isFieldDef} from '../../fielddef';
import {VgGeoShapeTransform, VgPostEncodingTransform} from '../../vega.schema';
import {getMarkConfig} from '../common';
import {MarkCompiler} from './base';

export const geoshape: MarkCompiler = {
  vgMark: 'shape',
  defaultRole: 'geoshape',
  encodeEntry: (model: UnitModel) => {
    const {config} = model;
    return {
      ...mixins.color(model),
      ...mixins.nonPosition('opacity', model),
      ...mixins.nonPosition('size', model)
    };
  },
  postEncodingTransform: (model: UnitModel): VgPostEncodingTransform[] => {
    const {encoding} = model;
    const shapeDef = encoding.shape;

    if (shapeDef.type === 'geojson') {
      const transform: VgGeoShapeTransform = {
        type: 'geoshape',
        projection: model.getName('projection'),
        as: 'shape',
        ...(shapeDef ? {field: `datum[${shapeDef.field}]`} : {}),
      };
      return [transform];
    }
    throw new Error('Will, please think about should happen in this case -- probably error?');
  }
};
