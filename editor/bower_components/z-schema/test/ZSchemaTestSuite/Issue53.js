"use strict";

module.exports = {
    description: "Issue #53 - Include description (if any) in errors",
    tests: [
        {
            description: "should fail validation and return error description",
            schema: {
                type: "string",
                pattern: "^[0-9]{1}[0-9]{3}(\\s)?[A-Za-z]{2}$",
                description: "Four numbers followed by an optional space and then two letters."
            },
            data: "000 a",
            valid: false,
            after: function (err) {
                expect(err[0].description).toBe("Four numbers followed by an optional space and then two letters.");
            }
        }
    ]
};
