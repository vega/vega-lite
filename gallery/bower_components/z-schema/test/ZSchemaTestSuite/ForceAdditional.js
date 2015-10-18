"use strict";

module.exports = {
    description: "forceAdditional - Force additional properties/items in schemas",
    options: {
        forceAdditional: true
    },
    validateSchemaOnly: true,
    tests: [
        {
            schema: {
                "type": "object",
                "properties": {
                    "hello": {
                        "type": "string"
                    }
                },
                "additionalProperties": false
            },
            description: "should pass schema validation when additionalProperties are defined on objects",
            valid: true
        },
        {
            schema: {
                "type": "object",
                "properties": {
                    "hello": {
                        "type": "string"
                    }
                }
            },
            description: "should fail schema validation when additionalProperties are not defined on objects",
            valid: false
        },
        {
            schema: {
                "type": "array",
                "items": [
                    {
                        "type": "string"
                    }
                ],
                "additionalItems": false
            },
            description: "should pass schema validation when additionalItems are defined on arrays",
            valid: true
        },
        {
            schema: {
                "type": "array",
                "items": [
                    {
                        "type": "string"
                    }
                ]
            },
            description: "should fail schema validation when additionalItems are not defined on arrays",
            valid: false
        },
        {
            schema: {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            description: "should pass schema validation without additionalItems because they doesn't matter when items is a schema",
            valid: true
        }
    ]
};
