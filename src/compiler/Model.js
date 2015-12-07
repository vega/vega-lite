var channel_1 = require('../channel');
var data_1 = require('../data');
var vlFieldDef = require('../fielddef');
var vlEncoding = require('../encoding');
var layout_1 = require('./layout');
var mark_1 = require('../mark');
var schema = require('../schema/schema');
var schemaUtil = require('../schema/schemautil');
var type_1 = require('../type');
var util_1 = require('../util');
var time = require('./time');
var Model = (function () {
    function Model(spec, theme) {
        var defaults = schema.instantiate();
        this._spec = schemaUtil.merge(defaults, theme || {}, spec);
        vlEncoding.forEach(this._spec.encoding, function (fieldDef, channel) {
            if (fieldDef.type) {
                fieldDef.type = type_1.getFullName(fieldDef.type);
            }
        });
        this._stack = this.getStackProperties();
        this._layout = layout_1.compileLayout(this);
    }
    Model.prototype.getStackProperties = function () {
        var stackChannel = (this.has(channel_1.COLOR)) ? channel_1.COLOR : (this.has(channel_1.DETAIL)) ? channel_1.DETAIL : null;
        if (stackChannel &&
            (this.is(mark_1.BAR) || this.is(mark_1.AREA)) &&
            this.config('stack') !== false &&
            this.isAggregate()) {
            var isXMeasure = this.isMeasure(channel_1.X);
            var isYMeasure = this.isMeasure(channel_1.Y);
            if (isXMeasure && !isYMeasure) {
                return {
                    groupbyChannel: channel_1.Y,
                    fieldChannel: channel_1.X,
                    stackChannel: stackChannel,
                    config: this.config('stack')
                };
            }
            else if (isYMeasure && !isXMeasure) {
                return {
                    groupbyChannel: channel_1.X,
                    fieldChannel: channel_1.Y,
                    stackChannel: stackChannel,
                    config: this.config('stack')
                };
            }
        }
        return null;
    };
    Model.prototype.layout = function () {
        return this._layout;
    };
    Model.prototype.stack = function () {
        return this._stack;
    };
    Model.prototype.toSpec = function (excludeConfig, excludeData) {
        var encoding = util_1.duplicate(this._spec.encoding), spec;
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
        var defaults = schema.instantiate();
        return schemaUtil.subtract(spec, defaults);
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
        return this._spec.encoding[channel].field !== undefined;
    };
    Model.prototype.fieldDef = function (channel) {
        return this._spec.encoding[channel];
    };
    Model.prototype.field = function (channel, opt) {
        opt = opt || {};
        var fieldDef = this.fieldDef(channel);
        var f = (opt.datum ? 'datum.' : '') + (opt.prefn || ''), field = fieldDef.field;
        if (vlFieldDef.isCount(fieldDef)) {
            return f + 'count';
        }
        else if (opt.fn) {
            return f + opt.fn + '_' + field;
        }
        else if (!opt.nofn && fieldDef.bin) {
            var binSuffix = opt.binSuffix || '_start';
            return f + 'bin_' + field + binSuffix;
        }
        else if (!opt.nofn && !opt.noAggregate && fieldDef.aggregate) {
            return f + fieldDef.aggregate + '_' + field;
        }
        else if (!opt.nofn && fieldDef.timeUnit) {
            return f + fieldDef.timeUnit + '_' + field;
        }
        else {
            return f + field;
        }
    };
    Model.prototype.fieldTitle = function (channel) {
        if (vlFieldDef.isCount(this._spec.encoding[channel])) {
            return vlFieldDef.COUNT_DISPLAYNAME;
        }
        var fn = this._spec.encoding[channel].aggregate || this._spec.encoding[channel].timeUnit || (this._spec.encoding[channel].bin && 'bin');
        if (fn) {
            return fn.toUpperCase() + '(' + this._spec.encoding[channel].field + ')';
        }
        else {
            return this._spec.encoding[channel].field;
        }
    };
    Model.prototype.numberFormat = function (channel) {
        return this.config('numberFormat');
    };
    ;
    Model.prototype.map = function (f) {
        return vlEncoding.map(this._spec.encoding, f);
    };
    Model.prototype.reduce = function (f, init) {
        return vlEncoding.reduce(this._spec.encoding, f, init);
    };
    Model.prototype.forEach = function (f) {
        return vlEncoding.forEach(this._spec.encoding, f);
    };
    Model.prototype.isOrdinalScale = function (channel) {
        var fieldDef = this.fieldDef(channel);
        return fieldDef && (util_1.contains([type_1.NOMINAL, type_1.ORDINAL], fieldDef.type) ||
            (fieldDef.type === type_1.TEMPORAL && fieldDef.timeUnit &&
                time.scale.type(fieldDef.timeUnit, channel) === 'ordinal'));
    };
    Model.prototype.isDimension = function (channel) {
        return this.has(channel) &&
            vlFieldDef.isDimension(this.fieldDef(channel));
    };
    Model.prototype.isMeasure = function (channel) {
        return this.has(channel) &&
            vlFieldDef.isMeasure(this.fieldDef(channel));
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
    Model.prototype.hasValues = function () {
        var vals = this.data().values;
        return vals && vals.length;
    };
    Model.prototype.config = function (name) {
        return this._spec.config[name];
    };
    Model.prototype.markOpacity = function () {
        var opacity = this.config('marks').opacity;
        if (opacity) {
            return opacity;
        }
        else {
            if (util_1.contains([mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE], this.mark())) {
                if (!this.isAggregate() || this.has(channel_1.DETAIL)) {
                    return 0.7;
                }
            }
        }
        return undefined;
    };
    return Model;
})();
exports.Model = Model;
//# sourceMappingURL=Model.js.map