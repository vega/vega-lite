"use strict";

module.exports = {
    description: "Issue #98 - oneOf",
    tests: [
        {
            description: "should return only one error for each branch",
            schema: {
                "type": "object",
                "oneOf": [
                    {
                        "type": "object",
                        "required": ["a", "b"]
                    },
                    {
                        "type": "object",
                        "required": ["c", "d"]
                    }
                ]
            },
            data: {},
            valid: false,
            after: function (err, valid, data, validator) {
                expect(err.length).toBe(1);
                expect(err[0].code).toBe("ONE_OF_MISSING");
                expect(err[0].inner.length).toBe(2);
            }
        }
    ]
};
