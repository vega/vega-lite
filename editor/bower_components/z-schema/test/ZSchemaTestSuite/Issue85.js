"use strict";

var innerSchema = {
    type: "integer"
};

var originalSchema = {
    type: "object",
    properties: {
        inner: innerSchema
    }
};

var getKeys = function (obj) {
    var arr = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            arr.push(key);
        }
    }
    return arr;
};

var originalSchemaKeys = getKeys(originalSchema);
var innerSchemaKeys = getKeys(innerSchema);

module.exports = {
    description: "Issue #85 - zschema shouldn't have side effects on the schema object",
    tests: [
        {
            description: "should pass validation",
            schema: originalSchema,
            data: {
                inner: 5
            },
            valid: true,
            after: function () {
                expect(getKeys(originalSchema).length).toBe(originalSchemaKeys.length);
                expect(getKeys(innerSchemaKeys).length).toBe(innerSchemaKeys.length);
            }
        }
    ]
};
