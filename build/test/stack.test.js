/* tslint:disable:quotemark */
import { assert } from 'chai';
import { DETAIL, X, Y } from '../src/channel';
import * as log from '../src/log';
import { AREA, BAR, PRIMITIVE_MARKS, RECT } from '../src/mark';
import { ScaleType } from '../src/scale';
import { isStacked } from '../src/spec';
import { stack, STACK_BY_DEFAULT_MARKS, STACKABLE_MARKS } from '../src/stack';
import { stringify } from '../src/util';
describe('stack', function () {
    var NON_STACKABLE_MARKS = [RECT];
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_1(stacked);
        }
    });
    it('should be allowed for raw plot', function () {
        STACKABLE_MARKS.forEach(function (mark) {
            var spec = {
                "data": { "url": "data/barley.json" },
                "mark": mark,
                "encoding": {
                    "x": { "field": "yield", "type": "quantitative", "stack": "zero" },
                    "y": { "field": "variety", "type": "nominal" },
                    "color": { "field": "site", "type": "nominal" }
                }
            };
            var stackProps = stack(spec.mark, spec.encoding, undefined);
            assert.equal(stackProps.fieldChannel, 'x');
            assert.isTrue(isStacked(spec));
        });
    });
    it('should prioritize axis with stack', function () {
        STACKABLE_MARKS.forEach(function (mark) {
            var spec = {
                "data": { "url": "data/barley.json" },
                "mark": mark,
                "encoding": {
                    "x": { "field": "yield", "type": "quantitative", "stack": "zero" },
                    "y": { "field": "variety", "type": "quantitative" },
                    "color": { "field": "site", "type": "nominal" }
                }
            };
            var stackProps = stack(spec.mark, spec.encoding, undefined);
            assert.equal(stackProps.fieldChannel, 'x');
            assert.isTrue(isStacked(spec));
        });
    });
    it('should always be disabled if there is no stackby channel', function () {
        var _loop_2 = function (stacked) {
            PRIMITIVE_MARKS.forEach(function (mark) {
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_2(stacked);
        }
    });
    it('should always be disabled if the stackby channel is aggregated', function () {
        var _loop_3 = function (stacked) {
            PRIMITIVE_MARKS.forEach(function (mark) {
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_3(stacked);
        }
    });
    it('should always be disabled if the stackby channel is identical to y', function () {
        var _loop_4 = function (stacked) {
            PRIMITIVE_MARKS.forEach(function (mark) {
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_4(stacked);
        }
    });
    it('can enabled if one of the stackby channels is not aggregated', function () {
        var _loop_5 = function (stacked) {
            var marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
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
                var _stack = stack(spec.mark, spec.encoding, spec.config.stack);
                assert.isOk(_stack);
                assert.isTrue(isStacked(spec));
                assert.equal(_stack.stackBy[0].channel, DETAIL);
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_5(stacked);
        }
    });
    it('can enabled if one of the stackby channels is not aggregated', function () {
        var _loop_6 = function (stacked) {
            var marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
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
                var _stack = stack(spec.mark, spec.encoding, undefined);
                assert.isOk(_stack);
                assert.isTrue(isStacked(spec));
                assert.equal(_stack.stackBy[0].channel, DETAIL);
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_6(stacked);
        }
    });
    it('should always be disabled if both x and y are aggregate', function () {
        var _loop_7 = function (stacked) {
            PRIMITIVE_MARKS.forEach(function (mark) {
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_7(stacked);
        }
    });
    it('should always be disabled if neither x nor y is aggregate or stack', function () {
        var _loop_8 = function (stacked) {
            PRIMITIVE_MARKS.forEach(function (mark) {
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_8(stacked);
        }
    });
    it('should always be disabled if there is both x and x2', log.wrap(function (localLogger) {
        var _loop_9 = function (stacked) {
            var marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
                var warns = localLogger.warns;
                assert.equal(warns[warns.length - 1], log.message.cannotStackRangedMark(X), stringify({ stacked: stacked, mark: mark }));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_9(stacked);
        }
    }));
    it('should always be disabled if there is both y and y2', log.wrap(function (localLogger) {
        var _loop_10 = function (stacked) {
            var marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
                var warns = localLogger.warns;
                assert.equal(warns[warns.length - 1], log.message.cannotStackRangedMark(Y), stringify({ stacked: stacked, mark: mark }));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_10(stacked);
        }
    }));
    it('should always be warned if the aggregated axis has non-linear scale', log.wrap(function (localLogger) {
        var _loop_11 = function (stacked) {
            [ScaleType.LOG, ScaleType.POW, ScaleType.SQRT].forEach(function (scaleType) {
                var marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
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
                    assert.isNotNull(stack(spec.mark, spec.encoding, spec.config.stack));
                    assert.isTrue(isStacked(spec));
                    var warns = localLogger.warns;
                    assert.equal(warns[warns.length - 1], log.message.cannotStackNonLinearScale(scaleType));
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
                var marks = stackOffset === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
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
                    assert.isTrue(isStacked(spec));
                    var warns = localLogger.warns;
                    assert.equal(warns[warns.length - 1], log.message.stackNonSummativeAggregate(aggregate));
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
            [BAR, AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack(spec.mark, spec.encoding, undefined);
                assert.equal(_stack.fieldChannel, X);
                assert.equal(_stack.groupbyChannel, Y);
                assert.isTrue(isStacked(spec));
            });
        });
        it('should be correct for horizontal (single)', function () {
            [BAR, AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack(spec.mark, spec.encoding, undefined);
                assert.equal(_stack.fieldChannel, X);
                assert.equal(_stack.groupbyChannel, null);
                assert.isTrue(isStacked(spec));
            });
        });
        it('should be correct for vertical', function () {
            [BAR, AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "y": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "x": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack(spec.mark, spec.encoding, undefined);
                assert.equal(_stack.fieldChannel, Y);
                assert.equal(_stack.groupbyChannel, X);
                assert.isTrue(isStacked(spec));
            });
        });
        it('should be correct for vertical (single)', function () {
            [BAR, AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "y": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack(spec.mark, spec.encoding, undefined);
                assert.equal(_stack.fieldChannel, Y);
                assert.equal(_stack.groupbyChannel, null);
                assert.isTrue(isStacked(spec));
            });
        });
    });
    describe('stack().offset', function () {
        it('should be zero for stackable marks with at least of of the stack channel if stacked is unspecified', function () {
            [BAR, AREA].forEach(function (stackableMark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": stackableMark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "field": "site", "type": "nominal" }
                    }
                };
                assert.equal(stack(spec.mark, spec.encoding, undefined).offset, 'zero');
                assert.isTrue(isStacked(spec));
            });
        });
        it('should be the specified stacked for stackable marks with at least one of the stack channel', function () {
            var _loop_14 = function (stacked) {
                [BAR, AREA].forEach(function (stackableMark) {
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
                    assert.equal(stack(spec.mark, spec.encoding, spec.config.stack).offset, stacked);
                    assert.equal(isStacked(spec), true);
                });
            };
            for (var _i = 0, _a = ['center', 'zero', 'normalize']; _i < _a.length; _i++) {
                var stacked = _a[_i];
                _loop_14(stacked);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFDOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUc1QixPQUFPLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEtBQUssR0FBRyxNQUFNLFlBQVksQ0FBQztBQUNsQyxPQUFPLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzdELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDdkMsT0FBTyxFQUFDLFNBQVMsRUFBK0IsTUFBTSxhQUFhLENBQUM7QUFDcEUsT0FBTyxFQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxlQUFlLEVBQWMsTUFBTSxjQUFjLENBQUM7QUFDekYsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUd0QyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLElBQU0sbUJBQW1CLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVuQyxFQUFFLENBQUMsa0ZBQWtGLEVBQUU7Z0NBQzFFLE9BQU87WUFDaEIsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQUMsZ0JBQWdCO2dCQUMzQyxJQUFNLElBQUksR0FBaUM7b0JBQ3pDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztvQkFDbkMsTUFBTSxFQUFFLGdCQUFnQjtvQkFDeEIsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO3dCQUNuRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxF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cXVvdGVtYXJrICovXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcblxuaW1wb3J0IHtERVRBSUwsIFgsIFl9IGZyb20gJy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9zcmMvbG9nJztcbmltcG9ydCB7QVJFQSwgQkFSLCBQUklNSVRJVkVfTUFSS1MsIFJFQ1R9IGZyb20gJy4uL3NyYy9tYXJrJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi9zcmMvc2NhbGUnO1xuaW1wb3J0IHtpc1N0YWNrZWQsIE5vcm1hbGl6ZWRVbml0U3BlYywgVG9wTGV2ZWx9IGZyb20gJy4uL3NyYy9zcGVjJztcbmltcG9ydCB7c3RhY2ssIFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MsIFNUQUNLQUJMRV9NQVJLUywgU3RhY2tPZmZzZXR9IGZyb20gJy4uL3NyYy9zdGFjayc7XG5pbXBvcnQge3N0cmluZ2lmeX0gZnJvbSAnLi4vc3JjL3V0aWwnO1xuXG5cbmRlc2NyaWJlKCdzdGFjaycsICgpID0+IHtcbiAgY29uc3QgTk9OX1NUQUNLQUJMRV9NQVJLUyA9IFtSRUNUXTtcblxuICBpdCgnc2hvdWxkIGJlIGRpc2FibGVkIGZvciBub24tc3RhY2thYmxlIG1hcmtzIHdpdGggYXQgbGVhc3Qgb2Ygb2YgdGhlIHN0YWNrIGNoYW5uZWwnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnLCBudWxsLCAnbm9uZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIE5PTl9TVEFDS0FCTEVfTUFSS1MuZm9yRWFjaCgobm9uU3RhY2thYmxlTWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBub25TdGFja2FibGVNYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBiZSBhbGxvd2VkIGZvciByYXcgcGxvdCcsICgpID0+IHtcbiAgICBTVEFDS0FCTEVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzdGFja1wiOiBcInplcm9cIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHN0YWNrUHJvcHMgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RhY2tQcm9wcy5maWVsZENoYW5uZWwsICd4Jyk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgaXQoJ3Nob3VsZCBwcmlvcml0aXplIGF4aXMgd2l0aCBzdGFjaycsICgpID0+IHtcbiAgICBTVEFDS0FCTEVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzdGFja1wiOiBcInplcm9cIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgc3RhY2tQcm9wcyA9IHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5lcXVhbChzdGFja1Byb3BzLmZpZWxkQ2hhbm5lbCwgJ3gnKTtcbiAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgdGhlcmUgaXMgbm8gc3RhY2tieSBjaGFubmVsJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJywgbnVsbCwgJ25vbmUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBQUklNSVRJVkVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5pc051bGwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjaykpO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBpZiB0aGUgc3RhY2tieSBjaGFubmVsIGlzIGFnZ3JlZ2F0ZWQnLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnLCBudWxsLCAnbm9uZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIFBSSU1JVElWRV9NQVJLUy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImFnZ3JlZ2F0ZVwiOiBcImNvdW50XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBhc3NlcnQuaXNOdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgYXNzZXJ0LmlzRmFsc2UoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgdGhlIHN0YWNrYnkgY2hhbm5lbCBpcyBpZGVudGljYWwgdG8geScsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZScsIG51bGwsICdub25lJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgUFJJTUlUSVZFX01BUktTLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5pc051bGwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjaykpO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnY2FuIGVuYWJsZWQgaWYgb25lIG9mIHRoZSBzdGFja2J5IGNoYW5uZWxzIGlzIG5vdCBhZ2dyZWdhdGVkJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgY29uc3QgbWFya3MgPSBzdGFja2VkID09PSB1bmRlZmluZWQgPyBTVEFDS19CWV9ERUZBVUxUX01BUktTIDogU1RBQ0tBQkxFX01BUktTO1xuICAgICAgbWFya3MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImRldGFpbFwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJjb25maWdcIjoge1xuICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBfc3RhY2sgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKTtcbiAgICAgICAgYXNzZXJ0LmlzT2soX3N0YWNrKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLnN0YWNrQnlbMF0uY2hhbm5lbCwgREVUQUlMKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ2NhbiBlbmFibGVkIGlmIG9uZSBvZiB0aGUgc3RhY2tieSBjaGFubmVscyBpcyBub3QgYWdncmVnYXRlZCcsICgpID0+IHtcbiAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIGNvbnN0IG1hcmtzID0gc3RhY2tlZCA9PT0gdW5kZWZpbmVkID8gU1RBQ0tfQllfREVGQVVMVF9NQVJLUyA6IFNUQUNLQUJMRV9NQVJLUztcbiAgICAgIG1hcmtzLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInN0YWNrXCI6IHN0YWNrZWR9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwidmFyaWV0eVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJhZ2dyZWdhdGVcIjogXCJjb3VudFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImRldGFpbFwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBfc3RhY2sgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICAgIGFzc2VydC5pc09rKF9zdGFjayk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5zdGFja0J5WzBdLmNoYW5uZWwsIERFVEFJTCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIGRpc2FibGVkIGlmIGJvdGggeCBhbmQgeSBhcmUgYWdncmVnYXRlJywgKCkgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJywgbnVsbCwgJ25vbmUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBQUklNSVRJVkVfTUFSS1MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcImNvdW50XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIGRpc2FibGVkIGlmIG5laXRoZXIgeCBub3IgeSBpcyBhZ2dyZWdhdGUgb3Igc3RhY2snLCAoKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnLCBudWxsLCAnbm9uZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIFBSSU1JVElWRV9NQVJLUy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5pc051bGwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjaykpO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICBpdCgnc2hvdWxkIGFsd2F5cyBiZSBkaXNhYmxlZCBpZiB0aGVyZSBpcyBib3RoIHggYW5kIHgyJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBjb25zdCBtYXJrcyA9IHN0YWNrZWQgPT09IHVuZGVmaW5lZCA/IFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MgOiBTVEFDS0FCTEVfTUFSS1M7XG4gICAgICBtYXJrcy5mb3JFYWNoKChtYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJtYXJrXCI6IG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieDJcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgIFwic3RhY2tcIjogc3RhY2tlZFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgYXNzZXJ0LmlzTnVsbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHNwZWMuY29uZmlnLnN0YWNrKSk7XG4gICAgICAgIGFzc2VydC5pc0ZhbHNlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICAgIGNvbnN0IHdhcm5zID0gbG9jYWxMb2dnZXIud2FybnM7XG4gICAgICAgIGFzc2VydC5lcXVhbCh3YXJuc1t3YXJucy5sZW5ndGgtMV0sIGxvZy5tZXNzYWdlLmNhbm5vdFN0YWNrUmFuZ2VkTWFyayhYKSxcbiAgICAgICAgICBzdHJpbmdpZnkoe3N0YWNrZWQ6IHN0YWNrZWQsIG1hcms6IG1hcmt9KVxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfVxuICB9KSk7XG5cbiAgaXQoJ3Nob3VsZCBhbHdheXMgYmUgZGlzYWJsZWQgaWYgdGhlcmUgaXMgYm90aCB5IGFuZCB5MicsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tlZCBvZiBbdW5kZWZpbmVkLCAnY2VudGVyJywgJ3plcm8nLCAnbm9ybWFsaXplJ10gYXMgU3RhY2tPZmZzZXRbXSkge1xuICAgICAgY29uc3QgbWFya3MgPSBzdGFja2VkID09PSB1bmRlZmluZWQgPyBTVEFDS19CWV9ERUZBVUxUX01BUktTIDogU1RBQ0tBQkxFX01BUktTO1xuICAgICAgbWFya3MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgICBcInkyXCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNvbmZpZ1wiOiB7XG4gICAgICAgICAgICBcInN0YWNrXCI6IHN0YWNrZWRcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5pc051bGwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjaykpO1xuICAgICAgICBhc3NlcnQuaXNGYWxzZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgICBjb25zdCB3YXJucyA9IGxvY2FsTG9nZ2VyLndhcm5zO1xuICAgICAgICBhc3NlcnQuZXF1YWwod2FybnNbd2FybnMubGVuZ3RoLTFdLCBsb2cubWVzc2FnZS5jYW5ub3RTdGFja1JhbmdlZE1hcmsoWSksXG4gICAgICAgICAgc3RyaW5naWZ5KHtzdGFja2VkOiBzdGFja2VkLCBtYXJrOiBtYXJrfSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkpO1xuXG4gIGl0KCdzaG91bGQgYWx3YXlzIGJlIHdhcm5lZCBpZiB0aGUgYWdncmVnYXRlZCBheGlzIGhhcyBub24tbGluZWFyIHNjYWxlJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgZm9yIChjb25zdCBzdGFja2VkIG9mIFt1bmRlZmluZWQsICdjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICBbU2NhbGVUeXBlLkxPRywgU2NhbGVUeXBlLlBPVywgU2NhbGVUeXBlLlNRUlRdLmZvckVhY2goKHNjYWxlVHlwZSkgPT4ge1xuICAgICAgICBjb25zdCBtYXJrcyA9IHN0YWNrZWQgPT09IHVuZGVmaW5lZCA/IFNUQUNLX0JZX0RFRkFVTFRfTUFSS1MgOiBTVEFDS0FCTEVfTUFSS1M7XG4gICAgICAgIG1hcmtzLmZvckVhY2goKG1hcmspID0+IHtcbiAgICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogbWFyayxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcInNjYWxlXCI6IHtcInR5cGVcIjogc2NhbGVUeXBlfX0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBhc3NlcnQuaXNOb3ROdWxsKHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgc3BlYy5jb25maWcuc3RhY2spKTtcbiAgICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICAgICAgY29uc3Qgd2FybnMgPSBsb2NhbExvZ2dlci53YXJucztcbiAgICAgICAgICBhc3NlcnQuZXF1YWwod2FybnNbd2FybnMubGVuZ3RoLTFdLCBsb2cubWVzc2FnZS5jYW5ub3RTdGFja05vbkxpbmVhclNjYWxlKHNjYWxlVHlwZSkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkpO1xuXG4gIGl0KCdzaG91bGQgdGhyb3dzIHdhcm5pbmcgaWYgdGhlIGFnZ3JlZ2F0ZWQgYXhpcyBoYXMgYSBub24tc3VtbWF0aXZlIGFnZ3JlZ2F0ZScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgIGZvciAoY29uc3Qgc3RhY2tPZmZzZXQgb2YgW3VuZGVmaW5lZCwgJ2NlbnRlcicsICd6ZXJvJywgJ25vcm1hbGl6ZSddIGFzIFN0YWNrT2Zmc2V0W10pIHtcbiAgICAgIGZvciAoY29uc3QgYWdncmVnYXRlIG9mIFsnYXZlcmFnZScsICd2YXJpYW5jZScsICdxMyddIGFzIEFnZ3JlZ2F0ZU9wW10pIHtcbiAgICAgICAgY29uc3QgbWFya3MgPSBzdGFja09mZnNldCA9PT0gdW5kZWZpbmVkID8gU1RBQ0tfQllfREVGQVVMVF9NQVJLUyA6IFNUQUNLQUJMRV9NQVJLUztcbiAgICAgICAgbWFya3MuZm9yRWFjaCgobWFyaykgPT4ge1xuICAgICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICAgIFwibWFya1wiOiBtYXJrLFxuICAgICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgICAgYWdncmVnYXRlLFxuICAgICAgICAgICAgICAgIHN0YWNrOiBzdGFja09mZnNldCxcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IFwiYVwiLFxuICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgICAgIGNvbnN0IHdhcm5zID0gbG9jYWxMb2dnZXIud2FybnM7XG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKHdhcm5zW3dhcm5zLmxlbmd0aC0xXSwgbG9nLm1lc3NhZ2Uuc3RhY2tOb25TdW1tYXRpdmVBZ2dyZWdhdGUoYWdncmVnYXRlKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSkpO1xuXG4gIGRlc2NyaWJlKCdzdGFjaygpLmdyb3VwYnlDaGFubmVsLCAuZmllbGRDaGFubmVsJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgY29ycmVjdCBmb3IgaG9yaXpvbnRhbCcsICgpID0+IHtcbiAgICAgIFtCQVIsIEFSRUFdLmZvckVhY2goKHN0YWNrYWJsZU1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogc3RhY2thYmxlTWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IF9zdGFjayA9IHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5maWVsZENoYW5uZWwsIFgpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmdyb3VwYnlDaGFubmVsLCBZKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNvcnJlY3QgZm9yIGhvcml6b250YWwgKHNpbmdsZSknLCAoKSA9PiB7XG4gICAgICBbQkFSLCBBUkVBXS5mb3JFYWNoKChzdGFja2FibGVNYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwZWM6IFRvcExldmVsPE5vcm1hbGl6ZWRVbml0U3BlYz4gPSB7XG4gICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgXCJtYXJrXCI6IHN0YWNrYWJsZU1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwic2l0ZVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBfc3RhY2sgPSBzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZmllbGRDaGFubmVsLCBYKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5ncm91cGJ5Q2hhbm5lbCwgbnVsbCk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoaXNTdGFja2VkKHNwZWMpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjb3JyZWN0IGZvciB2ZXJ0aWNhbCcsICgpID0+IHtcbiAgICAgIFtCQVIsIEFSRUFdLmZvckVhY2goKHN0YWNrYWJsZU1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogc3RhY2thYmxlTWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IF9zdGFjayA9IHN0YWNrKHNwZWMubWFyaywgc3BlYy5lbmNvZGluZywgdW5kZWZpbmVkKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKF9zdGFjay5maWVsZENoYW5uZWwsIFkpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmdyb3VwYnlDaGFubmVsLCBYKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1N0YWNrZWQoc3BlYykpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNvcnJlY3QgZm9yIHZlcnRpY2FsIChzaW5nbGUpJywgKCkgPT4ge1xuICAgICAgW0JBUiwgQVJFQV0uZm9yRWFjaCgoc3RhY2thYmxlTWFyaykgPT4ge1xuICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICAgIFwibWFya1wiOiBzdGFja2FibGVNYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgX3N0YWNrID0gc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCB1bmRlZmluZWQpO1xuICAgICAgICBhc3NlcnQuZXF1YWwoX3N0YWNrLmZpZWxkQ2hhbm5lbCwgWSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChfc3RhY2suZ3JvdXBieUNoYW5uZWwsIG51bGwpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3N0YWNrKCkub2Zmc2V0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgemVybyBmb3Igc3RhY2thYmxlIG1hcmtzIHdpdGggYXQgbGVhc3Qgb2Ygb2YgdGhlIHN0YWNrIGNoYW5uZWwgaWYgc3RhY2tlZCBpcyB1bnNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIFtCQVIsIEFSRUFdLmZvckVhY2goKHN0YWNrYWJsZU1hcmspID0+IHtcbiAgICAgICAgY29uc3Qgc3BlYzogVG9wTGV2ZWw8Tm9ybWFsaXplZFVuaXRTcGVjPiA9IHtcbiAgICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgICBcIm1hcmtcIjogc3RhY2thYmxlTWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJzaXRlXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGFzc2VydC5lcXVhbChzdGFjayhzcGVjLm1hcmssIHNwZWMuZW5jb2RpbmcsIHVuZGVmaW5lZCkub2Zmc2V0LCAnemVybycpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGlzU3RhY2tlZChzcGVjKSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgdGhlIHNwZWNpZmllZCBzdGFja2VkIGZvciBzdGFja2FibGUgbWFya3Mgd2l0aCBhdCBsZWFzdCBvbmUgb2YgdGhlIHN0YWNrIGNoYW5uZWwnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHN0YWNrZWQgb2YgWydjZW50ZXInLCAnemVybycsICdub3JtYWxpemUnXSBhcyBTdGFja09mZnNldFtdKSB7XG4gICAgICAgIFtCQVIsIEFSRUFdLmZvckVhY2goKHN0YWNrYWJsZU1hcmspID0+IHtcbiAgICAgICAgICBjb25zdCBzcGVjOiBUb3BMZXZlbDxOb3JtYWxpemVkVW5pdFNwZWM+ID0ge1xuICAgICAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgICAgICBcIm1hcmtcIjogc3RhY2thYmxlTWFyayxcbiAgICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifSxcbiAgICAgICAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcInNpdGVcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY29uZmlnXCI6IHtcbiAgICAgICAgICAgICAgXCJzdGFja1wiOiBzdGFja2VkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoc3RhY2soc3BlYy5tYXJrLCBzcGVjLmVuY29kaW5nLCBzcGVjLmNvbmZpZy5zdGFjaykub2Zmc2V0LCBzdGFja2VkKTtcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaXNTdGFja2VkKHNwZWMpLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=