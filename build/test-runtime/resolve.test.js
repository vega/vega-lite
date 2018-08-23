import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { brush, compositeTypes, embedFn, hits as hitsMaster, parentSelector, pt, resolutions, selectionTypes, spec, testRenderFn, unitNameRegex } from './util';
selectionTypes.forEach(function (type) {
    var embed = embedFn(browser);
    var isInterval = type === 'interval';
    var hits = isInterval ? hitsMaster.interval : hitsMaster.discrete;
    var fn = isInterval ? brush : pt;
    describe(type + " selections at runtime", function () {
        compositeTypes.forEach(function (specType) {
            var testRender = testRenderFn(browser, type + "/" + specType);
            describe("in " + specType + " views", function () {
                // Loop through the views, click to add a selection instance.
                // Store size should stay constant, but unit names should vary.
                it('should have one global selection instance', function () {
                    var selection = tslib_1.__assign({ type: type, resolve: 'global' }, (specType === 'facet' ? { encodings: ['y'] } : {}));
                    for (var i = 0; i < hits[specType].length; i++) {
                        embed(spec(specType, i, selection));
                        var parent_1 = parentSelector(specType, i);
                        var store = browser.execute(fn(specType, i, parent_1)).value;
                        assert.lengthOf(store, 1);
                        assert.match(store[0].unit, unitNameRegex(specType, i));
                        testRender("global_" + i);
                        if (i === hits[specType].length - 1) {
                            var cleared = browser.execute(fn(specType + "_clear", 0, parent_1)).value;
                            assert.lengthOf(cleared, 0);
                            testRender("global_clear_" + i);
                        }
                    }
                });
                resolutions.forEach(function (resolve) {
                    var selection = tslib_1.__assign({ type: type,
                        resolve: resolve }, (specType === 'facet' ? { encodings: ['x'] } : {}));
                    // Loop through the views, click to add selection instance and observe
                    // incrementing store size. Then, loop again but click to clear and
                    // observe decrementing store size. Check unit names in each case.
                    it("should have one selection instance per " + resolve + " view", function () {
                        embed(spec(specType, 0, selection));
                        for (var i = 0; i < hits[specType].length; i++) {
                            var parent_2 = parentSelector(specType, i);
                            var store = browser.execute(fn(specType, i, parent_2)).value;
                            assert.lengthOf(store, i + 1);
                            assert.match(store[i].unit, unitNameRegex(specType, i));
                            testRender(resolve + "_" + i);
                        }
                        embed(spec(specType, 1, { type: type, resolve: resolve, encodings: ['x'] }));
                        for (var i = 0; i < hits[specType].length; i++) {
                            var parent_3 = parentSelector(specType, i);
                            browser.execute(fn(specType, i, parent_3));
                        }
                        for (var i = hits[specType + "_clear"].length - 1; i >= 0; i--) {
                            var parent_4 = parentSelector(specType, i);
                            var store = browser.execute(fn(specType + "_clear", i, parent_4)).value;
                            assert.lengthOf(store, i);
                            if (i > 0) {
                                assert.match(store[i - 1].unit, unitNameRegex(specType, i - 1));
                            }
                            testRender(resolve + "_clear_" + i);
                        }
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=resolve.test.js.map