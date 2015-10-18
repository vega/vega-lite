"use strict";

module.exports = {
    description: "forceItems - Force items to be defined on arrays",
    options: {
        forceItems: true
    },
    validateSchemaOnly: true,
    tests: [
        {
            schema: {
                "type": "array",
                "items": {}
            },
            description: "should pass schema validation because items are defined",
            valid: true
        },
        {
            schema: {
                "type": "array"
            },
            description: "should fail schema validation because items are not defined",
            valid: false
        }
    ]
};
