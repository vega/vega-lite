"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var log = tslib_1.__importStar(require("../src/log"));
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
    it('should always be warned if the aggregated axis has non-linear scale', log.wrap(function (localLogger) {
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
                    chai_1.assert.isNotNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                    chai_1.assert.isTrue(spec_1.isStacked(spec));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4QkFBOEI7QUFDOUIsNkJBQTRCO0FBRzVCLDBDQUE0QztBQUM1QyxzREFBa0M7QUFDbEMsb0NBQTZEO0FBQzdELHNDQUF1QztBQUN2QyxvQ0FBb0U7QUFDcEUsc0NBQXlGO0FBQ3pGLG9DQUFzQztBQUd0QyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLElBQU0sbUJBQW1CLEdBQUcsQ0FBQyxXQUFJLENBQUMsQ0FBQztJQUVuQyxFQUFFLENBQUMsa0ZBQWtGLEVBQUU7Z0NBQzFFLE9BQU87WUFDaEIsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsZ0JBQWdCO2dCQUMzQyxJQUFNLElBQUksR0FBaUM7b0JBQ3pDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztvQkFDbkMsTUFBTSxFQUFFLGdCQUFnQjtvQkFDeEIsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO3dCQUNuRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7d0JBQzVDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztxQkFDOUM7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLE9BQU8sRUFBRSxPQUFPO3FCQUNqQjtpQkFDRixDQUFDO2dCQUNGLGFBQU0sQ0FBQyxNQUFNLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLGFBQU0sQ0FBQyxPQUFPLENBQUMs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NEJBQ25FLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQzs0QkFDNUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO3lCQUM5Qzt3QkFDRCxRQUFRLEVBQUU7NEJBQ1IsT0FBTyxFQUFFLE9BQU87eUJBQ2pCO3FCQUNGLENBQUM7b0JBQ0YsYUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNqRixhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQWpCRCxLQUFzQixVQUFnRCxFQUFoRCxLQUFBLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQWtCLEVBQWhELGNBQWdELEVBQWhELElBQWdEO2dCQUFqRSxJQUFNLE9BQU8sU0FBQTt5QkFBUCxPQUFPO2FBaUJqQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtBZ2dyZWdhdGVPcH0gZnJvbSAndmVnYSc7XG5cbmltcG9ydCB7REVUQUlMLCBYLCBZfSBmcm9tICcuLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vc3JjL2xvZyc7XG5pbXBvcnQge0FSRUEsIEJBUiwgUFJJTUlUSVZFX01BUktTLCBSRUNUfSBmcm9tICcuLi9zcmMvbWFyayc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7aXNTdGFja2VkLCBOb3JtYWxpemVkVW5pdFNwZWMsIFRvcExldmVsfSBmcm9tICcuLi9zcmMvc3BlYyc7XG5pbXBvcnQge3N0YWNrLCBTVEFDS19CWV9ERUZBVUxUX01BUktTLCBTVEFDS0FCTEVfTUFSS1MsIFN0YWNrT2Zmc2V0fSBmcm9tICcuLi9zcmMvc3RhY2snO1xuaW1wb3J0IHtzdHJpbmdpZnl9IGZyb20gJy4uL3NyYy91dGlsJztcblxuXG5kZXNjcmliZSgnc3RhY2snLCAoKSA9PiB7XG4gIGNvbnN0IE5PTl9TVEFDS0FCTEVfTUFSS1MgPSBbUkVDVF07XG5cbiAgaXQoJ3Nob3VsZCBiZSBkaXNhYmxlZCBmb3Igbm9uLXN0YWNrYWJsZSBtYXJrcyB3aXRoIGF0IGxlYXN0IG9mIG9mIHRoZSBzdGFjayBjaGFubmVsJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJywgbnVsbCwgJ25vbmUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBOT05fU1RBQ0tBQkxFX01BUktTLmZvckVhY2goKG5vblN0YWNrYWJsZU1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbm9uU3RhY2thYmxlTWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYmUgYWxsb3dlZCBmb3IgcmF3IHBsb3QnLCAoKSA9PiB7XG4gICAgU1RBQ0tBQkxFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic3RhY2tcIjogXCJ6ZXJvXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBzdGFja1Byb3BzID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHN0YWNrUHJvcHMuZmllbGRDaGFubmVsLCAneCcpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgIH0pO1xuICB9KTtcblxuXG4gIGl0KCdzaG91bGQgcHJpb3JpdGl6ZSBheGlzIHdpdGggc3RhY2snLCAoKSA9PiB7XG4gICAgU1RBQ0tBQkxFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic3RhY2tcIjogXCJ6ZXJvXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YWNrUHJvcHMgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RhY2tQcm9wcy5maWVsZENoYW5uZWwsICd4Jyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIGRpc2FibGVkIGlmIHRoZXJlIGlzIG5vIHN0YWNrYnkgY2hhbm5lbCcsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZScsIG51bGwsICdub25lJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgUFJJTUlUSVZFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgdGhlIHN0YWNrYnkgY2hhbm5lbCBpcyBhZ2dyZWdhdGVkJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJywgbnVsbCwgJ25vbmUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBQUklNSVRJVkVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIGRpc2FibGVkIGlmIHRoZSBzdGFja2J5IGNoYW5uZWwgaXMgaWRlbnRpY2FsIHRvIHknLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnLCBudWxsLCAnbm9uZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIFBSSU1JVElWRV9NQVJLUy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ2NhbiBlbmFibGVkIGlmIG9uZSBvZiB0aGUgc3RhY2tieSBjaGFubmVscyBpcyBub3QgYWdncmVnYXRlZCcsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIGNvbnN0IG1hcmtzID0gc3RhY2tlZCA9PT0gdW5kZWZpbmVkID8gU1RBQ0tfQllfREVGQVVMVF9NQVJLUyA6IFNUQUNLQUJMRV9NQVJLUztcbiAgICAgIG1hcmtzLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiYWdncmVnYXRlXCI6IFwiY291bnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJkZXRhaWxcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgX3N0YWNrID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjayk7XG4gICAgICAgIGFzc2VydC5pc09rKF9zdGFjayk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5zdGFja0J5WzBdLmNoYW5uZWwsIERFVEFJTCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdjYW4gZW5hYmxlZCBpZiBvbmUgb2YgdGhlIHN0YWNrYnkgY2hhbm5lbHMgaXMgbm90IGFnZ3JlZ2F0ZWQnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBjb25zdCBtYXJrcyA9IHN0YWNrZWQgPT09IHVuZGVmaW5lZCA/IFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MgOiBTVEFDS0FCTEVfTUFSS1M7XG4gICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzdGFja1wiOiBzdGFja2VkfSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiYWdncmVnYXRlXCI6IFwiY291bnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJkZXRhaWxcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgX3N0YWNrID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQuaXNPayhfc3RhY2spO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suc3RhY2tCeVswXS5jaGFubmVsLCBERVRBSUwpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBpZiBib3RoIHggYW5kIHkgYXJlIGFnZ3JlZ2F0ZScsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZScsIG51bGwsICdub25lJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgUFJJTUlUSVZFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5pc051bGwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjaykpO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBpZiBuZWl0aGVyIHggbm9yIHkgaXMgYWdncmVnYXRlIG9yIHN0YWNrJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJywgbnVsbCwgJ25vbmUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBQUklNSVRJVkVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgdGhlcmUgaXMgYm90aCB4IGFuZCB4MicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgY29uc3QgbWFya3MgPSBzdGFja2VkID09PSB1bmRlZmluZWQgPyBTVEFDS19CWV9ERUZBVUxUX01BUktTIDogU1RBQ0tBQkxFX01BUktTO1xuICAgICAgbWFya3MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgICBcIngyXCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5pc051bGwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjaykpO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgICBjb25zdCB3YXJucyA9IGxvY2FsTG9nZ2VyLndhcm5zO1xuICAgICAgICBhc3NlcnQuZXF1YWwod2FybnNbd2FybnMubGVuZ3RoLTFdLCBsb2cubWVzc2FnZS5jYW5ub3RTdGFja1JhbmdlZE1hcmsoWCksXG4gICAgICAgICAgc3RyaW5naWZ5KHtzdGFja2VkOiBzdGFja2VkLCBtYXJrOiBtYXJrfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkpO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIGRpc2FibGVkIGlmIHRoZXJlIGlzIGJvdGggeSBhbmQgeTInLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIGNvbnN0IG1hcmtzID0gc3RhY2tlZCA9PT0gdW5kZWZpbmVkID8gU1RBQ0tfQllfREVGQVVMVF9NQVJLUyA6IFNUQUNLQUJMRV9NQVJLUztcbiAgICAgIG1hcmtzLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgXCJ5MlwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgY29uc3Qgd2FybnMgPSBsb2NhbExvZ2dlci53YXJucztcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHdhcm5zW3dhcm5zLmxlbmd0aC0xXSwgbG9nLm1lc3NhZ2UuY2Fubm90U3RhY2tSYW5nZWRNYXJrKFkpLFxuICAgICAgICAgIHN0cmluZ2lmeSh7c3RhY2tlZDogc3RhY2tlZCwgbWFyazogbWFya30pXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pKTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSB3YXJuZWQgaWYgdGhlIGFnZ3JlZ2F0ZWQgYXhpcyBoYXMgbm9uLWxpbmVhciBzY2FsZScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgW1NjYWxlVHlwZS5MT0csIFNjYWxlVHlwZS5QT1csIFNjYWxlVHlwZS5TUVJUXS5mb3JFYWNoKChzY2FsZVR5cGUpID0+IHtcbiAgICAgICAgY29uc3QgbWFya3MgPSBzdGFja2VkID09PSB1bmRlZmluZWQgPyBTVEFDS19CWV9ERUZBVUxUX01BUktTIDogU1RBQ0tBQkxFX01BUktTO1xuICAgICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IHNjYWxlVHlwZX19LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgYXNzZXJ0LmlzTm90TnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgICAgIGNvbnN0IHdhcm5zID0gbG9jYWxMb2dnZXIud2FybnM7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKHdhcm5zW3dhcm5zLmxlbmd0aC0xXSwgbG9nLm1lc3NhZ2UuY2Fubm90U3RhY2tOb25MaW5lYXJTY2FsZShzY2FsZVR5cGUpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pKTtcblxuICBpdCgnc2hvdWxkIHRocm93cyB3YXJuaW5nIGlmIHRoZSBhZ2dyZWdhdGVkIGF4aXMgaGFzIGEgbm9uLXN1bW1hdGl2ZSBhZ2dyZWdhdGUnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrT2Zmc2V0IG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBmb3IgKGNvbnN0IGFnZ3JlZ2F0ZSBvZiBbJ2F2ZXJhZ2UnLCAndmFyaWFuY2UnLCAncTMnXSBhcyBBZ2dyZWdhdGVPcFtdKSB7XG4gICAgICAgIGNvbnN0IG1hcmtzID0gc3RhY2tPZmZzZXQgPT09IHVuZGVmaW5lZCA/IFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MgOiBTVEFDS0FCTEVfTUFSS1M7XG4gICAgICAgIG1hcmtzLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZSxcbiAgICAgICAgICAgICAgICBzdGFjazogc3RhY2tPZmZzZXQsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiBcImFcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgICBjb25zdCB3YXJucyA9IGxvY2FsTG9nZ2VyLndhcm5zO1xuICAgICAgICAgIGFzc2VydC5lcXVhbCh3YXJuc1t3YXJucy5sZW5ndGgtMV0sIGxvZy5tZXNzYWdlLnN0YWNrTm9uU3VtbWF0aXZlQWdncmVnYXRlKGFnZ3JlZ2F0ZSkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pKTtcblxuICBkZXNjcmliZSgnc3RhY2soKS5ncm91cGJ5Q2hhbm5lbCwgLmZpZWxkQ2hhbm5lbCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIGNvcnJlY3QgZm9yIGhvcml6b250YWwnLCAoKSA9PiB7XG4gICAgICBbQkFSLCBBUkVBXS5mb3JFYWNoKChzdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IHN0YWNrYWJsZU1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBfc3RhY2sgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZmllbGRDaGFubmVsLCBYKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5ncm91cGJ5Q2hhbm5lbCwgWSk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjb3JyZWN0IGZvciBob3Jpem9udGFsIChzaW5nbGUpJywgKCkgPT4ge1xuICAgICAgW0JBUiwgQVJFQV0uZm9yRWFjaCgoc3RhY2thYmxlTWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBzdGFja2FibGVNYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgX3N0YWNrID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmZpZWxkQ2hhbm5lbCwgWCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZ3JvdXBieUNoYW5uZWwsIG51bGwpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgY29ycmVjdCBmb3IgdmVydGljYWwnLCAoKSA9PiB7XG4gICAgICBbQkFSLCBBUkVBXS5mb3JFYWNoKChzdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IHN0YWNrYWJsZU1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBfc3RhY2sgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZmllbGRDaGFubmVsLCBZKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5ncm91cGJ5Q2hhbm5lbCwgWCk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjb3JyZWN0IGZvciB2ZXJ0aWNhbCAoc2luZ2xlKScsICgpID0+IHtcbiAgICAgIFtCQVIsIEFSRUFdLmZvckVhY2goKHN0YWNrYWJsZU1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogc3RhY2thYmxlTWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IF9zdGFjayA9IHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5maWVsZENoYW5uZWwsIFkpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmdyb3VwYnlDaGFubmVsLCBudWxsKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzdGFjaygpLm9mZnNldCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHplcm8gZm9yIHN0YWNrYWJsZSBtYXJrcyB3aXRoIGF0IGxlYXN0IG9mIG9mIHRoZSBzdGFjayBjaGFubmVsIGlmIHN0YWNrZWQgaXMgdW5zcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBbQkFSLCBBUkVBXS5mb3JFYWNoKChzdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IHN0YWNrYWJsZU1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpLm9mZnNldCwgJ3plcm8nKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIHRoZSBzcGVjaWZpZWQgc3RhY2tlZCBmb3Igc3RhY2thYmxlIG1hcmtzIHdpdGggYXQgbGVhc3Qgb25lIG9mIHRoZSBzdGFjayBjaGFubmVsJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFsnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgICBbQkFSLCBBUkVBXS5mb3JFYWNoKChzdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgICAgXCJtYXJrXCI6IHN0YWNrYWJsZU1hcmssXG4gICAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spLm9mZnNldCwgc3RhY2tlZCk7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGlzU3RhY2tlZChzcGVjKSwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19