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
                        "color": { "aggregate": "count", "type": "quantitative" }
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
                        "color": { "aggregate": "count", "type": "quantitative" },
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
    it('should always be disabled if there is both x and x2', function () {
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
    it('should always be disabled if there is both y and y2', function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2sudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFFNUIsZ0NBQWtDO0FBR2xDLDBDQUE0QztBQUM1QyxvQ0FBNkQ7QUFDN0Qsc0NBQXVDO0FBQ3ZDLHNDQUF5RjtBQUN6RixvQ0FBZ0Q7QUFFaEQsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixJQUFNLG1CQUFtQixHQUFHLENBQUMsV0FBSSxDQUFDLENBQUM7SUFFbkMsRUFBRSxDQUFDLGtGQUFrRixFQUFFO1FBQ3JGLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQW9CO1lBQzlFLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFDLGdCQUFnQjtnQkFDM0MsSUFBTSxJQUFJLEdBQWE7b0JBQ3JCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztvQkFDbkMsTUFBTSxFQUFFLGdCQUFnQjtvQkFDeEIsVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO3dCQUNuRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7d0JBQzVDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztxQkFDOUM7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLE9BQU8sRUFBRSxPQUFPO3FCQUNqQjtpQkFDRixDQUFDO2dCQUNGLGFBQU0sQ0FBQyxNQUFNLENBQUMsYUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENB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