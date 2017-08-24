"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var encode = require("../../../src/compile/axis/encode");
var encode_1 = require("../../../src/compile/axis/encode");
var split_1 = require("../../../src/compile/split");
var util_1 = require("../../util");
describe('compile/axis', function () {
    describe('encode.labels()', function () {
        it('should rotate label for temporal field by default', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "month" }
                }
            });
            var labels = encode.labels(model, 'x', {}, new split_1.Split());
            chai_1.assert.equal(labels.angle.value, 270);
        });
        it('should have correct text.signal for quarter timeUnits', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "quarter" }
                }
            });
            var labels = encode.labels(model, 'x', {}, new split_1.Split());
            var expected = "'Q' + quarter(datum.value)";
            chai_1.assert.equal(labels.text.signal, expected);
        });
        it('should have correct text.signal for yearquartermonth timeUnits', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "yearquartermonth" }
                }
            });
            var labels = encode.labels(model, 'x', {}, new split_1.Split());
            var expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
            chai_1.assert.equal(labels.text.signal, expected);
        });
    });
    describe('labelAlign', function () {
        function testLabelAlign(angle, orient) {
            // Make angle within [0,360)
            angle = ((angle % 360) + 360) % 360;
            return encode_1.labelAlign(angle, orient);
        }
        it('is left for bottom axis with positive angle', function () {
            chai_1.assert.equal(testLabelAlign(90, 'bottom'), 'left');
            chai_1.assert.equal(testLabelAlign(45, 'bottom'), 'left');
        });
        it('is right for bottom axis with negative angle', function () {
            chai_1.assert.equal(testLabelAlign(-90, 'bottom'), 'right');
            chai_1.assert.equal(testLabelAlign(-45, 'bottom'), 'right');
        });
        it('is left for top axis with positive angle', function () {
            chai_1.assert.equal(testLabelAlign(90, 'top'), 'right');
            chai_1.assert.equal(testLabelAlign(45, 'top'), 'right');
        });
        it('is left for top axis with negative angle', function () {
            chai_1.assert.equal(testLabelAlign(-90, 'top'), 'left');
            chai_1.assert.equal(testLabelAlign(-45, 'top'), 'left');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvYXhpcy9lbmNvZGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIseURBQTJEO0FBQzNELDJEQUE0RDtBQUM1RCxvREFBaUQ7QUFFakQsbUNBQW1EO0FBR25ELFFBQVEsQ0FBQyxjQUFjLEVBQUU7SUFDdkIsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCLEVBQUUsQ0FBQyxtREFBbUQsRUFBRTtZQUN0RCxJQUFNLEtBQUssR0FBRyw4QkFBdUIsQ0FBQztnQkFDcEMsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDO2lCQUNyRDthQUNGLENBQUMsQ0FBQztZQUNILElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxhQUFLLEVBQU0sQ0FBQyxDQUFDO1lBQzlELGFBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdURBQXVELEVBQUU7WUFDMUQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBQztpQkFDdkQ7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtB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