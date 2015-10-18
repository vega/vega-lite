"use strict";

module.exports = {
    description: "Issue #73 - getLastError method should return an instance of native Error",
    tests: [
        {
            description: "should pass the basic test",
            schema: {
                id: "schemaA",
                type: "object",
                properties: {
                    a: {
                        type: "integer"
                    },
                    b: {
                        type: "string"
                    },
                    c: {
                        $ref: "schemaB"
                    }
                },
                required: ["a"]
            },
            validateSchemaOnly: true,
            valid: false,
            after: function (err, valid, data, validator) {
                var e = validator.getLastError();
                expect(e instanceof Error).toBe(true);
                expect(e.message).toBe("SCHEMA_COMPILATION_FAILED");
            }
        },
        {
            description: "should pass the basic test",
            data: { "b": true },
            schema: {
                id: "schemaA",
                type: "object",
                properties: {
                    a: {
                        type: "integer"
                    },
                    b: {
                        type: "string"
                    }
                },
                required: ["a"]
            },
            valid: false,
            after: function (err, valid, data, validator) {
                var e = validator.getLastError();
                expect(e instanceof Error).toBe(true);
                expect(e.message).toBe("JSON_OBJECT_VALIDATION_FAILED");
            }
        }
    ]
};
