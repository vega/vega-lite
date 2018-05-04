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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC1ydW50aW1lL3Jlc29sdmUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNkJBQTRCO0FBQzVCLCtCQVlnQjtBQUVoQixxQkFBYyxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUk7SUFDbEMsSUFBTSxLQUFLLEdBQUcsY0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLElBQU0sVUFBVSxHQUFHLElBQUksS0FBSyxVQUFVLENBQUM7SUFDdkMsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFVLENBQUMsUUFBUSxDQUFDO0lBQ3BFLElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsWUFBSyxDQUFDLENBQUMsQ0FBQyxTQUFFLENBQUM7SUFFbkMsUUFBUSxDQUFJLElBQUksMkJBQXdCLEVBQUU7UUFDeEMscUJBQWMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRO1lBQ3RDLElBQU0sVUFBVSxHQUFHLG1CQUFZLENBQUMsT0FBTyxFQUFLLElBQUksU0FBSSxRQUFVLENBQUMsQ0FBQztZQUNoRSxRQUFRLENBQUMsUUFBTSxRQUFRLFdBQVEsRUFBRTtnQkFDL0IsNkRBQTZEO2dCQUM3RCwrREFBK0Q7Z0JBQy9ELEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtvQkFDOUMsSUFBTSxTQUFTLGNBQUksSUFBSSxNQUFBLEVBQUUsT0FBTyxFQUFFLFFBQVEsSUFDckMsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRXRELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFB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QUFNLFFBQU0sR0FBRyxxQkFBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDM0MsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxRQUFNLENBQUMsQ0FBQyxDQUFDO3lCQUMxQzt3QkFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBSSxRQUFRLFdBQVEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDOUQsSUFBTSxRQUFNLEdBQUcscUJBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFJLFFBQVEsV0FBUSxFQUFFLENBQUMsRUFBRSxRQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzs0QkFDeEUsYUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQ0FDVCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLG9CQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUNqRTs0QkFDRCxVQUFVLENBQUksT0FBTyxlQUFVLENBQUcsQ0FBQyxDQUFDO3lCQUNyQztvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtcbiAgYnJ1c2gsXG4gIGNvbXBvc2l0ZVR5cGVzLFxuICBlbWJlZEZuLFxuICBoaXRzIGFzIGhpdHNNYXN0ZXIsXG4gIHBhcmVudFNlbGVjdG9yLFxuICBwdCxcbiAgcmVzb2x1dGlvbnMsXG4gIHNlbGVjdGlvblR5cGVzLFxuICBzcGVjLFxuICB0ZXN0UmVuZGVyRm4sXG4gIHVuaXROYW1lUmVnZXgsXG59IGZyb20gJy4vdXRpbCc7XG5cbnNlbGVjdGlvblR5cGVzLmZvckVhY2goZnVuY3Rpb24odHlwZSkge1xuICBjb25zdCBlbWJlZCA9IGVtYmVkRm4oYnJvd3Nlcik7XG4gIGNvbnN0IGlzSW50ZXJ2YWwgPSB0eXBlID09PSAnaW50ZXJ2YWwnO1xuICBjb25zdCBoaXRzID0gaXNJbnRlcnZhbCA/IGhpdHNNYXN0ZXIuaW50ZXJ2YWwgOiBoaXRzTWFzdGVyLmRpc2NyZXRlO1xuICBjb25zdCBmbiA9IGlzSW50ZXJ2YWwgPyBicnVzaCA6IHB0O1xuXG4gIGRlc2NyaWJlKGAke3R5cGV9IHNlbGVjdGlvbnMgYXQgcnVudGltZWAsIGZ1bmN0aW9uKCkge1xuICAgIGNvbXBvc2l0ZVR5cGVzLmZvckVhY2goZnVuY3Rpb24oc3BlY1R5cGUpIHtcbiAgICAgIGNvbnN0IHRlc3RSZW5kZXIgPSB0ZXN0UmVuZGVyRm4oYnJvd3NlciwgYCR7dHlwZX0vJHtzcGVjVHlwZX1gKTtcbiAgICAgIGRlc2NyaWJlKGBpbiAke3NwZWNUeXBlfSB2aWV3c2AsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIHZpZXdzLCBjbGljayB0byBhZGQgYSBzZWxlY3Rpb24gaW5zdGFuY2UuXG4gICAgICAgIC8vIFN0b3JlIHNpemUgc2hvdWxkIHN0YXkgY29uc3RhbnQsIGJ1dCB1bml0IG5hbWVzIHNob3VsZCB2YXJ5LlxuICAgICAgICBpdCgnc2hvdWxkIGhhdmUgb25lIGdsb2JhbCBzZWxlY3Rpb24gaW5zdGFuY2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSB7dHlwZSwgcmVzb2x2ZTogJ2dsb2JhbCcsXG4gICAgICAgICAgICAuLi4oc3BlY1R5cGUgPT09ICdmYWNldCcgPyB7ZW5jb2RpbmdzOiBbJ3knXX06IHt9KX07XG5cbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhpdHNbc3BlY1R5cGVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBlbWJlZChzcGVjKHNwZWNUeXBlLCBpLCBzZWxlY3Rpb24pKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHBhcmVudFNlbGVjdG9yKHNwZWNUeXBlLCBpKTtcbiAgICAgICAgICAgIGNvbnN0IHN0b3JlID0gYnJvd3Nlci5leGVjdXRlKGZuKHNwZWNUeXBlLCBpLCBwYXJlbnQpKS52YWx1ZTtcbiAgICAgICAgICAgIGFzc2VydC5sZW5ndGhPZihzdG9yZSwgMSk7XG4gICAgICAgICAgICBhc3NlcnQubWF0Y2goc3RvcmVbMF0udW5pdCwgdW5pdE5hbWVSZWdleChzcGVjVHlwZSwgaSkpO1xuICAgICAgICAgICAgdGVzdFJlbmRlcihgZ2xvYmFsXyR7aX1gKTtcblxuICAgICAgICAgICAgaWYgKGkgPT09IGhpdHNbc3BlY1R5cGVdLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgY29uc3QgY2xlYXJlZCA9IGJyb3dzZXIuZXhlY3V0ZShmbihgJHtzcGVjVHlwZX1fY2xlYXJgLCAwLCBwYXJlbnQpKS52YWx1ZTtcbiAgICAgICAgICAgICAgYXNzZXJ0Lmxlbmd0aE9mKGNsZWFyZWQsIDApO1xuICAgICAgICAgICAgICB0ZXN0UmVuZGVyKGBnbG9iYWxfY2xlYXJfJHtpfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzb2x1dGlvbnMuZm9yRWFjaChmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0ge3R5cGUsIHJlc29sdmUsXG4gICAgICAgICAgICAuLi4oc3BlY1R5cGUgPT09ICdmYWNldCcgPyB7ZW5jb2RpbmdzOiBbJ3gnXX06IHt9KX07XG5cbiAgICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIHZpZXdzLCBjbGljayB0byBhZGQgc2VsZWN0aW9uIGluc3RhbmNlIGFuZCBvYnNlcnZlXG4gICAgICAgICAgLy8gaW5jcmVtZW50aW5nIHN0b3JlIHNpemUuIFRoZW4sIGxvb3AgYWdhaW4gYnV0IGNsaWNrIHRvIGNsZWFyIGFuZFxuICAgICAgICAgIC8vIG9ic2VydmUgZGVjcmVtZW50aW5nIHN0b3JlIHNpemUuIENoZWNrIHVuaXQgbmFtZXMgaW4gZWFjaCBjYXNlLlxuICAgICAgICAgIGl0KGBzaG91bGQgaGF2ZSBvbmUgc2VsZWN0aW9uIGluc3RhbmNlIHBlciAke3Jlc29sdmV9IHZpZXdgLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGVtYmVkKHNwZWMoc3BlY1R5cGUsIDAsIHNlbGVjdGlvbikpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoaXRzW3NwZWNUeXBlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBwYXJlbnRTZWxlY3RvcihzcGVjVHlwZSwgaSk7XG4gICAgICAgICAgICAgIGNvbnN0IHN0b3JlID0gYnJvd3Nlci5leGVjdXRlKGZuKHNwZWNUeXBlLCBpLCBwYXJlbnQpKS52YWx1ZTtcbiAgICAgICAgICAgICAgYXNzZXJ0Lmxlbmd0aE9mKHN0b3JlLCBpICsgMSk7XG4gICAgICAgICAgICAgIGFzc2VydC5tYXRjaChzdG9yZVtpXS51bml0LCB1bml0TmFtZVJlZ2V4KHNwZWNUeXBlLCBpKSk7XG4gICAgICAgICAgICAgIHRlc3RSZW5kZXIoYCR7cmVzb2x2ZX1fJHtpfWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbWJlZChzcGVjKHNwZWNUeXBlLCAxLCB7dHlwZSwgcmVzb2x2ZSwgZW5jb2RpbmdzOiBbJ3gnXX0pKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGl0c1tzcGVjVHlwZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gcGFyZW50U2VsZWN0b3Ioc3BlY1R5cGUsIGkpO1xuICAgICAgICAgICAgICBicm93c2VyLmV4ZWN1dGUoZm4oc3BlY1R5cGUsIGksIHBhcmVudCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gaGl0c1tgJHtzcGVjVHlwZX1fY2xlYXJgXS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBwYXJlbnRTZWxlY3RvcihzcGVjVHlwZSwgaSk7XG4gICAgICAgICAgICAgIGNvbnN0IHN0b3JlID0gYnJvd3Nlci5leGVjdXRlKGZuKGAke3NwZWNUeXBlfV9jbGVhcmAsIGksIHBhcmVudCkpLnZhbHVlO1xuICAgICAgICAgICAgICBhc3NlcnQubGVuZ3RoT2Yoc3RvcmUsIGkpO1xuICAgICAgICAgICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgICAgICAgICBhc3NlcnQubWF0Y2goc3RvcmVbaSAtIDFdLnVuaXQsIHVuaXROYW1lUmVnZXgoc3BlY1R5cGUsIGkgLSAxKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGVzdFJlbmRlcihgJHtyZXNvbHZlfV9jbGVhcl8ke2l9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=