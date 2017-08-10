"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var scale = require("../src/scale");
var util_1 = require("../src/util");
describe('scale', function () {
    describe('scaleTypeSupportProperty', function () {
        // Make sure we always edit this when we add new channel
        it('should have at least one supported scale types for all scale properties', function () {
            var _loop_1 = function (prop) {
                chai_1.assert(util_1.some(scale.SCALE_TYPES, function (scaleType) {
                    return scale.scaleTypeSupportProperty(scaleType, prop);
                }));
            };
            for (var _i = 0, _a = scale.SCALE_PROPERTIES; _i < _a.length; _i++) {
                var prop = _a[_i];
                _loop_1(prop);
            }
        });
        // TODO: write more test blindly (Don't look at our code, just look at D3 code.)
        chai_1.assert.isFalse(scale.scaleTypeSupportProperty('bin-linear', 'zero'));
    });
    describe('scaleTypes', function () {
        it('should either hasContinuousDomain or hasDiscreteDomain', function () {
            for (var _i = 0, _a = scale.SCALE_TYPES; _i < _a.length; _i++) {
                var scaleType = _a[_i];
                chai_1.assert(scale.hasContinuousDomain(scaleType) !== scale.hasDiscreteDomain(scaleType));
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc2NhbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QixvQ0FBc0M7QUFDdEMsb0NBQWlDO0FBRWpDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7SUFDaEIsUUFBUSxDQUFDLDBCQUEwQixFQUFFO1FBQ25DLHdEQUF3RDtRQUN4RCxFQUFFLENBQUMseUVBQXlFLEVBQUU7b0NBQ2pFLElBQUk7Z0JBQ2IsYUFBTSxDQUFDLFdBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFVBQUMsU0FBUztvQkFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDO1lBSkQsR0FBRyxDQUFDLENBQWUsVUFBc0IsRUFBdEIsS0FBQSxLQUFLLENBQUMsZ0JBQWdCLEVBQXRCLGNBQXNCLEVBQXRCLElBQXNCO2dCQUFwQyxJQUFNLElBQUksU0FBQTt3QkFBSixJQUFJO2FBSWQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILGdGQUFnRjtRQUVoRixhQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsRUFBRSxDQUFDLHdEQUF3RCxFQUFFO1lBQzNELEdBQUcsQ0FBQyxDQUFvQixVQUFpQixFQUFqQixLQUFBLEtBQUssQ0FBQyxXQUFXLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCO2dCQUFwQyxJQUFNLFNBQVMsU0FBQTtnQkFDbEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxLQUFLLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUNyRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9