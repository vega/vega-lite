"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale = require("../src/scale");
var chai_1 = require("chai");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc2NhbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQUFzQztBQUN0Qyw2QkFBNEI7QUFDNUIsb0NBQWlDO0FBRWpDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7SUFDaEIsUUFBUSxDQUFDLDBCQUEwQixFQUFFO1FBQ25DLHdEQUF3RDtRQUN4RCxFQUFFLENBQUMseUVBQXlFLEVBQUU7b0NBQ25FLElBQUk7Z0JBQ1gsYUFBTSxDQUFDLFdBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFVBQUMsU0FBUztvQkFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDO1lBSkQsR0FBRyxDQUFDLENBQWEsVUFBc0IsRUFBdEIsS0FBQSxLQUFLLENBQUMsZ0JBQWdCLEVBQXRCLGNBQXNCLEVBQXRCLElBQXNCO2dCQUFsQyxJQUFJLElBQUksU0FBQTt3QkFBSixJQUFJO2FBSVo7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILGdGQUFnRjtJQUNsRixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsRUFBRSxDQUFDLHdEQUF3RCxFQUFFO1lBQzNELEdBQUcsQ0FBQyxDQUFrQixVQUFpQixFQUFqQixLQUFBLEtBQUssQ0FBQyxXQUFXLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCO2dCQUFsQyxJQUFJLFNBQVMsU0FBQTtnQkFDaEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxLQUFLLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUNyRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9