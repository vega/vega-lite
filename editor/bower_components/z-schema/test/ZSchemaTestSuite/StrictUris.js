"use strict";

module.exports = {
    description: "strictUris - validates URIs as absolute and disallow URI references",
    options: {
        strictUris: true
    },
    tests: [
        {
            schema: {
                "type": "string",
                "format": "uri"
            },
            data: "http://json-schema.org/draft-04/schema",
            description: "should pass validation because it is an absolute URI",
            valid: true
        },
        {
            schema: {
                "type": "string",
                "format": "uri"
            },
            data: "schemaA",
            description: "should fail validation because it is only a valid URI reference",
            valid: false
        }
    ]
};
