"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Ajv = require("ajv");
var util_1 = require("util");
var specSchema = require('../../build/vega-lite-schema.json');
var metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
describe('Schema', function () {
    it('should be valid', function () {
        var ajv = new Ajv({
            allErrors: true,
            verbose: true
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L3NjaGVtYS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLHlCQUEyQjtBQUMzQiw2QkFBNkI7QUFFN0IsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDaEUsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7QUFFckUsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixFQUFFLENBQUMsaUJBQWlCLEVBQUU7UUFDcEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUM7WUFDbEIsU0FBUyxFQUFFLElBQUk7WUFDZixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLHlDQUF5QyxDQUFDLENBQUM7UUFFekUsMkNBQTJDO1FBQzNDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBQ0QsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9