import * as tslib_1 from "tslib";
import { getFirstDefined } from '../../util';
import { isVgRangeStep } from '../../vega.schema';
import * as mixins from './mixins';
import * as ref from './valueref';
export var tick = {
    vgMark: 'rect',
    encodeEntry: function (model) {
        var _a;
        var config = model.config, markDef = model.markDef, width = model.width, height = model.height;
        var orient = markDef.orient;
        var vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
        var vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width), 'xc'), mixins.pointPosition('y', model, ref.mid(height), 'yc'), mixins.nonPosition('size', model, {
            defaultValue: defaultSize(model),
            vgChannel: vgSizeChannel
        }), (_a = {}, _a[vgThicknessChannel] = { value: getFirstDefined(markDef.thickness, config.tick.thickness) }, _a));
    }
};
function defaultSize(model) {
    var config = model.config, markDef = model.markDef;
    var orient = markDef.orient;
    var scale = model.getScaleComponent(orient === 'horizontal' ? 'x' : 'y');
    if (markDef.size !== undefined) {
        return markDef.size;
    }
    else if (config.tick.bandSize !== undefined) {
        return config.tick.bandSize;
    }
    else {
        var scaleRange = scale ? scale.get('range') : undefined;
        var rangeStep = scaleRange && isVgRangeStep(scaleRange) ? scaleRange.step : config.scale.rangeStep;
        if (typeof rangeStep !== 'number') {
            // FIXME consolidate this log
            throw new Error('Function does not handle non-numeric rangeStep');
        }
        return rangeStep / 1.5;
    }
}
//# sourceMappingURL=tick.js.map