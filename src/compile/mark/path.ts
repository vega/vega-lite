import {Config} from '../../config';
import {FieldDef} from '../../fielddef';
import {GEOJSON} from '../../type';
import {VgValueRef} from '../../vega.schema';

import {applyColorAndOpacity} from '../common';
import {UnitModel} from '../unit';

export namespace path {
  export function markType() {
    return 'path';
  }

  export function properties(model: UnitModel, fixedShape?: string) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const config = model.config();

    p.path = path(model.encoding().path);
    p.stroke = stroke(config);
    applyColorAndOpacity(p, model);
    return p;
  }

  function stroke(config: Config): VgValueRef {
    if (config && config.mark && config.mark.stroke) {
      return { value: config.mark.stroke };
    }
    return { value: config.mark.pathStroke };
  }

  function path(fieldDef: FieldDef): VgValueRef {
    if (fieldDef && fieldDef.type === GEOJSON) {
      // Return the default output from geopath transform because we never
      // change the output.
      return { field: 'layout_path' };
    }
    return undefined;
  }
}
