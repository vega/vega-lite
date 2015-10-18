"use strict";

module.exports = {
    description: "Issue #102 - circular references",
    tests: [
        {
            description: "should pass without an error",
            schema: {},
            data: {},
            valid: true,
            after: function (err, valid, data, validator) {
                var resolvedSchema = validator.getResolvedSchema("http://json-schema.org/draft-04/schema#");
            }
        }
    ]
};
