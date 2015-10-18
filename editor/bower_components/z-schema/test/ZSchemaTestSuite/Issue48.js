"use strict";

module.exports = {
    description: "Issue #48 - email validation too strict",
    schema: {
        type: "string",
        format: "email"
    },
    tests: [
        {
            description: "should pass validation #1",
            data: "zaggino@gmail.com",
            valid: true
        },
        {
            description: "should pass validation #2",
            data: "foo@bar.baz",
            valid: true
        },
        {
            description: "should fail validation #1",
            data: "foobar.baz",
            valid: false
        },
        {
            description: "should fail validation #2",
            data: "foo@bar",
            valid: false
        }
    ]
};
