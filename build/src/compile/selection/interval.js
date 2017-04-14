"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        return tpl + ", {unit: " + tpl + ".unit}";
    },
    marks: function (model, selCmpt, marks) {
        var name = selCmpt.name, _a = projections(selCmpt), x = _a.x, y = _a.y;
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
                { field: { group: 'height' } }),
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBNEM7QUFDNUMsaUNBQStCO0FBQy9CLG1DQUErQztBQUUvQyx5Q0FBZ0g7QUFDaEgsOENBQXlDO0FBRTVCLFFBQUEsS0FBSyxHQUFHLFFBQVEsRUFDM0IsUUFBQSxJQUFJLEdBQUcsT0FBTyxDQUFDO0FBRWpCLElBQU0sUUFBUSxHQUFxQjtJQUNqQyxTQUFTLEVBQUUsWUFBWTtJQUV2QixPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUM5QixJQUFNLE9BQU8sR0FBVSxFQUFFLEVBQ3JCLFNBQVMsR0FBUyxFQUFFLEVBQ3BCLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxFQUNuQixJQUFJLEdBQUcsSUFBSSxHQUFHLFlBQUksQ0FBQztRQUV2QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQVMsQ0FBUSxFQUFFLEdBQVE7Z0JBQ3pDLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3RFLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDO3FCQUMzQyw4QkFBNEIsa0JBQVcsQ0FBQyxJQUFJLEdBQUcsYUFBSyxDQUFDLE1BQUcsQ0FBQSxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssV0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEtBQUssV0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsVUFBSSxDQUFDLDZEQUE2RCxDQUFDLENBQUM7Z0JBQ3BFLE1BQU0sQ0FBQztZQUNULENBQUM7WUFFRCxJQUFNLEVBQUUsR0FBRyxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckQsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLGFBQVcsa0JBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFhLEVBQUUsQ0FBQyxJQUFJLE1BQUcsQ0FBQyxDQUFDO1FBQ3pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNYLElBQUksRUFBRSxJQUFJO1lBQ1YsS0FBSyxFQUFFLEVBQUU7WUFDVCxFQUFFLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFTLEVBQVMsRUFBRSxHQUFRO2dCQUM5QyxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUNOLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsTUFBTSxFQUFFLCtDQUErQztpQkFDeEQsQ0FBQyxDQUFDO2dCQUVILEVBQUUsQ0FBQyxJQUFJLENBQUM7b0JBQ04sTUFBTSxFQUFFLEdBQUc7b0JBQ1gsTUFBTSxFQUFFLFNBQU8sSUFBSSxlQUFVLElBQUksU0FBTTt5QkFDdEMsMEJBQXdCLElBQUksbUNBQThCLElBQUksU0FBTSxDQUFBO2lCQUN0RSxDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNaLENBQUMsQ0FBQztTQUNILEVBQUU7WUFDRCxJQUFJLEVBQUUsSUFBSTtZQUNWLE1BQU0sRUFBRSxNQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUc7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU87UUFDaEMsTUFBTSxDQUFDLGdCQUFjLE9BQU8sQ0FBQyxJQUFNLENBQUM7SUFDdEMsQ0FBQztJQUVELFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ2pDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsaUJBQUssQ0FBQztRQUNqQyxNQUFNLENBQUksR0FBRyxpQkFBWSxHQUFHLFdBQVEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLO1FBQzdCLElBQUEsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQ3JCLHlCQUE2QixFQUE1QixRQUFDLEVBQUUsUUFBQyxDQUF5QjtRQUVsQyxpREFBaUQ7UUFDakQsRUFBRSxDQUFDLENBQUMsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsSUFBTSxNQUFNLEdBQUc7WUFDYixDQUFDLEVBQUUsYUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSTtnQkFDdEIsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsRUFBRSxNQUFNLEVBQUssSUFBSSxTQUFJLENBQUMsZ0JBQWEsRUFBQztnQkFDOUQsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUM7WUFFYixFQUFFLEVBQUUsYUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSTtnQkFDdkIsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsRUFBRSxNQUFNLEVBQUssSUFBSSxTQUFJLENBQUMsZ0JBQWEsRUFBQztnQkFDOUQsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUMsQ0FBQztZQUU1QixDQUFDLEVBQUUsYUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSTtnQkFDdEIsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsRUFBRSxNQUFNLEVBQUssSUFBSSxTQUFJLENBQUMsZ0JBQWEsRUFBQztnQkFDOUQsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUM7WUFFYixFQUFFLEVBQUUsYUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssSUFBSTtnQkFDdkIsRUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFDLENBQUMsRUFBRSxNQUFNLEVBQUssSUFBSSxTQUFJLENBQUMsZ0JBQWEsRUFBQztnQkFDOUQsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLEVBQUMsQ0FBQztTQUM5QixDQUFDO1FBRUYsTUFBTSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTSxFQUFFO29CQUNOLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsRUFBQztvQkFDOUIsTUFBTSxFQUFFLE1BQU07aUJBQ2Y7YUFDRixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtZQUNmLElBQUksRUFBRSxJQUFJLEdBQUcsYUFBSztZQUNsQixJQUFJLEVBQUUsTUFBTTtZQUNaLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsYUFBYSxFQUFDLEVBQUM7Z0JBQ3JDLE1BQU0sRUFBRSxNQUFNO2FBQ2Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQztBQUNrQiwyQkFBTztBQUUzQixxQkFBNEIsT0FBMkI7SUFDckQsSUFBSSxDQUFDLEdBQVUsSUFBSSxFQUFFLENBQUMsR0FBVSxJQUFJLENBQUM7SUFDckMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLFdBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNSLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxXQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDUixDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztBQUN0QixDQUFDO0FBVkQsa0NBVUM7QUFFRCx1QkFBdUIsS0FBZ0IsRUFBRSxPQUEyQixFQUFFLE9BQWdCO0lBQ3BGLElBQU0sSUFBSSxHQUFJLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFDN0MsSUFBSSxHQUFJLENBQUMsT0FBTyxLQUFLLFdBQUMsR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDLEVBQzVDLEtBQUssR0FBTSxPQUFPLFdBQVEsRUFDMUIsTUFBTSxHQUFHLGtCQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTFELE1BQU0sQ0FBQztRQUNMLElBQUksRUFBRSxJQUFJO1FBQ1YsS0FBSyxFQUFFLEVBQUU7UUFDVCxFQUFFLEVBQUUsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBUyxFQUFTLEVBQUUsR0FBUTtZQUN6RSxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNOLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFJLEtBQUssVUFBSyxLQUFLLE1BQUcsQ0FBQzthQUN2QyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNOLE1BQU0sRUFBRSxHQUFHO2dCQUNYLE1BQU0sRUFBRSxNQUFJLElBQUksVUFBTyxHQUFHLE1BQU0sQ0FBQyxXQUFTLEtBQUssYUFBUSxJQUFJLE1BQUcsQ0FBQyxHQUFHLEdBQUc7YUFDdEUsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUMsQ0FBQztLQUNILENBQUM7QUFDSixDQUFDO0FBRUQsZ0JBQWdCLE9BQTJCLEVBQUUsRUFBWTtJQUN2RCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBUyxFQUFTLEVBQUUsR0FBUTtRQUN2RCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLFVBQUksQ0FBSSxHQUFHLDREQUF5RCxDQUFDLENBQUM7WUFDdEUsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNyQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDIn0=