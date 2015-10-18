"use strict";

var schema1 = {
    "id": "long-string",
    "type": "string",
    "maxLength": 4096
};
var schema2 = {
    "id": "person-object",
    "type": "object",
    "properties": {
        "name": {
            "$ref": "long-string"
        }
    }
};
var expectedResult = {
    "id": "person-object",
    "type": "object",
    "properties": {
        "name": {
            "id": "long-string",
            "type": "string",
            "maxLength": 4096
        }
    }
};
module.exports = {
    description: "Issue #94 - get a resolved schema for documentation purposes",
    tests: [
        {
            description: "should pass validation",
            schema: [schema1, schema2],
            validateSchemaOnly: true,
            valid: true,
            after: function (err, valid, data, validator) {
                var newSch = validator.getResolvedSchema("person-object");
                expect(JSON.stringify(newSch)).toBe(JSON.stringify(expectedResult));
            }
        }
    ]
};
