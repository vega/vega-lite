"use strict";

module.exports = {
    description: "pedanticCheck - check if schema follow best practices and common sense",
    options: {
        pedanticCheck: true,
        breakOnFirstError: false
    },
    validateSchemaOnly: true,
    tests: [
        {
            schema: {
                "type": "string",
                "default": true
            },
            description: "should fail schema validation because default has incorrect value",
            valid: false
        },
        {
            schema: {
                "type": "string",
                "enum": ["OK", false]
            },
            description: "should fail schema validation because enum has incorrect value",
            valid: false
        },
        {
            schema: {
                "type": "string",
                "enum": ["OK", false],
                "default": true
            },
            description: "should fail schema validation because both enum and default has incorrect values",
            valid: false
        }
    ]
};
