"use strict";

module.exports = {
    description: "forceMaxLength - Force maxLength to be defined on strings",
    options: {
        forceMaxLength: true
    },
    validateSchemaOnly: true,
    tests: [
        {
            schema: {
                "type": "string",
                "maxLength": 20
            },
            description: "should pass schema validation because maxLength is defined",
            valid: true
        },
        {
            schema: {
                "type": "string"
            },
            description: "should fail schema validation because maxLength is not defined",
            valid: false
        }
    ]
};
