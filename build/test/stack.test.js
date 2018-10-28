/* tslint:disable:quotemark */
import { assert } from 'chai';
import { DETAIL, X, Y } from '../src/channel';
import * as log from '../src/log';
import { AREA, BAR, PRIMITIVE_MARKS, RECT } from '../src/mark';
import { ScaleType } from '../src/scale';
import { isStacked } from '../src/spec';
import { stack, STACK_BY_DEFAULT_MARKS, STACKABLE_MARKS } from '../src/stack';
describe('stack', function () {
    var NON_STACKABLE_MARKS = [RECT];
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
                data: { url: 'data/barley.json' },
                mark: mark,
                encoding: {
                    x: { field: 'yield', type: 'quantitative', stack: 'zero' },
                    y: { field: 'variety', type: 'nominal' },
                    color: { field: 'site', type: 'nominal' }
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
                data: { url: 'data/barley.json' },
                mark: mark,
                encoding: {
                    x: { field: 'yield', type: 'quantitative', stack: 'zero' },
                    y: { field: 'variety', type: 'quantitative' },
                    color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: mark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative', stack: stacked },
                        y: { field: 'variety', type: 'nominal' },
                        color: { aggregate: 'count', type: 'quantitative' },
                        detail: { field: 'site', type: 'nominal' }
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize', null, 'none']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_8(stacked);
        }
    });
    it('should always be disabled if there is both x and x2', function () {
        var _loop_9 = function (stacked) {
            var marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_9(stacked);
        }
    });
    it('should always be disabled if there is both y and y2', function () {
        var _loop_10 = function (stacked) {
            var marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
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
                assert.isNull(stack(spec.mark, spec.encoding, spec.config.stack));
                assert.isFalse(isStacked(spec));
            });
        };
        for (var _i = 0, _a = [undefined, 'center', 'zero', 'normalize']; _i < _a.length; _i++) {
            var stacked = _a[_i];
            _loop_10(stacked);
        }
    });
    it('should always be warned if the aggregated axis has non-linear scale', log.wrap(function (localLogger) {
        var _loop_11 = function (stacked) {
            [ScaleType.LOG, ScaleType.POW, ScaleType.SQRT].forEach(function (scaleType) {
                var marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        y: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        x: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        y: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        color: { field: 'site', type: 'nominal' }
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
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
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
//# sourceMappingURL=stack.test.js.map