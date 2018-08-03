"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var util_1 = require("./util");
util_1.selectionTypes.forEach(function (type) {
    var embed = util_1.embedFn(browser);
    var isInterval = type === 'interval';
    var hits = isInterval ? util_1.hits.interval : util_1.hits.discrete;
    var fn = isInterval ? util_1.brush : util_1.pt;
    describe(type + " selections at runtime", function () {
        util_1.compositeTypes.forEach(function (specType) {
            var testRender = util_1.testRenderFn(browser, type + "/" + specType);
            describe("in " + specType + " views", function () {
                // Loop through the views, click to add a selection instance.
                // Store size should stay constant, but unit names should vary.
                it('should have one global selection instance', function () {
                    var selection = tslib_1.__assign({ type: type, resolve: 'global' }, (specType === 'facet' ? { encodings: ['y'] } : {}));
                    for (var i = 0; i < hits[specType].length; i++) {
                        embed(util_1.spec(specType, i, selection));
                        var parent_1 = util_1.parentSelector(specType, i);
                        var store = browser.execute(fn(specType, i, parent_1)).value;
                        chai_1.assert.lengthOf(store, 1);
                        chai_1.assert.match(store[0].unit, util_1.unitNameRegex(specType, i));
                        testRender("global_" + i);
                        if (i === hits[specType].length - 1) {
                            var cleared = browser.execute(fn(specType + "_clear", 0, parent_1)).value;
                            chai_1.assert.lengthOf(cleared, 0);
                            testRender("global_clear_" + i);
                        }
                    }
                });
                util_1.resolutions.forEach(function (resolve) {
                    var selection = tslib_1.__assign({ type: type,
                        resolve: resolve }, (specType === 'facet' ? { encodings: ['x'] } : {}));
                    // Loop through the views, click to add selection instance and observe
                    // incrementing store size. Then, loop again but click to clear and
                    // observe decrementing store size. Check unit names in each case.
                    it("should have one selection instance per " + resolve + " view", function () {
                        embed(util_1.spec(specType, 0, selection));
                        for (var i = 0; i < hits[specType].length; i++) {
                            var parent_2 = util_1.parentSelector(specType, i);
                            var store = browser.execute(fn(specType, i, parent_2)).value;
                            chai_1.assert.lengthOf(store, i + 1);
                            chai_1.assert.match(store[i].unit, util_1.unitNameRegex(specType, i));
                            testRender(resolve + "_" + i);
                        }
                        embed(util_1.spec(specType, 1, { type: type, resolve: resolve, encodings: ['x'] }));
                        for (var i = 0; i < hits[specType].length; i++) {
                            var parent_3 = util_1.parentSelector(specType, i);
                            browser.execute(fn(specType, i, parent_3));
                        }
                        for (var i = hits[specType + "_clear"].length - 1; i >= 0; i--) {
                            var parent_4 = util_1.parentSelector(specType, i);
                            var store = browser.execute(fn(specType + "_clear", i, parent_4)).value;
                            chai_1.assert.lengthOf(store, i);
                            if (i > 0) {
                                chai_1.assert.match(store[i - 1].unit, util_1.unitNameRegex(specType, i - 1));
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