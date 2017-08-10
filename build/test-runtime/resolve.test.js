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
                    var selection = tslib_1.__assign({ type: type, resolve: resolve }, (specType === 'facet' ? { encodings: ['x'] } : {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC1ydW50aW1lL3Jlc29sdmUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNEI7QUFDNUIsK0JBWWdCO0FBRWhCLHFCQUFjLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSTtJQUNsQyxJQUFNLEtBQUssR0FBRyxjQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsSUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLFVBQVUsQ0FBQztJQUN2QyxJQUFNLElBQUksR0FBRyxVQUFVLEdBQUcsV0FBVSxDQUFDLFFBQVEsR0FBRyxXQUFVLENBQUMsUUFBUSxDQUFDO0lBQ3BFLElBQU0sRUFBRSxHQUFHLFVBQVUsR0FBRyxZQUFLLEdBQUcsU0FBRSxDQUFDO0lBRW5DLFFBQVEsQ0FBSSxJQUFJLDJCQUF3QixFQUFFO1FBQ3hDLHFCQUFjLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUTtZQUN0QyxJQUFNLFVBQVUsR0FBRyxtQkFBWSxDQUFDLE9BQU8sRUFBSyxJQUFJLFNBQUksUUFBVSxDQUFDLENBQUM7WUFDaEUsUUFBUSxDQUFDLFFBQU0sUUFBUSxXQUFRLEVBQUU7Z0JBQy9CLDZEQUE2RDtnQkFDN0QsK0RBQStEO2dCQUMvRCxFQUFFLENBQUMsMkNBQTJDLEVBQUU7b0JBQzlDLElBQU0sU0FBUyxzQkFBSSxJQUFJLE1BQUEsRUFBRSxPQUFPLEVBQUUsUUFBUSxJQUNyQyxDQUFDLFFBQVEsS0FBSyxPQUFPLEdBQUcsRUFBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQyxHQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRXRELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUMvQyxLQUFLLENBQUMsV0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsSUFBTSxRQUFNLEdBQUcscUJBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzNDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsUUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7d0JBQzdELGFBQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsb0JBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDeEQsVUFBVSxDQUFDLFlBQVUsQ0FBRyxDQUFDLENBQUM7d0JBRTFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3BDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFJLFFBQVEsV0FBUSxFQUFFLENBQUMsRUFBRSxRQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs0QkFDMUUsYUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQzVCLFVBQVUsQ0FBQyxrQkFBZ0IsQ0FBRyxDQUFDLENBQUM7d0JBQ2xDLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFFSCxrQkFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFTLE9BQU87b0JBQ2xDLElBQU0sU0FBUyxzQkFBSSxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsSUFDM0IsQ0FBQyxRQUFRLEtBQUssT0FBTyxHQUFHLEVBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUV0RCxzRUFBc0U7b0JBQ3RFLG1FQUFtRTtvQkFDbkUsa0VBQWtFO29CQUNsRSxFQUFFLENBQUMsNENBQTBDLE9BQU8sVUFBTyxFQUFFO3dCQUMzRCxLQUFLLENBQUMsV0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7NEJBQy9DLElBQU0sUUFBTSxHQUFHLHFCQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDOzRCQUMzQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDOzRCQUM3RCxhQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQzlCLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxvQkFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN4RCxVQUFVLENBQUksT0FBTyxTQUFJLENBQUcsQ0FBQyxDQUFDO3dCQUNoQyxDQUFDO3dCQUVELEtBQUssQ0FBQyxXQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFDLElBQUksTUFBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDL0MsSUFBTSxRQUFNLEdBQUcscUJBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsUUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDM0MsQ0FBQzt3QkFFRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUksUUFBUSxXQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDL0QsSUFBTSxRQUFNLEdBQUcscUJBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFJLFFBQVEsV0FBUSxFQUFFLENBQUMsRUFBRSxRQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs0QkFDeEUsYUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNWLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsb0JBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xFLENBQUM7NEJBQ0QsVUFBVSxDQUFJLE9BQU8sZUFBVSxDQUFHLENBQUMsQ0FBQzt3QkFDdEMsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=