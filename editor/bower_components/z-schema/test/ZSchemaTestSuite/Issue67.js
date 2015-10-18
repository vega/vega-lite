"use strict";

module.exports = {
    description: "Issue #67 - references problem",
    tests: [
        {
            description: "should pass validation #1",
            setup: function (validator, Class) {
                Class.registerFormat("not-blank", function () {
                    return true;
                });
            },
            schema: [
                {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "NaturalNumber",
                    "type": "integer",
                    "minimum": 1
                },
                {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "WholeNumber",
                    "type": "integer"
                },
                {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "NotEmptyString",
                    "type": "string",
                    "minLength": 1
                },
                {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "id": "NotBlankString",
                    "allOf": [
                        {
                            "$ref": "NotEmptyString"
                        },
                        {
                            "type": "string",
                            "format": "not-blank"
                        }
                    ]
                }
            ],
            validateSchemaOnly: true,
            valid: true
        }
    ]
};
