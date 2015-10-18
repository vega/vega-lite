"use strict";

module.exports = {
    description: "InvalidId - check if schema with invalid id can be processed",
    validateSchemaOnly: true,
    tests: [
        {
            schema: {
                "id": {}
            },
            description: "should fail schema validation because id has incorrect value",
            valid: false
        }
    ]
};
