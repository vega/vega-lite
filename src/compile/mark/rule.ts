import {X, Y, Channel} from '../../channel';

import {UnitModel} from '../unit';
import {applyColorAndOpacity} from '../common';

export namespace rule {
  export function markType() {
    return 'rule';
  }

  export function properties(model: UnitModel) {
    let p: any = {};

    // TODO: support explicit value

    // vertical
    if (model.has(X)) {
      p.x = position(model, X);

      p.y = { value: 0 };
      p.y2 = {
          field: {group: 'height'}
        };
    }

    // horizontal
    if (model.has(Y)) {
      p.y = position(model, Y);

      p.x = { value: 0 };
      p.x2 = {
          field: {group: 'width'}
        };
    }

    applyColorAndOpacity(p, model);
    return p;
  }

  function position(model: UnitModel, channel: Channel) {
    return {
        scale: model.scaleName(channel),
        field: model.field(channel, { binSuffix: '_mid' })
      };
  }

  export function labels(model: UnitModel) {
    // TODO(#240): fill this method
    return undefined;
  }
}
