"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ajv = require("ajv");
var chai_1 = require("chai");
var util_1 = require("util");
var specSchema = require('../../build/vega-lite-schema.json');
var metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
describe('Schema', function () {
    it('should be valid', function () {
        var ajv = new Ajv({
            allErrors: true,
            verbose: true,
            extendRefs: 'fail',
            schemaId: 'id'
        });
        ajv.addMetaSchema(metaSchema, 'http://json-schema.org/draft-04/schema#');
        // now validate our data against the schema
        var valid = ajv.validateSchema(specSchema);
        if (!valid) {
            console.log(util_1.inspect(ajv.errors, { depth: 10, colors: true }));
        }
        chai_1.assert.equal(valid, true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9leGFtcGxlcy9zY2hlbWEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUEyQjtBQUMzQiw2QkFBNEI7QUFDNUIsNkJBQTZCO0FBRTdCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ2hFLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0FBRXJFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsRUFBRSxDQUFDLGlCQUFpQixFQUFFO1FBQ3BCLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDO1lBQ2xCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsT0FBTyxFQUFFLElBQUk7WUFDYixVQUFVLEVBQUUsTUFBTTtZQUNsQixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLHlDQUF5QyxDQUFDLENBQUM7UUFFekUsMkNBQTJDO1FBQzNDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBQ0QsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEFqdiBmcm9tICdhanYnO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtpbnNwZWN0fSBmcm9tICd1dGlsJztcblxuY29uc3Qgc3BlY1NjaGVtYSA9IHJlcXVpcmUoJy4uLy4uL2J1aWxkL3ZlZ2EtbGl0ZS1zY2hlbWEuanNvbicpO1xuY29uc3QgbWV0YVNjaGVtYSA9IHJlcXVpcmUoJ2Fqdi9saWIvcmVmcy9qc29uLXNjaGVtYS1kcmFmdC0wNC5qc29uJyk7XG5cbmRlc2NyaWJlKCdTY2hlbWEnLCBmdW5jdGlvbigpIHtcbiAgaXQoJ3Nob3VsZCBiZSB2YWxpZCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGFqdiA9IG5ldyBBanYoe1xuICAgICAgYWxsRXJyb3JzOiB0cnVlLFxuICAgICAgdmVyYm9zZTogdHJ1ZSxcbiAgICAgIGV4dGVuZFJlZnM6ICdmYWlsJyxcbiAgICAgIHNjaGVtYUlkOiAnaWQnXG4gICAgfSk7XG5cbiAgICBhanYuYWRkTWV0YVNjaGVtYShtZXRhU2NoZW1hLCAnaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNC9zY2hlbWEjJyk7XG5cbiAgICAvLyBub3cgdmFsaWRhdGUgb3VyIGRhdGEgYWdhaW5zdCB0aGUgc2NoZW1hXG4gICAgY29uc3QgdmFsaWQgPSBhanYudmFsaWRhdGVTY2hlbWEoc3BlY1NjaGVtYSk7XG5cbiAgICBpZiAoIXZhbGlkKSB7XG4gICAgICBjb25zb2xlLmxvZyhpbnNwZWN0KGFqdi5lcnJvcnMsIHtkZXB0aDogMTAsIGNvbG9yczogdHJ1ZX0pKTtcbiAgICB9XG4gICAgYXNzZXJ0LmVxdWFsKHZhbGlkLCB0cnVlKTtcbiAgfSk7XG59KTtcbiJdfQ==