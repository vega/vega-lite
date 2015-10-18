"use strict";

module.exports = {
    description: "Issue #103 - Validate async fails silently",
    options: {
        asyncTimeout: 500
    },
    schema: {
        required: ["recType", "luValue"],
        properties: {
            luValue: {
                type: "string"
            },
            useAsIs: {
                type: "integer"
            },
            valueText: {
                type: "string"
            },
            sequence: {
                type: "integer",
                minimum: 0
            },
            description: {
                type: "string"
            },
            valueInt: {
                type: "integer"
            },
            recType: {
                type: "string",
                enum: []
            },
            recProps: {
                type: "object",
                properties: {},
                additionalProperties: false
            },
            control: {
                "$ref": "control"
            }
        },
        additionalProperties: false,
        type: "object",
        title: "lookup schema for bankCodeType"
    },
    tests: [
        {
            async: false,
            description: "should fail with correct error - sync",
            validateSchemaOnly: true,
            valid: false,
            after: function (errs) {
                expect(errs.length).toBe(1);
            }
        },
        {
            async: true,
            description: "should fail with correct error - async",
            validateSchemaOnly: true,
            valid: false,
            after: function (errs) {
                expect(errs.length).toBe(1);
            }
        }
    ]
};
