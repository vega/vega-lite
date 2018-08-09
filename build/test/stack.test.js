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
describe('stack', function () {
    var NON_STACKABLE_MARKS = [mark_1.RECT];
    it('should be disabled for non-stackable marks with at least of of the stack channel', function () {
        var _loop_1 = function (stacked) {
            NON_STACKABLE_MARKS.forEach(function (nonStackableMark) {
                var spec = {
                    data: { url: 'data/barley.json' },
                    mark: nonStackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
                    },
                    config: {
                        stack: stacked
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
                data: { url: 'data/barley.json' },
                mark: mark,
                encoding: {
                    x: { field: 'yield', type: 'quantitative', stack: 'zero' },
                    y: { field: 'variety', type: 'nominal' },
                    color: { field: 'site', type: 'nominal' }
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
                data: { url: 'data/barley.json' },
                mark: mark,
                encoding: {
                    x: { field: 'yield', type: 'quantitative', stack: 'zero' },
                    y: { field: 'variety', type: 'quantitative' },
                    color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: mark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' }
                    },
                    config: {
                        stack: stacked
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
                    data: { url: 'data/barley.json' },
                    mark: mark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { aggregate: 'count', type: 'quantitative' }
                    },
                    config: {
                        stack: stacked
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
                    data: { url: 'data/barley.json' },
                    mark: mark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'variety', type: 'nominal' }
                    },
                    config: {
                        stack: stacked
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
                    data: { url: 'data/barley.json' },
                    mark: mark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { aggregate: 'count', type: 'quantitative' },
                        detail: { field: 'site', type: 'nominal' }
                    },
                    config: {
                        stack: stacked
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
                    data: { url: 'data/barley.json' },
                    mark: mark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative', stack: stacked },
                        y: { field: 'variety', type: 'nominal' },
                        color: { aggregate: 'count', type: 'quantitative' },
                        detail: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: mark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { aggregate: 'count', type: 'quantitative' },
                        color: { field: 'site', type: 'nominal' }
                    },
                    config: {
                        stack: stacked
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
                    data: { url: 'data/barley.json' },
                    mark: mark,
                    encoding: {
                        x: { field: 'variety', type: 'nominal' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
                    },
                    config: {
                        stack: stacked
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
    it('should always be disabled if there is both x and x2', function () {
        var _loop_9 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    mark: mark,
                    encoding: {
                        x: { field: 'a', type: 'quantitative', aggregate: 'sum' },
                        x2: { field: 'a', type: 'quantitative', aggregate: 'sum' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
                    },
                    config: {
                        stack: stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_9(stacked);
        }
    });
    it('should always be disabled if there is both y and y2', function () {
        var _loop_10 = function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    mark: mark,
                    encoding: {
                        y: { field: 'a', type: 'quantitative', aggregate: 'sum' },
                        y2: { field: 'a', type: 'quantitative', aggregate: 'sum' },
                        x: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
                    },
                    config: {
                        stack: stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_10(stacked);
        }
    });
    it('should always be warned if the aggregated axis has non-linear scale', log.wrap(function (localLogger) {
        var _loop_11 = function (stacked) {
            [scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT].forEach(function (scaleType) {
                var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
                marks.forEach(function (mark) {
                    var spec = {
                        data: { url: 'data/barley.json' },
                        mark: mark,
                        encoding: {
                            x: { field: 'a', type: 'quantitative', aggregate: 'sum', scale: { type: scaleType } },
                            y: { field: 'variety', type: 'nominal' },
                            color: { field: 'site', type: 'nominal' }
                        },
                        config: {
                            stack: stacked
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
                        data: { url: 'data/barley.json' },
                        mark: mark,
                        encoding: {
                            x: {
                                aggregate: aggregate,
                                stack: stackOffset,
                                field: 'a',
                                type: 'quantitative'
                            },
                            y: { field: 'variety', type: 'nominal' },
                            color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        y: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        x: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        y: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
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
                        data: { url: 'data/barley.json' },
                        mark: stackableMark,
                        encoding: {
                            x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                            y: { field: 'variety', type: 'nominal' },
                            color: { field: 'site', type: 'nominal' }
                        },
                        config: {
                            stack: stacked
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
//# sourceMappingURL=stack.test.js.map