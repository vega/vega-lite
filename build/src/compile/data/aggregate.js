"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var util_1 = require("../../util");
var common_1 = require("../common");
var dataflow_1 = require("./dataflow");
function addDimension(dims, channel, fieldDef) {
    if (fieldDef.bin) {
        dims[fielddef_1.vgField(fieldDef, {})] = true;
        dims[fielddef_1.vgField(fieldDef, { binSuffix: 'end' })] = true;
        if (common_1.binRequiresRange(fieldDef, channel)) {
            dims[fielddef_1.vgField(fieldDef, { binSuffix: 'range' })] = true;
        }
    }
    else {
        dims[fielddef_1.vgField(fieldDef)] = true;
    }
    return dims;
}
function mergeMeasures(parentMeasures, childMeasures) {
    for (var f in childMeasures) {
        if (childMeasures.hasOwnProperty(f)) {
            // when we merge a measure, we either have to add an aggregation operator or even a new field
            var ops = childMeasures[f];
            for (var op in ops) {
                if (ops.hasOwnProperty(op)) {
                    if (f in parentMeasures) {
                        // add operator to existing measure field
                        parentMeasures[f][op] = ops[op];
                    }
                    else {
                        parentMeasures[f] = { op: ops[op] };
                    }
                }
            }
        }
    }
}
var AggregateNode = /** @class */ (function (_super) {
    tslib_1.__extends(AggregateNode, _super);
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict of aggregation functions and names to use
     */
    function AggregateNode(parent, dimensions, measures) {
        var _this = _super.call(this, parent) || this;
        _this.dimensions = dimensions;
        _this.measures = measures;
        return _this;
    }
    AggregateNode.prototype.clone = function () {
        return new AggregateNode(null, tslib_1.__assign({}, this.dimensions), util_1.duplicate(this.measures));
    };
    AggregateNode.makeFromEncoding = function (parent, model) {
        var isAggregate = false;
        model.forEachFieldDef(function (fd) {
            if (fd.aggregate) {
                isAggregate = true;
            }
        });
        var meas = {};
        var dims = {};
        if (!isAggregate) {
            // no need to create this node if the model has no aggregation
            return null;
        }
        model.forEachFieldDef(function (fieldDef, channel) {
            if (fieldDef.aggregate) {
                if (fieldDef.aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = fielddef_1.vgField(fieldDef, { aggregate: 'count' });
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = fielddef_1.vgField(fieldDef);
                    // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
                    if (channel_1.isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
                        meas[fieldDef.field]['min'] = fielddef_1.vgField(fieldDef, { aggregate: 'min' });
                        meas[fieldDef.field]['max'] = fielddef_1.vgField(fieldDef, { aggregate: 'max' });
                    }
                }
            }
            else {
                addDimension(dims, channel, fieldDef);
            }
        });
        if ((util_1.keys(dims).length + util_1.keys(meas).length) === 0) {
            return null;
        }
        return new AggregateNode(parent, dims, meas);
    };
    AggregateNode.makeFromTransform = function (parent, t) {
        var dims = {};
        var meas = {};
        for (var _i = 0, _a = t.aggregate; _i < _a.length; _i++) {
            var s = _a[_i];
            if (s.op) {
                if (s.op === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = s.as || fielddef_1.vgField(s);
                }
                else {
                    meas[s.field] = meas[s.field] || {};
                    meas[s.field][s.op] = s.as || fielddef_1.vgField(s);
                }
            }
        }
        for (var _b = 0, _c = t.groupby || []; _b < _c.length; _b++) {
            var s = _c[_b];
            dims[s] = true;
        }
        if ((util_1.keys(dims).length + util_1.keys(meas).length) === 0) {
            return null;
        }
        return new AggregateNode(parent, dims, meas);
    };
    AggregateNode.prototype.merge = function (other) {
        if (!util_1.differ(this.dimensions, other.dimensions)) {
            mergeMeasures(this.measures, other.measures);
            other.remove();
        }
        else {
            log.debug('different dimensions, cannot merge');
        }
    };
    AggregateNode.prototype.addDimensions = function (fields) {
        var _this = this;
        fields.forEach(function (f) { return _this.dimensions[f] = true; });
    };
    AggregateNode.prototype.dependentFields = function () {
        var out = {};
        util_1.keys(this.dimensions).forEach(function (f) { return out[f] = true; });
        util_1.keys(this.measures).forEach(function (m) { return out[m] = true; });
        return out;
    };
    AggregateNode.prototype.producedFields = function () {
        var _this = this;
        var out = {};
        util_1.keys(this.measures).forEach(function (field) {
            util_1.keys(_this.measures[field]).forEach(function (op) {
                out[op + "_" + field] = true;
            });
        });
        return out;
    };
    AggregateNode.prototype.assemble = function () {
        var ops = [];
        var fields = [];
        var as = [];
        for (var _i = 0, _a = util_1.keys(this.measures); _i < _a.length; _i++) {
            var field = _a[_i];
            for (var _b = 0, _c = util_1.keys(this.measures[field]); _b < _c.length; _b++) {
                var op = _c[_b];
                as.push(this.measures[field][op]);
                ops.push(op);
                fields.push(field);
            }
        }
        var result = {
            type: 'aggregate',
            groupby: util_1.keys(this.dimensions),
            ops: ops,
            fields: fields,
            as: as
        };
        return result;
    };
    return AggregateNode;
}(dataflow_1.DataFlowNode));
exports.AggregateNode = AggregateNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEseUNBQXNEO0FBQ3RELDJDQUFpRDtBQUNqRCwrQkFBaUM7QUFFakMsbUNBQW9FO0FBRXBFLG9DQUEyQztBQUUzQyx1Q0FBd0M7QUFFeEMsc0JBQXNCLElBQWdDLEVBQUUsT0FBZ0IsRUFBRSxRQUEwQjtJQUNsRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7UUFDaEIsSUFBSSxDQUFDLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRW5ELElBQUkseUJBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3REO0tBQ0Y7U0FBTTtRQUNMLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ2hDO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsdUJBQXVCLGNBQWtDLEVBQUUsYUFBaUM7SUFDMUYsS0FBSyxJQUFNLENBQUMsSUFBSSxhQUFhLEVBQUU7UUFDN0IsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25DLDZGQUE2RjtZQUM3RixJQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsS0FBSyxJQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUU7Z0JBQ3BCLElBQUksR0FB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QyxLQUFLLENBQUMsQ0FBQzthQUNwQjtTQUNGO1FBRUQsSUFBTSxNQUFNLEdBQXlCO1lBQ25DLElBQUksRUFBRSxXQUFXO1lBQ2pCLE9BQU8sRUFBRSxXQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM5QixHQUFHLEtBQUE7WUFDSCxNQUFNLFFBQUE7WUFDTixFQUFFLElBQUE7U0FDSCxDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTVJRCxDQUFtQyx1QkFBWSxHQTRJOUM7QUE1SVksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcblxuaW1wb3J0IHtDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7QWdncmVnYXRlVHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtEaWN0LCBkaWZmZXIsIGR1cGxpY2F0ZSwga2V5cywgU3RyaW5nU2V0fSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdBZ2dyZWdhdGVUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YmluUmVxdWlyZXNSYW5nZX0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLy4uL3VuaXQnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5mdW5jdGlvbiBhZGREaW1lbnNpb24oZGltczoge1tmaWVsZDogc3RyaW5nXTogYm9vbGVhbn0sIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KSB7XG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICBkaW1zW3ZnRmllbGQoZmllbGREZWYsIHt9KV0gPSB0cnVlO1xuICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ2VuZCd9KV0gPSB0cnVlO1xuXG4gICAgaWYgKGJpblJlcXVpcmVzUmFuZ2UoZmllbGREZWYsIGNoYW5uZWwpKSB7XG4gICAgICBkaW1zW3ZnRmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdyYW5nZSd9KV0gPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBkaW1zW3ZnRmllbGQoZmllbGREZWYpXSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGRpbXM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlTWVhc3VyZXMocGFyZW50TWVhc3VyZXM6IERpY3Q8RGljdDxzdHJpbmc+PiwgY2hpbGRNZWFzdXJlczogRGljdDxEaWN0PHN0cmluZz4+KSB7XG4gIGZvciAoY29uc3QgZiBpbiBjaGlsZE1lYXN1cmVzKSB7XG4gICAgaWYgKGNoaWxkTWVhc3VyZXMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgIC8vIHdoZW4gd2UgbWVyZ2UgYSBtZWFzdXJlLCB3ZSBlaXRoZXIgaGF2ZSB0byBhZGQgYW4gYWdncmVnYXRpb24gb3BlcmF0b3Igb3IgZXZlbiBhIG5ldyBmaWVsZFxuICAgICAgY29uc3Qgb3BzID0gY2hpbGRNZWFzdXJlc1tmXTtcbiAgICAgIGZvciAoY29uc3Qgb3AgaW4gb3BzKSB7XG4gICAgICAgIGlmIChvcHMuaGFzT3duUHJvcGVydHkob3ApKSB7XG4gICAgICAgICAgaWYgKGYgaW4gcGFyZW50TWVhc3VyZXMpIHtcbiAgICAgICAgICAgIC8vIGFkZCBvcGVyYXRvciB0byBleGlzdGluZyBtZWFzdXJlIGZpZWxkXG4gICAgICAgICAgICBwYXJlbnRNZWFzdXJlc1tmXVtvcF0gPSBvcHNbb3BdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnRNZWFzdXJlc1tmXSA9IHtvcDogb3BzW29wXX07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBZ2dyZWdhdGVOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgQWdncmVnYXRlTm9kZShudWxsLCB7Li4udGhpcy5kaW1lbnNpb25zfSwgZHVwbGljYXRlKHRoaXMubWVhc3VyZXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gZGltZW5zaW9ucyBzdHJpbmcgc2V0IGZvciBkaW1lbnNpb25zXG4gICAqIEBwYXJhbSBtZWFzdXJlcyBkaWN0aW9uYXJ5IG1hcHBpbmcgZmllbGQgbmFtZSA9PiBkaWN0IG9mIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9ucyBhbmQgbmFtZXMgdG8gdXNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHJpdmF0ZSBkaW1lbnNpb25zOiBTdHJpbmdTZXQsIHByaXZhdGUgbWVhc3VyZXM6IERpY3Q8e1trZXkgaW4gQWdncmVnYXRlT3BdPzogc3RyaW5nfT4pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbUVuY29kaW5nKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogVW5pdE1vZGVsKTogQWdncmVnYXRlTm9kZSB7XG4gICAgbGV0IGlzQWdncmVnYXRlID0gZmFsc2U7XG4gICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKGZkID0+IHtcbiAgICAgIGlmIChmZC5hZ2dyZWdhdGUpIHtcbiAgICAgICAgaXNBZ2dyZWdhdGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgbWVhcyA9IHt9O1xuICAgIGNvbnN0IGRpbXMgPSB7fTtcblxuICAgIGlmICghaXNBZ2dyZWdhdGUpIHtcbiAgICAgIC8vIG5vIG5lZWQgdG8gY3JlYXRlIHRoaXMgbm9kZSBpZiB0aGUgbW9kZWwgaGFzIG5vIGFnZ3JlZ2F0aW9uXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBtb2RlbC5mb3JFYWNoRmllbGREZWYoKGZpZWxkRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgICBpZiAoZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICBtZWFzWycqJ10gPSBtZWFzWycqJ10gfHwge307XG4gICAgICAgICAgbWVhc1snKiddWydjb3VudCddID0gdmdGaWVsZChmaWVsZERlZiwge2FnZ3JlZ2F0ZTogJ2NvdW50J30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdID0gbWVhc1tmaWVsZERlZi5maWVsZF0gfHwge307XG4gICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF1bZmllbGREZWYuYWdncmVnYXRlXSA9IHZnRmllbGQoZmllbGREZWYpO1xuXG4gICAgICAgICAgLy8gRm9yIHNjYWxlIGNoYW5uZWwgd2l0aCBkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnLCBhZGQgbWluL21heCBzbyB3ZSBjYW4gdXNlIHRoZWlyIHVuaW9uIGFzIHVuYWdncmVnYXRlZCBkb21haW5cbiAgICAgICAgICBpZiAoaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgbW9kZWwuc2NhbGVEb21haW4oY2hhbm5lbCkgPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXVsnbWluJ10gPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7YWdncmVnYXRlOiAnbWluJ30pO1xuICAgICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF1bJ21heCddID0gdmdGaWVsZChmaWVsZERlZiwge2FnZ3JlZ2F0ZTogJ21heCd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZERpbWVuc2lvbihkaW1zLCBjaGFubmVsLCBmaWVsZERlZik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoKGtleXMoZGltcykubGVuZ3RoICsga2V5cyhtZWFzKS5sZW5ndGgpID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEFnZ3JlZ2F0ZU5vZGUocGFyZW50LCBkaW1zLCBtZWFzKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50OiBEYXRhRmxvd05vZGUsIHQ6IEFnZ3JlZ2F0ZVRyYW5zZm9ybSk6IEFnZ3JlZ2F0ZU5vZGUge1xuICAgIGNvbnN0IGRpbXMgPSB7fTtcbiAgICBjb25zdCBtZWFzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHMgb2YgdC5hZ2dyZWdhdGUpIHtcbiAgICAgIGlmIChzLm9wKSB7XG4gICAgICAgIGlmIChzLm9wID09PSAnY291bnQnKSB7XG4gICAgICAgICAgbWVhc1snKiddID0gbWVhc1snKiddIHx8IHt9O1xuICAgICAgICAgIG1lYXNbJyonXVsnY291bnQnXSA9IHMuYXMgfHwgdmdGaWVsZChzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZWFzW3MuZmllbGRdID0gbWVhc1tzLmZpZWxkXSB8fCB7fTtcbiAgICAgICAgICBtZWFzW3MuZmllbGRdW3Mub3BdID0gcy5hcyB8fCB2Z0ZpZWxkKHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBzIG9mIHQuZ3JvdXBieSB8fCBbXSkge1xuICAgICAgZGltc1tzXSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKChrZXlzKGRpbXMpLmxlbmd0aCArIGtleXMobWVhcykubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKHBhcmVudCwgZGltcywgbWVhcyk7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IEFnZ3JlZ2F0ZU5vZGUpIHtcbiAgICBpZiAoIWRpZmZlcih0aGlzLmRpbWVuc2lvbnMsIG90aGVyLmRpbWVuc2lvbnMpKSB7XG4gICAgICBtZXJnZU1lYXN1cmVzKHRoaXMubWVhc3VyZXMsIG90aGVyLm1lYXN1cmVzKTtcbiAgICAgIG90aGVyLnJlbW92ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cuZGVidWcoJ2RpZmZlcmVudCBkaW1lbnNpb25zLCBjYW5ub3QgbWVyZ2UnKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkRGltZW5zaW9ucyhmaWVsZHM6IHN0cmluZ1tdKSB7XG4gICAgZmllbGRzLmZvckVhY2goZiA9PiB0aGlzLmRpbWVuc2lvbnNbZl0gPSB0cnVlKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBrZXlzKHRoaXMuZGltZW5zaW9ucykuZm9yRWFjaChmID0+IG91dFtmXSA9IHRydWUpO1xuICAgIGtleXModGhpcy5tZWFzdXJlcykuZm9yRWFjaChtID0+IG91dFttXSA9IHRydWUpO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIGtleXModGhpcy5tZWFzdXJlcykuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICBrZXlzKHRoaXMubWVhc3VyZXNbZmllbGRdKS5mb3JFYWNoKG9wID0+IHtcbiAgICAgICAgb3V0W2Ake29wfV8ke2ZpZWxkfWBdID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybSB7XG4gICAgY29uc3Qgb3BzOiBBZ2dyZWdhdGVPcFtdID0gW107XG4gICAgY29uc3QgZmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IGFzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKHRoaXMubWVhc3VyZXMpKSB7XG4gICAgICBmb3IgKGNvbnN0IG9wIG9mIGtleXModGhpcy5tZWFzdXJlc1tmaWVsZF0pKSB7XG4gICAgICAgIGFzLnB1c2godGhpcy5tZWFzdXJlc1tmaWVsZF1bb3BdKTtcbiAgICAgICAgb3BzLnB1c2gob3ApO1xuICAgICAgICBmaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0OiBWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybSA9IHtcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieToga2V5cyh0aGlzLmRpbWVuc2lvbnMpLFxuICAgICAgb3BzLFxuICAgICAgZmllbGRzLFxuICAgICAgYXNcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19