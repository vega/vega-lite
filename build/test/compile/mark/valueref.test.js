"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var valueref_1 = require("../../../src/compile/mark/valueref");
var fielddef_1 = require("../../../src/fielddef");
var util_1 = require("../../util");
describe('compile/mark/valueref', function () {
    describe('midPoint()', function () {
        it('should return correctly for lat/lng', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "data": {
                    "url": "data/zipcodes.csv",
                    "format": {
                        "type": "csv"
                    }
                },
                "mark": "point",
                "encoding": {
                    "x": {
                        "field": "longitude",
                        "type": "longitude"
                    },
                    "y": {
                        "field": "latitude",
                        "type": "latitude"
                    }
                }
            });
            [channel_1.X, channel_1.Y].forEach(function (channel) {
                var channelDef = model.encoding[channel];
                var scaleName = model.scaleName(channel);
                var scaleComponent = model.getScaleComponent(channel);
                var def = valueref_1.midPoint(channel, channelDef, scaleName, scaleComponent, null, null);
                chai_1.assert.isTrue(channelDef && fielddef_1.isFieldDef(channelDef));
                if (channelDef && fielddef_1.isFieldDef(channelDef)) {
                    chai_1.assert.equal(def.field, fielddef_1.vgField(channelDef, { suffix: 'geo' }));
                }
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVyZWYudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9tYXJrL3ZhbHVlcmVmLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLGdEQUEwQztBQUMxQywrREFBNEQ7QUFDNUQsa0RBQTBEO0FBQzFELG1DQUFnRTtBQUVoRSxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixFQUFFLENBQUMscUNBQXFDLEVBQUU7WUFDeEMsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7Z0JBQ2pELE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsbUJBQW1CO29CQUMxQixRQUFRLEVBQUU7d0JBQ1IsTUFBTSxFQUFFLEtBQUs7cUJBQ2Q7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRTt3QkFDSCxPQUFPLEVBQUUsV0FBVzt3QkFDcEIsTUFBTSxFQUFFLFdBQVc7cUJBQ3BCO29CQUNELEdBQUcsRUFBRTt3QkFDSCxPQUFPLEVBQUUsVUFBVTt3QkFDbkIsTUFBTSxFQUFFLFVBQVU7cUJBQ25CO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsQ0FBQyxXQUFDLEVBQUUsV0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTztnQkFDckIsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0MsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0MsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN4RCxJQUFNLEdBQUcsR0FBRyxtQkFBUSxDQUNsQixPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQzlDLElBQUksRUFBRSxJQUFJLENBQ1gsQ0FBQztnQkFDRixhQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxxQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekMsYUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGtCQUFPLENBQUMsVUFBVSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEUsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7WCwgWX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHttaWRQb2ludH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay92YWx1ZXJlZic7XG5pbXBvcnQge2lzRmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uLy4uL3NyYy9maWVsZGRlZic7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL21hcmsvdmFsdWVyZWYnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdtaWRQb2ludCgpJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdGx5IGZvciBsYXQvbG5nJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3ppcGNvZGVzLmNzdlwiLFxuICAgICAgICAgIFwiZm9ybWF0XCI6IHtcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImNzdlwiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm1hcmtcIjogXCJwb2ludFwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJmaWVsZFwiOiBcImxvbmdpdHVkZVwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibG9uZ2l0dWRlXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcImZpZWxkXCI6IFwibGF0aXR1ZGVcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImxhdGl0dWRlXCJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBbWCwgWV0uZm9yRWFjaCgoY2hhbm5lbCkgPT4ge1xuICAgICAgICBjb25zdCBjaGFubmVsRGVmID0gbW9kZWwuZW5jb2RpbmdbY2hhbm5lbF07XG4gICAgICAgIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcbiAgICAgICAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcbiAgICAgICAgY29uc3QgZGVmID0gbWlkUG9pbnQoXG4gICAgICAgICAgY2hhbm5lbCwgY2hhbm5lbERlZiwgc2NhbGVOYW1lLCBzY2FsZUNvbXBvbmVudCxcbiAgICAgICAgICBudWxsLCBudWxsXG4gICAgICAgICk7XG4gICAgICAgIGFzc2VydC5pc1RydWUoY2hhbm5lbERlZiAmJiBpc0ZpZWxkRGVmKGNoYW5uZWxEZWYpKTtcbiAgICAgICAgaWYgKGNoYW5uZWxEZWYgJiYgaXNGaWVsZERlZihjaGFubmVsRGVmKSkge1xuICAgICAgICAgIGFzc2VydC5lcXVhbChkZWYuZmllbGQsIHZnRmllbGQoY2hhbm5lbERlZiwge3N1ZmZpeDogJ2dlbyd9KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19