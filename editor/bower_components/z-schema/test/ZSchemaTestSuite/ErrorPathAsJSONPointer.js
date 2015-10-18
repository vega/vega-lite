"use strict";

module.exports = {
    description: "Report error paths as a JSON Pointer string",
    tests: [
        {
            description: "should fail validation and report error paths a JSON Pointer string",
            schema: {
                "type": "object",
                "properties": {
                  "~name/age": {
                    "type": "invalid"
                  }
                }
            },
            valid: false,
            validateSchemaOnly: true,
            after: function (err) {
                expect(err[0].path).toEqual("#/properties/~0name~1age");
            }
        }
    ]
};
