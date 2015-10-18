"use strict";

module.exports = {
    description: "forceMaxItems - Force maxItems to be defined on arrays",
    options: {
        forceMaxItems: true
    },
    validateSchemaOnly: true,
    tests: [
        {
            schema: {
                "type": "array",
                "maxItems": 20
            },
            description: "should pass schema validation because maxItems is defined",
            valid: true
        },
        {
            schema: {
                "type": "array"
            },
            description: "should fail schema validation because maxItems is not defined",
            valid: false
        }
    ]
};
