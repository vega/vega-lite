"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var nullfilter_1 = require("../../../src/compile/data/nullfilter");
var transforms_1 = require("../../../src/compile/data/transforms");
var log = require("../../../src/log");
var util_1 = require("../../util");
function parse(model) {
    return nullfilter_1.NullFilterNode.make(model);
}
describe('compile/data/transforms', function () {
    describe('lookup', function () {
        it('should parse lookup from array', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/lookup_groups.csv" },
                "transform": [{
                        "lookup": "person",
                        "from": {
                            "data": { "url": "data/lookup_people.csv" },
                            "key": "name",
                            "fields": ["age", "height"]
                        }
                    }],
                "mark": "bar",
                "encoding": {}
            });
            var t = transforms_1.parseTransformArray(model);
            chai_1.assert.deepEqual(t.first.assemble(), {
                type: 'lookup',
                from: 'lookup_0',
                key: 'name',
                fields: ['person'],
                values: ['age', 'height']
            });
        });
        it('should create node for flat lookup', function () {
            var lookup = new transforms_1.LookupNode({
                "lookup": "person",
                "from": {
                    "data": { "url": "data/lookup_people.csv" },
                    "key": "name",
                    "fields": ["age", "height"]
                }
            }, 'lookup_0');
            chai_1.assert.deepEqual(lookup.assemble(), {
                type: 'lookup',
                from: 'lookup_0',
                key: 'name',
                fields: ['person'],
                values: ['age', 'height']
            });
        });
        it('should create node for nested lookup', function () {
            var lookup = new transforms_1.LookupNode({
                "lookup": "person",
                "from": {
                    "data": { "url": "data/lookup_people.csv" },
                    "key": "name"
                },
                "as": "foo"
            }, 'lookup_0');
            chai_1.assert.deepEqual(lookup.assemble(), {
                type: 'lookup',
                from: 'lookup_0',
                key: 'name',
                fields: ['person'],
                as: ['foo']
            });
        });
        it('should warn if fields are not specified and as is missing', function () {
            log.runLocalLogger(function (localLogger) {
                var lookup = new transforms_1.LookupNode({
                    "lookup": "person",
                    "from": {
                        "data": { "url": "data/lookup_people.csv" },
                        "key": "name"
                    }
                }, 'lookup_0');
                lookup.assemble();
                chai_1.assert.equal(localLogger.warns[0], log.message.NO_FIELDS_NEEDS_AS);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3Jtcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvdHJhbnNmb3Jtcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1QixtRUFBb0U7QUFDcEUsbUVBQXFGO0FBRXJGLHNDQUF3QztBQUV4QyxtQ0FBMEM7QUFHMUMsZUFBZSxLQUFxQjtJQUNsQyxNQUFNLENBQUMsMkJBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVELFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtJQUNsQyxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtZQUNuQyxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUM7Z0JBQ3pDLFdBQVcsRUFBRSxDQUFDO3dCQUNaLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixNQUFNLEVBQUU7NEJBQ04sTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLHdCQUF3QixFQUFDOzRCQUN6QyxLQUFLLEVBQUUsTUFBTTs0QkFDYixRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO3lCQUM1QjtxQkFDRixDQUFDO2dCQUNGLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRSxFQUFFO2FBQ2YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxDQUFDLEdBQUcsZ0NBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckMsYUFBTSxDQUFDLFNBQVMsQ0FBcUIsQ0FBQyxDQUFDLEtBQW9CLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ3RFLElBQUksRUFBRSxRQUFRO2dCQUNkLElBQUksRUFBRSxVQUFVO2dCQUNoQixHQUFHLEVBQUUsTUFBTTtnQkFDWCxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7YUFDMUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUU7WUFDdkMsSUFBTSxNQUFNLEdBQUcsSUFBSSx1QkFBVSxDQUFDO2dCQUMxQixRQUFRLEVBQUUsUUFBUTtnQkFDbEIsTUFBTSxFQUFFO29CQUNOLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBQztvQkFDekMsS0FBSyxFQUFFLE1BQU07b0JBQ2IsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztpQkFDNUI7YUFDRixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRWpCLGFBQU0sQ0FBQyxTQUFTLENBQW9CLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDckQsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLEdBQUcsRUFBRSxNQUFNO2dCQUNYLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztnQkFDbEIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQzthQUMxQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN6QyxJQUFNLE1BQU0sR0FBRyxJQUFJLHVCQUFVLENBQUM7Z0JBQzFCLFFBQVEsRUFBRSxRQUFRO2dCQUNsQixNQUFNLEVBQUU7b0JBQ04sTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLHdCQUF3QixFQUFDO29CQUN6QyxLQUFLLEVBQUUsTUFBTTtpQkFDZDtnQkFDRCxJQUFJLEVBQUUsS0FBSzthQUNaLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFakIsYUFBTSxDQUFDLFNBQVMsQ0FBb0IsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNyRCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsR0FBRyxFQUFFLE1BQU07Z0JBQ1gsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQUNsQixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7YUFDWixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyREFBMkQsRUFBRTtZQUM5RCxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQUMsV0FBVztnQkFDN0IsSUFBTSxNQUFNLEdBQUcsSUFBSSx1QkFBVSxDQUFDO29CQUMxQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFO3dCQUNOLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBQzt3QkFDekMsS0FBSyxFQUFFLE1BQU07cUJBQ2Q7aUJBQ0YsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDakIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUVsQixhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=