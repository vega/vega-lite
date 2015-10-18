"use strict";

module.exports = {
    description: "Issue #64 - fix inconsistent error paths for missing reference errors",
    tests: [
        {
            description: "should fail validation and report correct error path",
            schema: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    friends: {
                        type: "array",
                        items: {
                            $ref: "Person.json"
                        }
                    }
                }
            },
            valid: false,
            validateSchemaOnly: true,
            after: function (err) {
                expect(err[0].path).toEqual("#/properties/friends/items");
            }
        }
    ]
};
