"use strict";
var config_schema_1 = require('../schema/config.schema');
var channel_1 = require('../channel');
var data_1 = require('../data');
var vlFieldDef = require('../fielddef');
var vlEncoding = require('../encoding');
var mark_1 = require('../mark');
var type_1 = require('../type');
var util_1 = require('../util');
var config_1 = require('./config');
var stack_1 = require('./stack');
var scale_1 = require('./scale');
var enums_1 = require('../enums');
var aggregate_1 = require('../aggregate');
;
var Model = (function () {
    function Model(spec) {
        var model = this;
        this._spec = spec;
        var mark = this._spec.mark;
        var encoding = this._spec.encoding = this._spec.encoding || {};
        var config = this._config = util_1.mergeDeep(util_1.duplicate(config_schema_1.defaultConfig), spec.config);
        vlEncoding.forEach(this._spec.encoding, function (fieldDef, channel) {
            if (!channel_1.supportMark(channel, this._spec.mark)) {
                console.warn(channel, 'dropped as it is incompatible with', this._spec.mark);
                delete this._spec.encoding[channel].field;
            }
            if (fieldDef.type) {
                fieldDef.type = type_1.getFullName(fieldDef.type);
            }
            if ((channel === channel_1.PATH || channel === channel_1.ORDER) && !fieldDef.aggregate && fieldDef.type === type_1.QUANTITATIVE) {
                fieldDef.aggregate = aggregate_1.AggregateOp.MIN;
            }
        }, this);
        var scale = this._scale = [channel_1.X, channel_1.Y, channel_1.COLOR, channel_1.SHAPE, channel_1.SIZE, channel_1.ROW, channel_1.COLUMN].reduce(function (_scale, channel) {
            if (vlEncoding.has(encoding, channel)) {
                var channelScale = encoding[channel].scale || {};
                var channelDef = encoding[channel];
                var _scaleType = scale_1.scaleType(channelScale, channelDef, channel, mark);
                if (util_1.contains([channel_1.ROW, channel_1.COLUMN], channel)) {
                    _scale[channel] = util_1.extend({
                        type: _scaleType,
                        round: config.facet.scale.round,
                        padding: (channel === channel_1.ROW && model.has(channel_1.Y)) || (channel === channel_1.COLUMN && model.has(channel_1.X)) ?
                            config.facet.scale.padding : 0
                    }, channelScale);
                }
                else {
                    _scale[channel] = util_1.extend({
                        type: _scaleType,
                        round: config.scale.round,
                        padding: config.scale.padding,
                        useRawDomain: config.scale.useRawDomain,
                        bandSize: channel === channel_1.X && _scaleType === enums_1.ScaleType.ORDINAL && mark === mark_1.TEXT ?
                            config.scale.textBandWidth : config.scale.bandSize
                    }, channelScale);
                }
            }
            return _scale;
        }, {});
        this._axis = [channel_1.X, channel_1.Y, channel_1.ROW, channel_1.COLUMN].reduce(function (_axis, channel) {
            if (vlEncoding.has(encoding, channel)) {
                var channelAxis = encoding[channel].axis;
                if (channelAxis !== false) {
                    _axis[channel] = util_1.extend({}, channel === channel_1.X || channel === channel_1.Y ? config.axis : config.facet.axis, channelAxis === true ? {} : channelAxis || {});
                }
            }
            return _axis;
        }, {});
        this._legend = [channel_1.COLOR, channel_1.SHAPE, channel_1.SIZE].reduce(function (_legend, channel) {
            if (vlEncoding.has(encoding, channel)) {
                var channelLegend = encoding[channel].legend;
                if (channelLegend !== false) {
                    _legend[channel] = util_1.extend({}, config.legend, channelLegend === true ? {} : channelLegend || {});
                }
            }
            return _legend;
        }, {});
        this._stack = stack_1.compileStackProperties(mark, encoding, scale, config);
        this._config.mark = config_1.compileMarkConfig(mark, encoding, config, this._stack);
    }
    Model.prototype.stack = function () {
        return this._stack;
    };
    Model.prototype.toSpec = function (excludeConfig, excludeData) {
        var encoding = util_1.duplicate(this._spec.encoding);
        var spec;
        spec = {
            mark: this._spec.mark,
            encoding: encoding
        };
        if (!excludeConfig) {
            spec.config = util_1.duplicate(this._spec.config);
        }
        if (!excludeData) {
            spec.data = util_1.duplicate(this._spec.data);
        }
        return spec;
    };
    Model.prototype.cellWidth = function () {
        return (this.isFacet() ? this.config().facet.cell.width : null) ||
            this.config().cell.width;
    };
    Model.prototype.cellHeight = function () {
        return (this.isFacet() ? this.config().facet.cell.height : null) ||
            this.config().cell.height;
    };
    Model.prototype.mark = function () {
        return this._spec.mark;
    };
    Model.prototype.spec = function () {
        return this._spec;
    };
    Model.prototype.is = function (mark) {
        return this._spec.mark === mark;
    };
    Model.prototype.has = function (channel) {
        return vlEncoding.has(this._spec.encoding, channel);
    };
    Model.prototype.encoding = function () {
        return this._spec.encoding;
    };
    Model.prototype.fieldDef = function (channel) {
        return this._spec.encoding[channel] || {};
    };
    Model.prototype.field = function (channel, opt) {
        if (opt === void 0) { opt = {}; }
        var fieldDef = this.fieldDef(channel);
        var scale = this.scale(channel);
        if (fieldDef.bin) {
            opt = util_1.extend({
                binSuffix: scale_1.scaleType(scale, fieldDef, channel, this.mark()) === enums_1.ScaleType.ORDINAL ? '_range' : '_start'
            }, opt);
        }
        return vlFieldDef.field(fieldDef, opt);
    };
    Model.prototype.fieldTitle = function (channel) {
        return vlFieldDef.title(this._spec.encoding[channel]);
    };
    Model.prototype.channels = function () {
        return vlEncoding.channels(this._spec.encoding);
    };
    Model.prototype.map = function (f, t) {
        return vlEncoding.map(this._spec.encoding, f, t);
    };
    Model.prototype.reduce = function (f, init, t) {
        return vlEncoding.reduce(this._spec.encoding, f, init, t);
    };
    Model.prototype.forEach = function (f, t) {
        vlEncoding.forEach(this._spec.encoding, f, t);
    };
    Model.prototype.isOrdinalScale = function (channel) {
        var fieldDef = this.fieldDef(channel);
        var scale = this.scale(channel);
        return this.has(channel) && scale_1.scaleType(scale, fieldDef, channel, this.mark()) === enums_1.ScaleType.ORDINAL;
    };
    Model.prototype.isDimension = function (channel) {
        return vlFieldDef.isDimension(this.fieldDef(channel));
    };
    Model.prototype.isMeasure = function (channel) {
        return vlFieldDef.isMeasure(this.fieldDef(channel));
    };
    Model.prototype.isAggregate = function () {
        return vlEncoding.isAggregate(this._spec.encoding);
    };
    Model.prototype.isFacet = function () {
        return this.has(channel_1.ROW) || this.has(channel_1.COLUMN);
    };
    Model.prototype.dataTable = function () {
        return this.isAggregate() ? data_1.SUMMARY : data_1.SOURCE;
    };
    Model.prototype.data = function () {
        return this._spec.data;
    };
    Model.prototype.transform = function () {
        return this._spec.transform || {};
    };
    Model.prototype.config = function () {
        return this._config;
    };
    Model.prototype.sort = function (channel) {
        return this._spec.encoding[channel].sort;
    };
    Model.prototype.scale = function (channel) {
        return this._scale[channel];
    };
    Model.prototype.axis = function (channel) {
        return this._axis[channel];
    };
    Model.prototype.legend = function (channel) {
        return this._legend[channel];
    };
    Model.prototype.scaleName = function (channel) {
        var name = this.spec().name;
        return (name ? name + '-' : '') + channel;
    };
    Model.prototype.sizeValue = function (channel) {
        if (channel === void 0) { channel = channel_1.SIZE; }
        var fieldDef = this.fieldDef(channel_1.SIZE);
        if (fieldDef && fieldDef.value !== undefined) {
            return fieldDef.value;
        }
        var scaleConfig = this.config().scale;
        switch (this.mark()) {
            case mark_1.TEXT:
                return this.config().mark.fontSize;
            case mark_1.BAR:
                if (this.config().mark.barSize) {
                    return this.config().mark.barSize;
                }
                return this.isOrdinalScale(channel) ?
                    this.scale(channel).bandSize - 1 :
                    !this.has(channel) ?
                        scaleConfig.bandSize - 1 :
                        this.config().mark.barThinSize;
            case mark_1.TICK:
                if (this.config().mark.tickSize) {
                    return this.config().mark.tickSize;
                }
                var bandSize = this.has(channel) ?
                    this.scale(channel).bandSize :
                    scaleConfig.bandSize;
                return bandSize / 1.5;
        }
        return this.config().mark.size;
    };
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=Model.js.map