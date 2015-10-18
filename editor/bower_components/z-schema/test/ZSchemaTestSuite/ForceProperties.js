"use strict";

module.exports = {
    description: "forceProperties - Force properties to be defined on objects",
    options: {
        forceProperties: true
    },
    validateSchemaOnly: true,
    tests: [
        {
            schema: {
                "type": "object",
                "properties": {
                    "test": {}
                }
            },
            description: "should pass schema validation because properties are defined",
            valid: true
        },
        {
            schema: {
                "type": "object",
                "patternProperties": {
                    "te(s|t)": {}
                }
            },
            description: "should pass schema validation because patternProperties are defined",
            valid: true
        },
        {
            schema: {
                "type": "object"
            },
            description: "should fail schema validation because properties are not defined",
            valid: false
        },
        {
            schema: {
                "type": "object",
                "properties": {}
            },
            description: "should fail schema validation because properties are present but doesn't define any properties",
            valid: false
        },
        {
            schema: {
                "type": "object",
                "patternProperties": {}
            },
            description: "should fail schema validation because patternProperties are present but doesn't define any properties",
            valid: false
        }
    ]
};
