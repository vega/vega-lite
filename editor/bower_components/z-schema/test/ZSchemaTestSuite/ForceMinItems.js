"use strict";

module.exports = {
    description: "forceMinItems - Force minItems to be defined on arrays",
    options: {
        forceMinItems: true
    },
    validateSchemaOnly: true,
    tests: [
        {
            schema: {
                "type": "array",
                "minItems": 20
            },
            description: "should pass schema validation because minItems is defined",
            valid: true
        },
        {
            schema: {
                "type": "array"
            },
            description: "should fail schema validation because minItems is not defined",
            valid: false
        }
    ]
};
