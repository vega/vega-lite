"use strict";

module.exports = {
    description: "noEmptyArrays - Don't allow empty arrays to validate as arrays",
    options: {
        noEmptyArrays: true
    },
    schema: {
        "type": "array"
    },
    tests: [
        {
            description: "should pass validation when having one item array",
            data: ["item"],
            valid: true
        },
        {
            description: "should fail validation when having empty array",
            data: [],
            valid: false
        }
    ]
};
