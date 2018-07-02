import * as tslib_1 from "tslib";
import { getMarkConfig } from '../common';
import * as mixins from './mixins';
import * as ref from './valueref';
export var text = {
    vgMark: 'text',
    encodeEntry: function (model) {
        var config = model.config, encoding = model.encoding, width = model.width, height = model.height, markDef = model.markDef;
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.text(model), mixins.nonPosition('size', model, tslib_1.__assign({}, (markDef.size ? { defaultValue: markDef.size } : {}), { vgChannel: 'fontSize' // VL's text size is fontSize
         })), mixins.valueIfDefined('align', align(model.markDef, encoding, config)));
    }
};
function align(markDef, encoding, config) {
    var a = markDef.align || getMarkConfig('align', markDef, config);
    if (a === undefined) {
        return 'center';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
//# sourceMappingURL=text.js.map