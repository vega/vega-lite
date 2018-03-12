"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
                    var selection = __assign({ type: type, resolve: 'global' }, (specType === 'facet' ? { encodings: ['y'] } : {}));
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
                    var selection = __assign({ type: type, resolve: resolve }, (specType === 'facet' ? { encodings: ['x'] } : {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC1ydW50aW1lL3Jlc29sdmUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNkJBQTRCO0FBQzVCLCtCQVlnQjtBQUVoQixxQkFBYyxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUk7SUFDbEMsSUFBTSxLQUFLLEdBQUcsY0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLElBQU0sVUFBVSxHQUFHLElBQUksS0FBSyxVQUFVLENBQUM7SUFDdkMsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFVLENBQUMsUUFBUSxDQUFDO0lBQ3BFLElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBSyxDQUFDLENBQUMsQ0FBQyxTQUFFLENBQUM7SUFFbkMsUUFBUSxDQUFJLElBQUksMkJBQXdCLEVBQUU7UUFDeEMscUJBQWMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRO1lBQ3RDLElBQU0sVUFBVSxHQUFHLG1CQUFZLENBQUMsT0FBTyxFQUFLLElBQUksU0FBSSxRQUFVLENBQUMsQ0FBQztZQUNoRSxRQUFRLENBQUMsUUFBTSxRQUFRLFdBQVEsRUFBRTtnQkFDL0IsNkRBQTZEO2dCQUM3RCwrREFBK0Q7Z0JBQy9ELEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtvQkFDOUMsSUFBTSxTQUFTLGNBQUksSUFBSSxNQUFBLEVBQUUsT0FBTyxFQUFFLFFBQVEsSUFDckMsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRXRELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFB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QUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7XG4gIGJydXNoLFxuICBjb21wb3NpdGVUeXBlcyxcbiAgZW1iZWRGbixcbiAgaGl0cyBhcyBoaXRzTWFzdGVyLFxuICBwYXJlbnRTZWxlY3RvcixcbiAgcHQsXG4gIHJlc29sdXRpb25zLFxuICBzZWxlY3Rpb25UeXBlcyxcbiAgc3BlYyxcbiAgdGVzdFJlbmRlckZuLFxuICB1bml0TmFtZVJlZ2V4LFxufSBmcm9tICcuL3V0aWwnO1xuXG5zZWxlY3Rpb25UeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUpIHtcbiAgY29uc3QgZW1iZWQgPSBlbWJlZEZuKGJyb3dzZXIpO1xuICBjb25zdCBpc0ludGVydmFsID0gdHlwZSA9PT0gJ2ludGVydmFsJztcbiAgY29uc3QgaGl0cyA9IGlzSW50ZXJ2YWwgPyBoaXRzTWFzdGVyLmludGVydmFsIDogaGl0c01hc3Rlci5kaXNjcmV0ZTtcbiAgY29uc3QgZm4gPSBpc0ludGVydmFsID8gYnJ1c2ggOiBwdDtcblxuICBkZXNjcmliZShgJHt0eXBlfSBzZWxlY3Rpb25zIGF0IHJ1bnRpbWVgLCBmdW5jdGlvbigpIHtcbiAgICBjb21wb3NpdGVUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uKHNwZWNUeXBlKSB7XG4gICAgICBjb25zdCB0ZXN0UmVuZGVyID0gdGVzdFJlbmRlckZuKGJyb3dzZXIsIGAke3R5cGV9LyR7c3BlY1R5cGV9YCk7XG4gICAgICBkZXNjcmliZShgaW4gJHtzcGVjVHlwZX0gdmlld3NgLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSB2aWV3cywgY2xpY2sgdG8gYWRkIGEgc2VsZWN0aW9uIGluc3RhbmNlLlxuICAgICAgICAvLyBTdG9yZSBzaXplIHNob3VsZCBzdGF5IGNvbnN0YW50LCBidXQgdW5pdCBuYW1lcyBzaG91bGQgdmFyeS5cbiAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIG9uZSBnbG9iYWwgc2VsZWN0aW9uIGluc3RhbmNlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0ge3R5cGUsIHJlc29sdmU6ICdnbG9iYWwnLFxuICAgICAgICAgICAgLi4uKHNwZWNUeXBlID09PSAnZmFjZXQnID8ge2VuY29kaW5nczogWyd5J119OiB7fSl9O1xuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoaXRzW3NwZWNUeXBlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZW1iZWQoc3BlYyhzcGVjVHlwZSwgaSwgc2VsZWN0aW9uKSk7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBwYXJlbnRTZWxlY3RvcihzcGVjVHlwZSwgaSk7XG4gICAgICAgICAgICBjb25zdCBzdG9yZSA9IGJyb3dzZXIuZXhlY3V0ZShmbihzcGVjVHlwZSwgaSwgcGFyZW50KSkudmFsdWU7XG4gICAgICAgICAgICBhc3NlcnQubGVuZ3RoT2Yoc3RvcmUsIDEpO1xuICAgICAgICAgICAgYXNzZXJ0Lm1hdGNoKHN0b3JlWzBdLnVuaXQsIHVuaXROYW1lUmVnZXgoc3BlY1R5cGUsIGkpKTtcbiAgICAgICAgICAgIHRlc3RSZW5kZXIoYGdsb2JhbF8ke2l9YCk7XG5cbiAgICAgICAgICAgIGlmIChpID09PSBoaXRzW3NwZWNUeXBlXS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNsZWFyZWQgPSBicm93c2VyLmV4ZWN1dGUoZm4oYCR7c3BlY1R5cGV9X2NsZWFyYCwgMCwgcGFyZW50KSkudmFsdWU7XG4gICAgICAgICAgICAgIGFzc2VydC5sZW5ndGhPZihjbGVhcmVkLCAwKTtcbiAgICAgICAgICAgICAgdGVzdFJlbmRlcihgZ2xvYmFsX2NsZWFyXyR7aX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdXRpb25zLmZvckVhY2goZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHt0eXBlLCByZXNvbHZlLFxuICAgICAgICAgICAgLi4uKHNwZWNUeXBlID09PSAnZmFjZXQnID8ge2VuY29kaW5nczogWyd4J119OiB7fSl9O1xuXG4gICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSB2aWV3cywgY2xpY2sgdG8gYWRkIHNlbGVjdGlvbiBpbnN0YW5jZSBhbmQgb2JzZXJ2ZVxuICAgICAgICAgIC8vIGluY3JlbWVudGluZyBzdG9yZSBzaXplLiBUaGVuLCBsb29wIGFnYWluIGJ1dCBjbGljayB0byBjbGVhciBhbmRcbiAgICAgICAgICAvLyBvYnNlcnZlIGRlY3JlbWVudGluZyBzdG9yZSBzaXplLiBDaGVjayB1bml0IG5hbWVzIGluIGVhY2ggY2FzZS5cbiAgICAgICAgICBpdChgc2hvdWxkIGhhdmUgb25lIHNlbGVjdGlvbiBpbnN0YW5jZSBwZXIgJHtyZXNvbHZlfSB2aWV3YCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBlbWJlZChzcGVjKHNwZWNUeXBlLCAwLCBzZWxlY3Rpb24pKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGl0c1tzcGVjVHlwZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gcGFyZW50U2VsZWN0b3Ioc3BlY1R5cGUsIGkpO1xuICAgICAgICAgICAgICBjb25zdCBzdG9yZSA9IGJyb3dzZXIuZXhlY3V0ZShmbihzcGVjVHlwZSwgaSwgcGFyZW50KSkudmFsdWU7XG4gICAgICAgICAgICAgIGFzc2VydC5sZW5ndGhPZihzdG9yZSwgaSArIDEpO1xuICAgICAgICAgICAgICBhc3NlcnQubWF0Y2goc3RvcmVbaV0udW5pdCwgdW5pdE5hbWVSZWdleChzcGVjVHlwZSwgaSkpO1xuICAgICAgICAgICAgICB0ZXN0UmVuZGVyKGAke3Jlc29sdmV9XyR7aX1gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZW1iZWQoc3BlYyhzcGVjVHlwZSwgMSwge3R5cGUsIHJlc29sdmUsIGVuY29kaW5nczogWyd4J119KSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhpdHNbc3BlY1R5cGVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHBhcmVudFNlbGVjdG9yKHNwZWNUeXBlLCBpKTtcbiAgICAgICAgICAgICAgYnJvd3Nlci5leGVjdXRlKGZuKHNwZWNUeXBlLCBpLCBwYXJlbnQpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGhpdHNbYCR7c3BlY1R5cGV9X2NsZWFyYF0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gcGFyZW50U2VsZWN0b3Ioc3BlY1R5cGUsIGkpO1xuICAgICAgICAgICAgICBjb25zdCBzdG9yZSA9IGJyb3dzZXIuZXhlY3V0ZShmbihgJHtzcGVjVHlwZX1fY2xlYXJgLCBpLCBwYXJlbnQpKS52YWx1ZTtcbiAgICAgICAgICAgICAgYXNzZXJ0Lmxlbmd0aE9mKHN0b3JlLCBpKTtcbiAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0Lm1hdGNoKHN0b3JlW2kgLSAxXS51bml0LCB1bml0TmFtZVJlZ2V4KHNwZWNUeXBlLCBpIC0gMSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRlc3RSZW5kZXIoYCR7cmVzb2x2ZX1fY2xlYXJfJHtpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19