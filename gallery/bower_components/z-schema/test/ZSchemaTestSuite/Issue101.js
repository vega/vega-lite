"use strict";

module.exports = {
    description: "Issue #101 - Cannot read property '__$compiled' of undefined",
    async: true,
    options: {
        asyncTimeout: 500
    },
    schema: null,
    tests: [
        {
            description: "should fail with correct error",
            data: null,
            valid: false,
            after: function (err) {
                expect(err.message).toBe("Invalid .validate call - schema must be an string or object but null was passed!");
            }
        }
    ]
};
