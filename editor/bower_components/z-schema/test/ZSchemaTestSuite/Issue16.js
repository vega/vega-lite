"use strict";

module.exports = {
    description: "Issue #16 - schemas should be validated by references in $schema property",
    tests: [
        {
            description: "should pass validation",
            schema: {
                $schema: "http://json-schema.org/draft-04/hyper-schema#",
                links: []
            },
            validateSchemaOnly: true,
            valid: true
        },
        {
            description: "should fail validation",
            schema: {
                $schema: "http://json-schema.org/draft-04/hyper-schema#",
                links: null
            },
            validateSchemaOnly: true,
            valid: false
        }
    ]
};
