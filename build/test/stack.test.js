"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var log = require("../src/log");
var mark_1 = require("../src/mark");
var scale_1 = require("../src/scale");
var spec_1 = require("../src/spec");
var stack_1 = require("../src/stack");
var util_1 = require("../src/util");
describe('stack', function () {
    var NON_STACKABLE_MARKS = [mark_1.RECT];
    it('should be disabled for non-stackable marks with at least of of the stack channel', function () {
        var _loop_1 = function (stacked) {
            NON_STACKABLE_MARKS.forEach(function (nonStackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": nonStackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_1(stacked);
        }
    });
    it('should be allowed for raw plot', function () {
        stack_1.STACKABLE_MARKS.forEach(function (mark) {
            var spec = {
                "data": { "url": "data/barley.json" },
                "mark": mark,
                "encoding": {
                    "x": { "field": "yield", "type": "quantitative", "stack": "zero" },
                    "y": { "field": "variety", "type": "nominal" },
                    "color": { "field": "site", "type": "nominal" }
                }
            };
            var stackProps = stack_1.stack(spec.mark, spec.encoding, undefined);
            chai_1.assert.equal(stackProps.fieldChannel, 'x');
            chai_1.assert.isTrue(spec_1.isStacked(spec));
        });
    });
    it('should prioritize axis with stack', function () {
        stack_1.STACKABLE_MARKS.forEach(function (mark) {
            var spec = {
                "data": { "url": "data/barley.json" },
                "mark": mark,
                "encoding": {
                    "x": { "field": "yield", "type": "quantitative", "stack": "zero" },
                    "y": { "field": "variety", "type": "quantitative" },
                    "color": { "field": "site", "type": "nominal" }
                }
            };
            var stackProps = stack_1.stack(spec.mark, spec.encoding, undefined);
            chai_1.assert.equal(stackProps.fieldChannel, 'x');
            chai_1.assert.isTrue(spec_1.isStacked(spec));
        });
    });
    it('should always be disabled if there is no stackby channel', function () {
        var _loop_2 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_2(stacked);
        }
    });
    it('should always be disabled if the stackby channel is aggregated', function () {
        var _loop_3 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "aggregate": "count", "type": "quantitative" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_3(stacked);
        }
    });
    it('should always be disabled if the stackby channel is identical to y', function () {
        var _loop_4 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "variety", "type": "nominal" },
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_4(stacked);
        }
    });
    it('can enabled if one of the stackby channels is not aggregated', function () {
        var _loop_5 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "aggregate": "count", "type": "quantitative" },
                        "detail": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, spec.config.stack);
                chai_1.assert.isOk(_stack);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
                chai_1.assert.equal(_stack.stackBy[0].channel, channel_1.DETAIL);
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_5(stacked);
        }
    });
    it('can enabled if one of the stackby channels is not aggregated', function () {
        var _loop_6 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative", "stack": stacked },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "aggregate": "count", "type": "quantitative" },
                        "detail": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.isOk(_stack);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
                chai_1.assert.equal(_stack.stackBy[0].channel, channel_1.DETAIL);
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_6(stacked);
        }
    });
    it('should always be disabled if both x and y are aggregate', function () {
        var _loop_7 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "aggregate": "count", "type": "quantitative" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_7(stacked);
        }
    });
    it('should always be disabled if neither x nor y is aggregate or stack', function () {
        var _loop_8 = function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "field": "variety", "type": "nominal" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_8(stacked);
        }
    });
    it('should always be disabled if there is both x and x2', log.wrap(function (localLogger) {
        var _loop_9 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "mark": mark,
                    "encoding": {
                        "x": { "field": "a", "type": "quantitative", "aggregate": "sum" },
                        "x2": { "field": "a", "type": "quantitative", "aggregate": "sum" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
                var warns = localLogger.warns;
                chai_1.assert.equal(warns[warns.length - 1], log.message.cannotStackRangedMark(channel_1.X), util_1.stringify({ stacked: stacked, mark: mark }));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_9(stacked);
        }
    }));
    it('should always be disabled if there is both y and y2', log.wrap(function (localLogger) {
        var _loop_10 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "mark": mark,
                    "encoding": {
                        "y": { "field": "a", "type": "quantitative", "aggregate": "sum" },
                        "y2": { "field": "a", "type": "quantitative", "aggregate": "sum" },
                        "x": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
                var warns = localLogger.warns;
                chai_1.assert.equal(warns[warns.length - 1], log.message.cannotStackRangedMark(channel_1.Y), util_1.stringify({ stacked: stacked, mark: mark }));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_10(stacked);
        }
    }));
    it('should always be disabled if the aggregated axis has non-linear scale', log.wrap(function (localLogger) {
        var _loop_11 = function (stacked) {
            [scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT].forEach(function (scaleType) {
                var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
                marks.forEach(function (mark) {
                    var spec = {
                        "data": { "url": "data/barley.json" },
                        "mark": mark,
                        "encoding": {
                            "x": { "field": "a", "type": "quantitative", "aggregate": "sum", "scale": { "type": scaleType } },
                            "y": { "field": "variety", "type": "nominal" },
                            "color": { "field": "site", "type": "nominal" }
                        },
                        "config": {
                            "stack": stacked
                        }
                    };
                    chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                    chai_1.assert.isFalse(spec_1.isStacked(spec));
                    var warns = localLogger.warns;
                    chai_1.assert.equal(warns[warns.length - 1], log.message.cannotStackNonLinearScale(scaleType));
                });
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_11(stacked);
        }
    }));
    it('should throws warning if the aggregated axis has a non-summative aggregate', log.wrap(function (localLogger) {
        var _loop_12 = function (stackOffset) {
            var _loop_13 = function (aggregate) {
                var marks = stackOffset === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
                marks.forEach(function (mark) {
                    var spec = {
                        "data": { "url": "data/barley.json" },
                        "mark": mark,
                        "encoding": {
                            "x": {
                                aggregate: aggregate,
                                stack: stackOffset,
                                "field": "a",
                                "type": "quantitative"
                            },
                            "y": { "field": "variety", "type": "nominal" },
                            "color": { "field": "site", "type": "nominal" }
                        }
                    };
                    chai_1.assert.isTrue(spec_1.isStacked(spec));
                    var warns = localLogger.warns;
                    chai_1.assert.equal(warns[warns.length - 1], log.message.stackNonSummativeAggregate(aggregate));
                });
            };
            for (var _i = 0, _a = ['average', 'variance', 'q3']; _i < _a.length; _i++) {
                var aggregate = _a[_i];
                _loop_13(aggregate);
            }
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stackOffset = _a[_i];
            _loop_12(stackOffset);
        }
    }));
    describe('stack().groupbyChannel, .fieldChannel', function () {
        it('should be correct for horizontal', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.equal(_stack.fieldChannel, channel_1.X);
                chai_1.assert.equal(_stack.groupbyChannel, channel_1.Y);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
        it('should be correct for horizontal (single)', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.equal(_stack.fieldChannel, channel_1.X);
                chai_1.assert.equal(_stack.groupbyChannel, null);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
        it('should be correct for vertical', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "y": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "x": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.equal(_stack.fieldChannel, channel_1.Y);
                chai_1.assert.equal(_stack.groupbyChannel, channel_1.X);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
        it('should be correct for vertical (single)', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "y": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.equal(_stack.fieldChannel, channel_1.Y);
                chai_1.assert.equal(_stack.groupbyChannel, null);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
    });
    describe('stack().offset', function () {
        it('should be zero for stackable marks with at least of of the stack channel if stacked is unspecified', function () {
            [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                chai_1.assert.equal(stack_1.stack(spec.mark, spec.encoding, undefined).offset, 'zero');
                chai_1.assert.isTrue(spec_1.isStacked(spec));
            });
        });
        it('should be the specified stacked for stackable marks with at least one of the stack channel', function () {
            var _loop_14 = function (stacked) {
                [mark_1.BAR, mark_1.AREA].forEach(function (stackableMark) {
                    var spec = {
                        "data": { "url": "data/barley.json" },
                        "mark": stackableMark,
                        "encoding": {
                            "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                            "y": { "field": "variety", "type": "nominal" },
                            "color": { "field": "site", "type": "nominal" }
                        },
                        "config": {
                            "stack": stacked
                        }
                    };
                    chai_1.assert.equal(stack_1.stack(spec.mark, spec.encoding, spec.config.stack).offset, stacked);
                    chai_1.assert.equal(spec_1.isStacked(spec), true);
                });
            };
            for (var _i = 0, _a = ['center', 'zero', 'normalize']; _i < _a.length; _i++) {
                var stacked = _a[_i];
                _loop_14(stacked);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhCQUE4QjtBQUM5Qiw2QkFBNEI7QUFHNUIsMENBQTRDO0FBQzVDLGdDQUFrQztBQUNsQyxvQ0FBNkQ7QUFDN0Qsc0NBQXVDO0FBQ3ZDLG9DQUFvRTtBQUNwRSxzQ0FBeUY7QUFDekYsb0NBQXNDO0FBR3RDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7SUFDaEIsSUFBTSxtQkFBbUIsR0FBRyxDQUFDLFdBQUksQ0FBQyxDQUFDO0lBRW5DLEVBQUUsQ0FBQyxrRkFBa0YsRUFBRTtnQ0FDMUUsT0FBTztZQUNoQixtQkFBbUIsQ0FBQyxPQUFPLENBQUMsVUFBQyxnQkFBZ0I7Z0JBQzNDLElBQU0sSUFBSSxHQUFpQztvQkFDekMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO29CQUNuQyxNQUFNLEVBQUUsZ0JBQWdCO29CQUN4QixVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7d0JBQ25FLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQzt3QkFDNUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3FCQUM5QztvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsT0FBTyxFQUFFLE9BQU87cUJBQ2pCO2lCQUNGLENBQUM7Z0JBQ0YsYUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsYUFBTSxDQUFDLE9BQU8sQ0FBQyxn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QWtCLEVBQUM7d0JBQ25DLE1BQU0sRUFBRSxhQUFhO3dCQUNyQixVQUFVLEVBQUU7NEJBQ1YsR0FBRyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7NEJBQ25FLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQzs0QkFDNUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3lCQUM5Qzt3QkFDRCxRQUFRLEVBQUU7NEJBQ1IsT0FBTyxFQUFFLE9BQU87eUJBQ2pCO3FCQUNGLENBQUM7b0JBQ0YsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNqRixhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQWpCRCxHQUFHLENBQUMsQ0FBa0IsVUFBZ0QsRUFBaEQsS0FBQSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFrQixFQUFoRCxjQUFnRCxFQUFoRCxJQUFnRDtnQkFBakUsSUFBTSxPQUFPLFNBQUE7eUJBQVAsT0FBTzthQWlCakI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJ3ZlZ2EnO1xuXG5pbXBvcnQge0RFVEFJTCwgWCwgWX0gZnJvbSAnLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uL3NyYy9sb2cnO1xuaW1wb3J0IHtBUkVBLCBCQVIsIFBSSU1JVElWRV9NQVJLUywgUkVDVH0gZnJvbSAnLi4vc3JjL21hcmsnO1xuaW1wb3J0IHtTY2FsZVR5cGV9IGZyb20gJy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge2lzU3RhY2tlZCwgTm9ybWFsaXplZFVuaXRTcGVjLCBUb3BMZXZlbH0gZnJvbSAnLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHtzdGFjaywgU1RBQ0tfQllfREVGQVVMVF9NQVJLUywgU1RBQ0tBQkxFX01BUktTLCBTdGFja09mZnNldH0gZnJvbSAnLi4vc3JjL3N0YWNrJztcbmltcG9ydCB7c3RyaW5naWZ5fSBmcm9tICcuLi9zcmMvdXRpbCc7XG5cblxuZGVzY3JpYmUoJ3N0YWNrJywgKCkgPT4ge1xuICBjb25zdCBOT05fU1RBQ0tBQkxFX01BUktTID0gW1JFQ1RdO1xuXG4gIGl0KCdzaG91bGQgYmUgZGlzYWJsZWQgZm9yIG5vbi1zdGFja2FibGUgbWFya3Mgd2l0aCBhdCBsZWFzdCBvZiBvZiB0aGUgc3RhY2sgY2hhbm5lbCcsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZScsIG51bGwsICdub25lJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgTk9OX1NUQUNLQUJMRV9NQVJLUy5mb3JFYWNoKChub25TdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG5vblN0YWNrYWJsZU1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5pc051bGwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjaykpO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnc2hvdWxkIGJlIGFsbG93ZWQgZm9yIHJhdyBwbG90JywgKCkgPT4ge1xuICAgIFNUQUNLQUJMRV9NQVJLUy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IFwiemVyb1wifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc3RhY2tQcm9wcyA9IHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5lcXVhbChzdGFja1Byb3BzLmZpZWxkQ2hhbm5lbCwgJ3gnKTtcbiAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICB9KTtcbiAgfSk7XG5cblxuICBpdCgnc2hvdWxkIHByaW9yaXRpemUgYXhpcyB3aXRoIHN0YWNrJywgKCkgPT4ge1xuICAgIFNUQUNLQUJMRV9NQVJLUy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IFwiemVyb1wifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBzdGFja1Byb3BzID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHN0YWNrUHJvcHMuZmllbGRDaGFubmVsLCAneCcpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBpZiB0aGVyZSBpcyBubyBzdGFja2J5IGNoYW5uZWwnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnLCBudWxsLCAnbm9uZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIFBSSU1JVElWRV9NQVJLUy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIGRpc2FibGVkIGlmIHRoZSBzdGFja2J5IGNoYW5uZWwgaXMgYWdncmVnYXRlZCcsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZScsIG51bGwsICdub25lJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgUFJJTUlUSVZFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiYWdncmVnYXRlXCI6IFwiY291bnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5pc051bGwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjaykpO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBpZiB0aGUgc3RhY2tieSBjaGFubmVsIGlzIGlkZW50aWNhbCB0byB5JywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJywgbnVsbCwgJ25vbmUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBQUklNSVRJVkVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdjYW4gZW5hYmxlZCBpZiBvbmUgb2YgdGhlIHN0YWNrYnkgY2hhbm5lbHMgaXMgbm90IGFnZ3JlZ2F0ZWQnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBjb25zdCBtYXJrcyA9IHN0YWNrZWQgPT09IHVuZGVmaW5lZCA/IFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MgOiBTVEFDS0FCTEVfTUFSS1M7XG4gICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcImNvdW50XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwiZGV0YWlsXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IF9zdGFjayA9IHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spO1xuICAgICAgICBhc3NlcnQuaXNPayhfc3RhY2spO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suc3RhY2tCeVswXS5jaGFubmVsLCBERVRBSUwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnY2FuIGVuYWJsZWQgaWYgb25lIG9mIHRoZSBzdGFja2J5IGNoYW5uZWxzIGlzIG5vdCBhZ2dyZWdhdGVkJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgY29uc3QgbWFya3MgPSBzdGFja2VkID09PSB1bmRlZmluZWQgPyBTVEFDS19CWV9ERUZBVUxUX01BUktTIDogU1RBQ0tBQkxFX01BUktTO1xuICAgICAgbWFya3MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic3RhY2tcIjogc3RhY2tlZH0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcImNvdW50XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwiZGV0YWlsXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IF9zdGFjayA9IHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0LmlzT2soX3N0YWNrKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLnN0YWNrQnlbMF0uY2hhbm5lbCwgREVUQUlMKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgYm90aCB4IGFuZCB5IGFyZSBhZ2dyZWdhdGUnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnLCBudWxsLCAnbm9uZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIFBSSU1JVElWRV9NQVJLUy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwiY291bnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgbmVpdGhlciB4IG5vciB5IGlzIGFnZ3JlZ2F0ZSBvciBzdGFjaycsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZScsIG51bGwsICdub25lJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgUFJJTUlUSVZFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIGRpc2FibGVkIGlmIHRoZXJlIGlzIGJvdGggeCBhbmQgeDInLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIGNvbnN0IG1hcmtzID0gc3RhY2tlZCA9PT0gdW5kZWZpbmVkID8gU1RBQ0tfQllfREVGQVVMVF9NQVJLUyA6IFNUQUNLQUJMRV9NQVJLUztcbiAgICAgIG1hcmtzLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgXCJ4MlwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgY29uc3Qgd2FybnMgPSBsb2NhbExvZ2dlci53YXJucztcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHdhcm5zW3dhcm5zLmxlbmd0aC0xXSwgbG9nLm1lc3NhZ2UuY2Fubm90U3RhY2tSYW5nZWRNYXJrKFgpLFxuICAgICAgICAgIHN0cmluZ2lmeSh7c3RhY2tlZDogc3RhY2tlZCwgbWFyazogbWFya30pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pKTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBpZiB0aGVyZSBpcyBib3RoIHkgYW5kIHkyJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBjb25zdCBtYXJrcyA9IHN0YWNrZWQgPT09IHVuZGVmaW5lZCA/IFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MgOiBTVEFDS0FCTEVfTUFSS1M7XG4gICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieTJcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICAgIGNvbnN0IHdhcm5zID0gbG9jYWxMb2dnZXIud2FybnM7XG4gICAgICAgIGFzc2VydC5lcXVhbCh3YXJuc1t3YXJucy5sZW5ndGgtMV0sIGxvZy5tZXNzYWdlLmNhbm5vdFN0YWNrUmFuZ2VkTWFyayhZKSxcbiAgICAgICAgICBzdHJpbmdpZnkoe3N0YWNrZWQ6IHN0YWNrZWQsIG1hcms6IG1hcmt9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgdGhlIGFnZ3JlZ2F0ZWQgYXhpcyBoYXMgbm9uLWxpbmVhciBzY2FsZScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgW1NjYWxlVHlwZS5MT0csIFNjYWxlVHlwZS5QT1csIFNjYWxlVHlwZS5TUVJUXS5mb3JFYWNoKChzY2FsZVR5cGUpID0+IHtcbiAgICAgICAgY29uc3QgbWFya3MgPSBzdGFja2VkID09PSB1bmRlZmluZWQgPyBTVEFDS19CWV9ERUZBVUxUX01BUktTIDogU1RBQ0tBQkxFX01BUktTO1xuICAgICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IHNjYWxlVHlwZX19LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgICBjb25zdCB3YXJucyA9IGxvY2FsTG9nZ2VyLndhcm5zO1xuICAgICAgICAgIGFzc2VydC5lcXVhbCh3YXJuc1t3YXJucy5sZW5ndGgtMV0sIGxvZy5tZXNzYWdlLmNhbm5vdFN0YWNrTm9uTGluZWFyU2NhbGUoc2NhbGVUeXBlKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCB0aHJvd3Mgd2FybmluZyBpZiB0aGUgYWdncmVnYXRlZCBheGlzIGhhcyBhIG5vbi1zdW1tYXRpdmUgYWdncmVnYXRlJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja09mZnNldCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgZm9yIChjb25zdCBhZ2dyZWdhdGUgb2YgWydhdmVyYWdlJywgJ3ZhcmlhbmNlJywgJ3EzJ10gYXMgQWdncmVnYXRlT3BbXSkge1xuICAgICAgICBjb25zdCBtYXJrcyA9IHN0YWNrT2Zmc2V0ID09PSB1bmRlZmluZWQgPyBTVEFDS19CWV9ERUZBVUxUX01BUktTIDogU1RBQ0tBQkxFX01BUktTO1xuICAgICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGUsXG4gICAgICAgICAgICAgICAgc3RhY2s6IHN0YWNrT2Zmc2V0LFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjogXCJhXCIsXG4gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICAgICAgY29uc3Qgd2FybnMgPSBsb2NhbExvZ2dlci53YXJucztcbiAgICAgICAgICBhc3NlcnQuZXF1YWwod2FybnNbd2FybnMubGVuZ3RoLTFdLCBsb2cubWVzc2FnZS5zdGFja05vblN1bW1hdGl2ZUFnZ3JlZ2F0ZShhZ2dyZWdhdGUpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KSk7XG5cbiAgZGVzY3JpYmUoJ3N0YWNrKCkuZ3JvdXBieUNoYW5uZWwsIC5maWVsZENoYW5uZWwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBjb3JyZWN0IGZvciBob3Jpem9udGFsJywgKCkgPT4ge1xuICAgICAgW0JBUiwgQVJFQV0uZm9yRWFjaCgoc3RhY2thYmxlTWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBzdGFja2FibGVNYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgX3N0YWNrID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmZpZWxkQ2hhbm5lbCwgWCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZ3JvdXBieUNoYW5uZWwsIFkpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgY29ycmVjdCBmb3IgaG9yaXpvbnRhbCAoc2luZ2xlKScsICgpID0+IHtcbiAgICAgIFtCQVIsIEFSRUFdLmZvckVhY2goKHN0YWNrYWJsZU1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogc3RhY2thYmxlTWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IF9zdGFjayA9IHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5maWVsZENoYW5uZWwsIFgpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmdyb3VwYnlDaGFubmVsLCBudWxsKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNvcnJlY3QgZm9yIHZlcnRpY2FsJywgKCkgPT4ge1xuICAgICAgW0JBUiwgQVJFQV0uZm9yRWFjaCgoc3RhY2thYmxlTWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBzdGFja2FibGVNYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgX3N0YWNrID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmZpZWxkQ2hhbm5lbCwgWSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZ3JvdXBieUNoYW5uZWwsIFgpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgY29ycmVjdCBmb3IgdmVydGljYWwgKHNpbmdsZSknLCAoKSA9PiB7XG4gICAgICBbQkFSLCBBUkVBXS5mb3JFYWNoKChzdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IHN0YWNrYWJsZU1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBfc3RhY2sgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZmllbGRDaGFubmVsLCBZKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5ncm91cGJ5Q2hhbm5lbCwgbnVsbCk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc3RhY2soKS5vZmZzZXQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB6ZXJvIGZvciBzdGFja2FibGUgbWFya3Mgd2l0aCBhdCBsZWFzdCBvZiBvZiB0aGUgc3RhY2sgY2hhbm5lbCBpZiBzdGFja2VkIGlzIHVuc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgW0JBUiwgQVJFQV0uZm9yRWFjaCgoc3RhY2thYmxlTWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBzdGFja2FibGVNYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgdW5kZWZpbmVkKS5vZmZzZXQsICd6ZXJvJyk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSB0aGUgc3BlY2lmaWVkIHN0YWNrZWQgZm9yIHN0YWNrYWJsZSBtYXJrcyB3aXRoIGF0IGxlYXN0IG9uZSBvZiB0aGUgc3RhY2sgY2hhbm5lbCcsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgICAgW0JBUiwgQVJFQV0uZm9yRWFjaCgoc3RhY2thYmxlTWFyaykgPT4ge1xuICAgICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICAgIFwibWFya1wiOiBzdGFja2FibGVNYXJrLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGFzc2VydC5lcXVhbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKS5vZmZzZXQsIHN0YWNrZWQpO1xuICAgICAgICAgIGFzc2VydC5lcXVhbChpc1N0YWNrZWQoc3BlYyksIHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==