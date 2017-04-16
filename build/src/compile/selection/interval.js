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
            intervals.push("{field: " + util_1.stringValue(p.field) + ", extent: " + cs.name + "}");
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
        var name = selCmpt.name, _a = projections(selCmpt), x = _a.x, y = _a.y, tpl = name + selection_1.TUPLE, store = "data(" + util_1.stringValue(name + selection_1.STORE) + ")";
        // Do not add a brush if we're binding to scales.
        if (scales_1.default.has(selCmpt)) {
            return marks;
        }
        var update = {
            x: util_1.extend({}, x !== null ?
                { scale: model.scaleName(channel_1.X), signal: name + "[" + x + "].extent[0]" } :
                { value: 0 }),
            x2: util_1.extend({}, x !== null ?
                { scale: model.scaleName(channel_1.X), signal: name + "[" + x + "].extent[1]" } :
                { field: { group: 'width' } }),
            y: util_1.extend({}, y !== null ?
                { scale: model.scaleName(channel_1.Y), signal: name + "[" + y + "].extent[0]" } :
                { value: 0 }),
            y2: util_1.extend({}, y !== null ?
                { scale: model.scaleName(channel_1.Y), signal: name + "[" + y + "].extent[1]" } :
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
    var x = null, y = null;
    selCmpt.project.forEach(function (p, i) {
        if (p.encoding === channel_1.X) {
            x = i;
        }
        else if (p.encoding === channel_1.Y) {
            y = i;
        }
    });
    return { x: x, y: y };
}
exports.projections = projections;
function channelSignal(model, selCmpt, channel) {
    var name = selection_1.channelSignalName(selCmpt, channel), size = (channel === channel_1.X ? 'width' : 'height'), coord = channel + "(unit)", invert = selection_1.invert.bind(null, model, selCmpt, channel);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQTRDO0FBQzVDLGlDQUErQjtBQUMvQixtQ0FBcUQ7QUFFckQseUNBQXVIO0FBQ3ZILDhDQUF5QztBQUU1QixRQUFBLEtBQUssR0FBRyxRQUFRLEVBQzNCLFFBQUEsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUVqQixJQUFNLFFBQVEsR0FBcUI7SUFDakMsU0FBUyxFQUFFLFlBQVk7SUFFdkIsT0FBTyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDOUIsSUFBTSxPQUFPLEdBQVUsRUFBRSxFQUNyQixTQUFTLEdBQVMsRUFBRSxFQUNwQixJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFDbkIsSUFBSSxHQUFHLElBQUksR0FBRyxZQUFJLENBQUM7UUFFdkIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFTLENBQVEsRUFBRSxHQUFRO2dCQUN6QyxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUN0RSxPQUFPLENBQUMsSUFBSSxDQUFDLGdDQUFnQztxQkFDM0MsOEJBQTRCLGtCQUFXLENBQUMsSUFBSSxHQUFHLGFBQUssQ0FBQyxNQUFHLENBQUEsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMs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