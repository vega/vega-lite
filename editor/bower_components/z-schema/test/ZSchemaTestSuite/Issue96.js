"use strict";

module.exports = {
    description: "Issue #96 - email format validation false negatives",
    schema: {
        type: "string",
        format: "email"
    },
    tests: [
        {
            description: "should pass validation #1",
            data: "my_email@gmail.com",
            valid: true
        }
    ]
};
