"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mixins = require("./mixins");
var ref = require("./valueref");
var common_1 = require("../common");
function encodeEntry(model, fixedShape) {
    var config = model.config;
    return tslib_1.__assign({}, mixins.pointPosition('x', model, ref.midX(config)), mixins.pointPosition('y', model, ref.midY(config)), mixins.color(model), mixins.nonPosition('size', model), shapeMixins(model, config, fixedShape), mixins.nonPosition('opacity', model));
}
function shapeMixins(model, config, fixedShape) {
    if (fixedShape) {
        return { shape: { value: fixedShape } };
    }
    return mixins.nonPosition('shape', model, { defaultValue: common_1.getMarkConfig('shape', 'point', config) });
}
exports.shapeMixins = shapeMixins;
exports.point = {
    vgMark: 'symbol',
    role: 'point',
    encodeEntry: function (model) {
        return encodeEntry(model);
    }
};
exports.circle = {
    vgMark: 'symbol',
    role: 'circle',
    encodeEntry: function (model) {
        return encodeEntry(model, 'circle');
    }
};
exports.square = {
    vgMark: 'symbol',
    role: 'square',
    encodeEntry: function (model) {
        return encodeEntry(model, 'square');
    }
};
//# sourceMappingURL=point.js.map