"use strict";

module.exports = {
    description: "Issue #146 - Only the first failure in an `allOf` block is returned",
    tests: [
        {
            description: "should pass",
            options: {
                breakOnFirstError: false
            },
            schema: {
                properties: {
                    password: {
                        allOf: [
                            { type: "string", minLength: 8 },
                            { type: "string", pattern: "[A-Z]+" }
                        ]
                    }
                }
            },
            data: { password: "short" },
            valid: false,
            after: function (err) {
                expect(err.length).toBe(2);
            }
        }
    ]
};
