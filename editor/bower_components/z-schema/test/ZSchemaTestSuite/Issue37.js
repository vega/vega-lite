"use strict";

module.exports = {
    description: "Issue #37 - pass schema as an uri to load from cache",
    tests: [
        {
            description: "should pass validation",
            schema: "http://json-schema.org/draft-04/schema",
            data: {
                type: "string"
            },
            valid: true
        },
        {
            description: "should pass validation",
            schema: "http://json-schema.org/draft-04/schema",
            data: {
                type: 1
            },
            valid: false
        }
    ]
};
