"use strict";

module.exports = {
    description: "noTypeless - Don't allow schemas without type specified",
    validateSchemaOnly: true,
    options: {
        noTypeless: true
    },
    tests: [
        {
            description: "should pass validation when using a type in schema",
            schema: {
                "type": "string"
            },
            valid: true
        },
        {
            description: "should fail validation when not using a type in schema",
            schema: {},
            valid: false
        }
    ]
};
