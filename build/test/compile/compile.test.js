"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var log = require("../../src/log");
var compile_1 = require("../../src/compile/compile");
describe('Compile', function () {
    it('should throw error for invalid spec', function () {
        chai_1.assert.throws(function () {
            compile_1.compile({});
        }, Error, log.message.INVALID_SPEC);
    });
    describe('compile', function () {
        it('should return a spec with default top-level properties, size signals, data and marks', function () {
            var spec = compile_1.compile({
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert.equal(spec.padding, 5);
            chai_1.assert.equal(spec.autosize, 'pad');
            chai_1.assert.deepEqual(spec.signals, [
                {
                    name: 'width',
                    update: "21"
                },
                {
                    name: 'height',
                    update: "21"
                }
            ]);
            chai_1.assert.equal(spec.data.length, 1); // just source
            chai_1.assert.equal(spec.marks.length, 1); // just the root group
        });
        it('should return a spec with specified top-level properties, size signals, data and marks', function () {
            var spec = compile_1.compile({
                "padding": 123,
                "data": {
                    "values": [{ "a": "A", "b": 28 }]
                },
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert.equal(spec.padding, 123);
            chai_1.assert.equal(spec.autosize, 'pad');
            chai_1.assert.deepEqual(spec.signals, [
                {
                    name: 'width',
                    update: "21"
                },
                {
                    name: 'height',
                    update: "21"
                }
            ]);
            chai_1.assert.equal(spec.data.length, 1); // just source.
            chai_1.assert.equal(spec.marks.length, 1); // just the root group
        });
        it('should set resize to true if requested', function () {
            var spec = compile_1.compile({
                "autoResize": true,
                "mark": "point",
                "encoding": {}
            }).spec;
            chai_1.assert(spec.autosize.resize);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdGVzdC9jb21waWxlL2NvbXBpbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFHNUIsbUNBQXFDO0FBRXJDLHFEQUFrRDtBQUdsRCxRQUFRLENBQUMsU0FBUyxFQUFFO0lBQ2xCLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtRQUN4QyxhQUFNLENBQUMsTUFBTSxDQUFDO1lBQ1osaUJBQU8sQ0FBQyxFQUFTLENBQUMsQ0FBQztRQUNyQixDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyxzRkFBc0YsRUFBRTtZQUN6RixJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO2dCQUNuQixNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDLENBQUMsSUFBSSxDQUFDO1lBRVIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuQyxhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQzdCO29CQUNFLElBQUksRUFBRSxPQUFPO29CQUNiLE1BQU0sRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNFLElBQUksRUFBRSxRQUFRO29CQUNkLE1BQU0sRUFBRSxJQUFJO2lCQUNiO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWM7WUFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQjtRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3RkFBd0YsRUFBRTtZQUMzRixJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO2dCQUNuQixTQUFTLEVBQUUsR0FBRztnQkFDZCxNQUFNLEVBQUU7b0JBQ04sUUFBUSxFQUFFLENBQUMsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQztpQkFDL0I7Z0JBQ0QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDLENBQUMsSUFBSSxDQUFDO1lBRVIsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuQyxhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQzdCO29CQUNFLElBQUksRUFBRSxPQUFPO29CQUNiLE1BQU0sRUFBRSxJQUFJO2lCQUNiO2dCQUNEO29CQUNFLElBQUksRUFBRSxRQUFRO29CQUNkLE1BQU0sRUFBRSxJQUFJO2lCQUNiO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWU7WUFDbEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQjtRQUM1RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUMzQyxJQUFNLElBQUksR0FBRyxpQkFBTyxDQUFDO2dCQUNuQixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDLENBQUMsSUFBSSxDQUFDO1lBRVIsYUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=