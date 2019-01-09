import { DETAIL, X, Y } from '../src/channel';
import * as log from '../src/log';
import { AREA, BAR, PRIMITIVE_MARKS, RECT } from '../src/mark';
import { ScaleType } from '../src/scale';
import { isStacked } from '../src/spec';
import { stack, STACK_BY_DEFAULT_MARKS, STACKABLE_MARKS } from '../src/stack';
describe('stack', () => {
    const NON_STACKABLE_MARKS = [RECT];
    it('should be disabled for non-stackable marks with at least of of the stack channel', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none']) {
            NON_STACKABLE_MARKS.forEach(nonStackableMark => {
                const spec = {
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
                expect(stack(spec.mark, spec.encoding, spec.config.stack)).toBeNull();
                expect(isStacked(spec)).toBe(false);
            });
        }
    });
    it('should be allowed for raw plot', () => {
        STACKABLE_MARKS.forEach(mark => {
            const spec = {
                data: { url: 'data/barley.json' },
                mark: mark,
                encoding: {
                    x: { field: 'yield', type: 'quantitative', stack: 'zero' },
                    y: { field: 'variety', type: 'nominal' },
                    color: { field: 'site', type: 'nominal' }
                }
            };
            const stackProps = stack(spec.mark, spec.encoding, undefined);
            expect(stackProps.fieldChannel).toEqual('x');
            expect(isStacked(spec)).toBe(true);
        });
    });
    it('should prioritize axis with stack', () => {
        STACKABLE_MARKS.forEach(mark => {
            const spec = {
                data: { url: 'data/barley.json' },
                mark: mark,
                encoding: {
                    x: { field: 'yield', type: 'quantitative', stack: 'zero' },
                    y: { field: 'variety', type: 'quantitative' },
                    color: { field: 'site', type: 'nominal' }
                }
            };
            const stackProps = stack(spec.mark, spec.encoding, undefined);
            expect(stackProps.fieldChannel).toEqual('x');
            expect(isStacked(spec)).toBe(true);
        });
    });
    it('should always be disabled if there is no stackby channel', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none']) {
            PRIMITIVE_MARKS.forEach(mark => {
                const spec = {
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
                expect(stack(spec.mark, spec.encoding, spec.config.stack)).toBeNull();
                expect(isStacked(spec)).toBe(false);
            });
        }
    });
    it('should always be disabled if the stackby channel is aggregated', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none']) {
            PRIMITIVE_MARKS.forEach(mark => {
                const spec = {
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
                expect(stack(spec.mark, spec.encoding, spec.config.stack)).toBeNull();
                expect(isStacked(spec)).toBe(false);
            });
        }
    });
    it('should always be disabled if the stackby channel is identical to y', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none']) {
            PRIMITIVE_MARKS.forEach(mark => {
                const spec = {
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
                expect(stack(spec.mark, spec.encoding, spec.config.stack)).toBeNull();
                expect(isStacked(spec)).toBe(false);
            });
        }
    });
    it('can enabled if one of the stackby channels is not aggregated', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize']) {
            const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
            marks.forEach(mark => {
                const spec = {
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
                const _stack = stack(spec.mark, spec.encoding, spec.config.stack);
                expect(_stack).toBeTruthy();
                expect(isStacked(spec)).toBe(true);
                expect(_stack.stackBy[0].channel).toEqual(DETAIL);
            });
        }
    });
    it('can enabled if one of the stackby channels is not aggregated', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize']) {
            const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
            marks.forEach(mark => {
                const spec = {
                    data: { url: 'data/barley.json' },
                    mark: mark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative', stack: stacked },
                        y: { field: 'variety', type: 'nominal' },
                        color: { aggregate: 'count', type: 'quantitative' },
                        detail: { field: 'site', type: 'nominal' }
                    }
                };
                const _stack = stack(spec.mark, spec.encoding, undefined);
                expect(_stack).toBeTruthy();
                expect(isStacked(spec)).toBe(true);
                expect(_stack.stackBy[0].channel).toEqual(DETAIL);
            });
        }
    });
    it('should always be disabled if both x and y are aggregate', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none']) {
            PRIMITIVE_MARKS.forEach(mark => {
                const spec = {
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
                expect(stack(spec.mark, spec.encoding, spec.config.stack)).toBeNull();
                expect(isStacked(spec)).toBe(false);
            });
        }
    });
    it('should always be disabled if neither x nor y is aggregate or stack', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize', null, 'none']) {
            PRIMITIVE_MARKS.forEach(mark => {
                const spec = {
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
                expect(stack(spec.mark, spec.encoding, spec.config.stack)).toBeNull();
                expect(isStacked(spec)).toBe(false);
            });
        }
    });
    it('should always be disabled if there is both x and x2', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize']) {
            const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
            marks.forEach(mark => {
                const spec = {
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
                expect(stack(spec.mark, spec.encoding, spec.config.stack)).toBeNull();
                expect(isStacked(spec)).toBe(false);
            });
        }
    });
    it('should always be disabled if there is both y and y2', () => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize']) {
            const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
            marks.forEach(mark => {
                const spec = {
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
                expect(stack(spec.mark, spec.encoding, spec.config.stack)).toBeNull();
                expect(isStacked(spec)).toBe(false);
            });
        }
    });
    it('should always be warned if the aggregated axis has non-linear scale', log.wrap(localLogger => {
        for (const stacked of [undefined, 'center', 'zero', 'normalize']) {
            [ScaleType.LOG, ScaleType.POW, ScaleType.SQRT].forEach(scaleType => {
                const marks = stacked === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
                marks.forEach(mark => {
                    const spec = {
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
                    expect(stack(spec.mark, spec.encoding, spec.config.stack)).not.toBeNull();
                    expect(isStacked(spec)).toBe(true);
                    const warns = localLogger.warns;
                    expect(warns[warns.length - 1]).toEqual(log.message.cannotStackNonLinearScale(scaleType));
                });
            });
        }
    }));
    it('should throws warning if the aggregated axis has a non-summative aggregate', log.wrap(localLogger => {
        for (const stackOffset of [undefined, 'center', 'zero', 'normalize']) {
            for (const aggregate of ['average', 'variance', 'q3']) {
                const marks = stackOffset === undefined ? STACK_BY_DEFAULT_MARKS : STACKABLE_MARKS;
                marks.forEach(mark => {
                    const spec = {
                        data: { url: 'data/barley.json' },
                        mark: mark,
                        encoding: {
                            x: {
                                aggregate,
                                stack: stackOffset,
                                field: 'a',
                                type: 'quantitative'
                            },
                            y: { field: 'variety', type: 'nominal' },
                            color: { field: 'site', type: 'nominal' }
                        }
                    };
                    expect(isStacked(spec)).toBe(true);
                    const warns = localLogger.warns;
                    expect(warns[warns.length - 1]).toEqual(log.message.stackNonSummativeAggregate(aggregate));
                });
            }
        }
    }));
    describe('stack().groupbyChannel, .fieldChannel', () => {
        it('should be correct for horizontal', () => {
            [BAR, AREA].forEach(stackableMark => {
                const spec = {
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
                    }
                };
                const _stack = stack(spec.mark, spec.encoding, undefined);
                expect(_stack.fieldChannel).toBe(X);
                expect(_stack.groupbyChannel).toBe(Y);
                expect(isStacked(spec)).toBe(true);
            });
        });
        it('should be correct for horizontal (single)', () => {
            [BAR, AREA].forEach(stackableMark => {
                const spec = {
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        color: { field: 'site', type: 'nominal' }
                    }
                };
                const _stack = stack(spec.mark, spec.encoding, undefined);
                expect(_stack.fieldChannel).toBe(X);
                expect(_stack.groupbyChannel).toBeUndefined();
                expect(isStacked(spec)).toBe(true);
            });
        });
        it('should be correct for vertical', () => {
            [BAR, AREA].forEach(stackableMark => {
                const spec = {
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        y: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        x: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
                    }
                };
                const _stack = stack(spec.mark, spec.encoding, undefined);
                expect(_stack.fieldChannel).toBe(Y);
                expect(_stack.groupbyChannel).toBe(X);
                expect(isStacked(spec)).toBe(true);
            });
        });
        it('should be correct for vertical (single)', () => {
            [BAR, AREA].forEach(stackableMark => {
                const spec = {
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        y: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        color: { field: 'site', type: 'nominal' }
                    }
                };
                const _stack = stack(spec.mark, spec.encoding, undefined);
                expect(_stack.fieldChannel).toBe(Y);
                expect(_stack.groupbyChannel).toBeUndefined();
                expect(isStacked(spec)).toBe(true);
            });
        });
    });
    describe('stack().offset', () => {
        it('should be zero for stackable marks with at least of of the stack channel if stacked is unspecified', () => {
            [BAR, AREA].forEach(stackableMark => {
                const spec = {
                    data: { url: 'data/barley.json' },
                    mark: stackableMark,
                    encoding: {
                        x: { aggregate: 'sum', field: 'yield', type: 'quantitative' },
                        y: { field: 'variety', type: 'nominal' },
                        color: { field: 'site', type: 'nominal' }
                    }
                };
                expect(stack(spec.mark, spec.encoding, undefined).offset).toBe('zero');
                expect(isStacked(spec)).toBe(true);
            });
        });
        it('should be the specified stacked for stackable marks with at least one of the stack channel', () => {
            for (const stacked of ['center', 'zero', 'normalize']) {
                [BAR, AREA].forEach(stackableMark => {
                    const spec = {
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
                    expect(stack(spec.mark, spec.encoding, spec.config.stack).offset).toEqual(stacked);
                    expect(isStacked(spec)).toBe(true);
                });
            }
        });
    });
});
//# sourceMappingURL=stack.test.js.map