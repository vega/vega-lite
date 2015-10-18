"use strict";

module.exports = {
    description: "Issue #44 - unresolvable reference due to hash sign",
    tests: [
        {
            description: "should pass validation #1",
            schema: [
                {
                    id: "schemaA",
                    type: "string"
                },
                {
                    id: "schemaB",
                    properties: {
                        a: {
                            "$ref": "schemaA"
                        }
                    }
                }
            ],
            validateSchemaOnly: true,
            valid: true
        },
        {
            description: "should pass validation #2",
            schema: [
                {
                    id: "schemaA",
                    type: "string"
                },
                {
                    id: "schemaB",
                    properties: {
                        a: {
                            "$ref": "schemaA#"
                        }
                    }
                }
            ],
            validateSchemaOnly: true,
            valid: true
        }
    ]
};
