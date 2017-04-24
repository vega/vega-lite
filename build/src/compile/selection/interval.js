"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var log_1 = require("../../log");
var util_1 = require("../../util");
var selection_1 = require("./selection");
var scales_1 = require("./transforms/scales");
exports.BRUSH = '_brush', exports.SIZE = '_size';
var interval = {
    predicate: 'vlInterval',
    signals: function (model, selCmpt) {
        var signals = [], intervals = [], name = selCmpt.name, size = name + exports.SIZE;
        if (selCmpt.translate && !(scales_1.default.has(selCmpt))) {
            events(selCmpt, function (_, evt) {
                var filters = evt.between[0].filter || (evt.between[0].filter = []);
                filters.push('!event.item || (event.item && ' +
                    ("event.item.mark.name !== " + util_1.stringValue(name + exports.BRUSH) + ")"));
            });
        }
        selCmpt.project.forEach(function (p) {
            if (p.encoding !== channel_1.X && p.encoding !== channel_1.Y) {
                log_1.warn('Interval selections only support x and y encoding channels.');
                return;
            }
            var cs = channelSignal(model, selCmpt, p.encoding);
            signals.push(cs);
            intervals.push("{encoding: " + util_1.stringValue(p.encoding) + ", " +
                ("field: " + util_1.stringValue(p.field) + ", extent: " + cs.name + "}"));
        });
        signals.push({
            name: size,
            value: [],
            on: events(selCmpt, function (on, evt) {
                on.push({
                    events: evt.between[0],
                    update: '{x: x(unit), y: y(unit), width: 0, height: 0}'
                });
                on.push({
                    events: evt,
                    update: "{x: " + size + ".x, y: " + size + ".y, " +
                        ("width: abs(x(unit) - " + size + ".x), height: abs(y(unit) - " + size + ".y)}")
                });
                return on;
            })
        }, {
            name: name,
            update: "[" + intervals.join(', ') + "]"
        });
        return signals;
    },
    tupleExpr: function (model, selCmpt) {
        return "intervals: " + selCmpt.name;
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'true' : "{unit: " + tpl + ".unit}");
    },
    marks: function (model, selCmpt, marks) {
        var name = selCmpt.name, _a = projections(selCmpt), xi = _a.xi, yi = _a.yi, tpl = name + selection_1.TUPLE, store = "data(" + util_1.stringValue(selCmpt.name + selection_1.STORE) + ")";
        // Do not add a brush if we're binding to scales.
        if (scales_1.default.has(selCmpt)) {
            return marks;
        }
        var update = {
            x: util_1.extend({}, xi !== null ?
                { scale: model.scaleName(channel_1.X), signal: name + "[" + xi + "].extent[0]" } :
                { value: 0 }),
            x2: util_1.extend({}, xi !== null ?
                { scale: model.scaleName(channel_1.X), signal: name + "[" + xi + "].extent[1]" } :
                { field: { group: 'width' } }),
            y: util_1.extend({}, yi !== null ?
                { scale: model.scaleName(channel_1.Y), signal: name + "[" + yi + "].extent[0]" } :
                { value: 0 }),
            y2: util_1.extend({}, yi !== null ?
                { scale: model.scaleName(channel_1.Y), signal: name + "[" + yi + "].extent[1]" } :
                { field: { group: 'height' } })
        };
        // If the selection is resolved to global, only a single interval is in
        // the store. Wrap brush mark's encodings with a production rule to test
        // this based on the `unit` property. Hide the brush mark if it corresponds
        // to a unit different from the one in the store.
        if (selCmpt.resolve === 'global') {
            util_1.keys(update).forEach(function (key) {
                update[key] = [tslib_1.__assign({ test: store + ".length && " + tpl + " && " + tpl + ".unit === " + store + "[0].unit" }, update[key]), { value: 0 }];
            });
        }
        return [{
                name: undefined,
                type: 'rect',
                encode: {
                    enter: { fill: { value: '#eee' } },
                    update: update
                }
            }].concat(marks, {
            name: name + exports.BRUSH,
            type: 'rect',
            encode: {
                enter: { fill: { value: 'transparent' } },
                update: update
            }
        });
    }
};
exports.default = interval;
function projections(selCmpt) {
    var x = null, xi = null, y = null, yi = null;
    selCmpt.project.forEach(function (p, i) {
        if (p.encoding === channel_1.X) {
            x = p;
            xi = i;
        }
        else if (p.encoding === channel_1.Y) {
            y = p;
            yi = i;
        }
    });
    return { x: x, xi: xi, y: y, yi: yi };
}
exports.projections = projections;
function channelSignal(model, selCmpt, channel) {
    var name = selection_1.channelSignalName(selCmpt, channel), size = model.getSizeSignalRef(channel === channel_1.X ? 'width' : 'height').signal, coord = channel + "(unit)", invert = selection_1.invert.bind(null, model, selCmpt, channel);
    return {
        name: name,
        value: [],
        on: scales_1.default.has(selCmpt) ? [] : events(selCmpt, function (on, evt) {
            on.push({
                events: evt.between[0],
                update: invert("[" + coord + ", " + coord + "]")
            });
            on.push({
                events: evt,
                update: "[" + name + "[0], " + invert("clamp(" + coord + ", 0, " + size + ")") + ']'
            });
            return on;
        })
    };
}
function events(selCmpt, cb) {
    return selCmpt.events.reduce(function (on, evt) {
        if (!evt.between) {
            log_1.warn(evt + " is not an ordered event stream for interval selections");
            return on;
        }
        return cb(on, evt);
    }, []);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQTRDO0FBQzVDLGlDQUErQjtBQUMvQixtQ0FBcUQ7QUFFckQseUNBQXlJO0FBQ3pJLDhDQUF5QztBQUU1QixRQUFBLEtBQUssR0FBRyxRQUFRLEVBQzNCLFFBQUEsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUVqQixJQUFNLFFBQVEsR0FBcUI7SUFDakMsU0FBUyxFQUFFLFlBQVk7SUFFdkIsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDOUIsSUFBTSxPQUFPLEdBQVUsRUFBRSxFQUNyQixTQUFTLEdBQVMsRUFBRSxFQUNwQixJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFDbkIsSUFBSSxHQUFHLElBQUksR0FBRyxZQUFJLENBQUM7UUFFdkIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFTLENBQVEsRUFBRSxHQUFRO2dCQUN6QyxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN0RSxPQUFPLENBQUMsSUFBSSxDQUFDLGdDQUFnQztxQkFDM0MsOEJBQTRCLGtCQUFXLENBQUMsSUFBSSxHQUFHLGFBQUssQ0FBQyxNQUFHLENBQUEsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMs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