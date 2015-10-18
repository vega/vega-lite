"use strict";

module.exports = {
    description: "forceMinLength - Force minLength to be defined on strings",
    options: {
        forceMinLength: true
    },
    validateSchemaOnly: true,
    tests: [
        {
            schema: {
                "type": "string",
                "minLength": 20
            },
            description: "should pass schema validation because minLength is defined",
            valid: true
        },
        {
            schema: {
                "type": "string"
            },
            description: "should fail schema validation because minLength is not defined",
            valid: false
        }
    ]
};
