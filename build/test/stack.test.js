/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../src/log");
var channel_1 = require("../src/channel");
var mark_1 = require("../src/mark");
var scale_1 = require("../src/scale");
var stack_1 = require("../src/stack");
var spec_1 = require("../src/spec");
describe('stack', function () {
    var NON_STACKABLE_MARKS = [mark_1.RECT];
    it('should be disabled for non-stackable marks with at least of of the stack channel', function () {
        [undefined, 'center', 'none', 'zero', 'normalize'].forEach(function (stacked) {
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
        });
    });
    it('should always be disabled for raw plot', function () {
        [undefined, 'center', 'none', 'zero', 'normalize'].forEach(function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "field": "yield", "type": "quantitative" },
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
        });
    });
    it('should always be disabled if there is no stackby channel', function () {
        [undefined, 'center', 'none', 'zero', 'normalize'].forEach(function (stacked) {
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
        });
    });
    it('should always be disabled if the stackby channel is aggregated', function () {
        [undefined, 'center', 'none', 'zero', 'normalize'].forEach(function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "aggregate": "count", "field": "*", "type": "quantitative" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        });
    });
    it('can enabled if one of the stackby channels is not aggregated', function () {
        [undefined, 'center', 'zero', 'normalize'].forEach(function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "aggregate": "count", "field": "*", "type": "quantitative" },
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
        });
    });
    it('can enabled if one of the stackby channels is not aggregated', function () {
        [undefined, 'center', 'zero', 'normalize'].forEach(function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative", "stack": stacked },
                        "y": { "field": "variety", "type": "nominal" },
                        "color": { "aggregate": "count", "field": "*", "type": "quantitative" },
                        "detail": { "field": "site", "type": "nominal" }
                    }
                };
                var _stack = stack_1.stack(spec.mark, spec.encoding, undefined);
                chai_1.assert.isOk(_stack);
                chai_1.assert.isTrue(spec_1.isStacked(spec));
                chai_1.assert.equal(_stack.stackBy[0].channel, channel_1.DETAIL);
            });
        });
    });
    it('should always be disabled if both x and y are aggregate', function () {
        [undefined, 'center', 'none', 'zero', 'normalize'].forEach(function (stacked) {
            mark_1.PRIMITIVE_MARKS.forEach(function (mark) {
                var spec = {
                    "data": { "url": "data/barley.json" },
                    "mark": mark,
                    "encoding": {
                        "x": { "aggregate": "sum", "field": "yield", "type": "quantitative" },
                        "y": { "aggregate": "count", "field": "*", "type": "quantitative" },
                        "color": { "field": "site", "type": "nominal" }
                    },
                    "config": {
                        "stack": stacked
                    }
                };
                chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                chai_1.assert.isFalse(spec_1.isStacked(spec));
            });
        });
    });
    it('should always be disabled if neither x nor y is aggregate', function () {
        [undefined, 'center', 'none', 'zero', 'normalize'].forEach(function (stacked) {
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
        });
    });
    it('should always be disabled if there is both x and x2  ', function () {
        [undefined, 'center', 'zero', 'normalize'].forEach(function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                log.runLocalLogger(function (localLogger) {
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
                    chai_1.assert.equal(localLogger.warns[0], log.message.cannotStackRangedMark(channel_1.X), JSON.stringify({ stacked: stacked, mark: mark }));
                });
            });
        });
    });
    it('should always be disabled if there is both y and y2  ', function () {
        [undefined, 'center', 'zero', 'normalize'].forEach(function (stacked) {
            var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
            marks.forEach(function (mark) {
                log.runLocalLogger(function (localLogger) {
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
                    chai_1.assert.equal(localLogger.warns[0], log.message.cannotStackRangedMark(channel_1.Y), JSON.stringify({ stacked: stacked, mark: mark }));
                });
            });
        });
    });
    it('should always be disabled if the aggregated axis has non-linear scale', function () {
        [undefined, 'center', 'zero', 'normalize'].forEach(function (stacked) {
            [scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT].forEach(function (scaleType) {
                var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
                marks.forEach(function (mark) {
                    log.runLocalLogger(function (localLogger) {
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
                        chai_1.assert.equal(localLogger.warns[0], log.message.cannotStackNonLinearScale(scaleType));
                    });
                });
            });
        });
    });
    it('should always be disabled if the aggregated axis has non-summative aggregate', function () {
        [undefined, 'center', 'zero', 'normalize'].forEach(function (stacked) {
            ['average', 'variance', 'q3'].forEach(function (aggregate) {
                var marks = stacked === undefined ? stack_1.STACK_BY_DEFAULT_MARKS : stack_1.STACKABLE_MARKS;
                marks.forEach(function (mark) {
                    log.runLocalLogger(function (localLogger) {
                        var spec = {
                            "data": { "url": "data/barley.json" },
                            "mark": mark,
                            "encoding": {
                                "x": { "field": "a", "type": "quantitative", "aggregate": aggregate },
                                "y": { "field": "variety", "type": "nominal" },
                                "color": { "field": "site", "type": "nominal" }
                            },
                            "config": {
                                "stack": stacked
                            }
                        };
                        chai_1.assert.isNull(stack_1.stack(spec.mark, spec.encoding, spec.config.stack));
                        chai_1.assert.isFalse(spec_1.isStacked(spec));
                        chai_1.assert.equal(localLogger.warns[0], log.message.cannotStackNonSummativeAggregate(aggregate));
                    });
                });
            });
        });
    });
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
            ['center', 'zero', 'normalize'].forEach(function (stacked) {
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
            });
        });
    });
});
//# sourceMappingURL=stack.test.js.map