"use strict";

module.exports = {
    description: "Issue #49 - pattern validations",
    tests: [
        {
            description: "should pass validation",
            schema: {
                type: "string",
                pattern: "^[0-9]{1}[0-9]{3}(\\s)?[A-Za-z]{2}$"
            },
            data: "0000 aa",
            valid: true
        }
    ]
};
