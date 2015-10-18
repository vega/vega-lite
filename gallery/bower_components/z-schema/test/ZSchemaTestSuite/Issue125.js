"use strict";

module.exports = {
    description: "Issue #125 - Do not process format if type validation fails",
    setup: function (validator, Class) {
        Class.registerFormat("int32", function () {
            return false;
        });
    },
    schema: {
        "type": "integer",
        "format": "int32"
    },
    tests: [
        {
            description: "should only process type validation",
            data: 1.1,
            valid: false,
            after: function (err) {
                expect(err.length).toBe(1);
                expect(err[0].code).toBe("INVALID_TYPE");
            }
        }
    ]
};
