"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ajv = require("ajv");
var chai_1 = require("chai");
var util_1 = require("util");
var specSchema = require('../../build/vega-lite-schema.json');
var metaSchema = require('ajv/lib/refs/json-schema-draft-06.json');
describe('Schema', function () {
    it('should be valid', function () {
        var ajv = new Ajv({
            allErrors: true,
            verbose: true,
            extendRefs: 'fail'
        });
        ajv.addMetaSchema(metaSchema);
        // now validate our data against the schema
        var valid = ajv.validateSchema(specSchema);
        if (!valid) {
            console.log(util_1.inspect(ajv.errors, { depth: 10, colors: true }));
        }
        chai_1.assert.equal(valid, true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9leGFtcGxlcy9zY2hlbWEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUEyQjtBQUMzQiw2QkFBNEI7QUFDNUIsNkJBQTZCO0FBRTdCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ2hFLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0FBRXJFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsRUFBRSxDQUFDLGlCQUFpQixFQUFFO1FBQ3BCLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDO1lBQ2xCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsT0FBTyxFQUFFLElBQUk7WUFDYixVQUFVLEVBQUUsTUFBTTtTQUNuQixDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTlCLDJDQUEyQztRQUMzQyxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsQ0FBQztRQUNELGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBBanYgZnJvbSAnYWp2JztcbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7aW5zcGVjdH0gZnJvbSAndXRpbCc7XG5cbmNvbnN0IHNwZWNTY2hlbWEgPSByZXF1aXJlKCcuLi8uLi9idWlsZC92ZWdhLWxpdGUtc2NoZW1hLmpzb24nKTtcbmNvbnN0IG1ldGFTY2hlbWEgPSByZXF1aXJlKCdhanYvbGliL3JlZnMvanNvbi1zY2hlbWEtZHJhZnQtMDYuanNvbicpO1xuXG5kZXNjcmliZSgnU2NoZW1hJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdzaG91bGQgYmUgdmFsaWQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBhanYgPSBuZXcgQWp2KHtcbiAgICAgIGFsbEVycm9yczogdHJ1ZSxcbiAgICAgIHZlcmJvc2U6IHRydWUsXG4gICAgICBleHRlbmRSZWZzOiAnZmFpbCdcbiAgICB9KTtcblxuICAgIGFqdi5hZGRNZXRhU2NoZW1hKG1ldGFTY2hlbWEpO1xuXG4gICAgLy8gbm93IHZhbGlkYXRlIG91ciBkYXRhIGFnYWluc3QgdGhlIHNjaGVtYVxuICAgIGNvbnN0IHZhbGlkID0gYWp2LnZhbGlkYXRlU2NoZW1hKHNwZWNTY2hlbWEpO1xuXG4gICAgaWYgKCF2YWxpZCkge1xuICAgICAgY29uc29sZS5sb2coaW5zcGVjdChhanYuZXJyb3JzLCB7ZGVwdGg6IDEwLCBjb2xvcnM6IHRydWV9KSk7XG4gICAgfVxuICAgIGFzc2VydC5lcXVhbCh2YWxpZCwgdHJ1ZSk7XG4gIH0pO1xufSk7XG4iXX0=