"use strict";

module.exports = {
    description: "Issue #121 - ignoreUnknownFormats",
    options: {
        ignoreUnknownFormats: true
    },
    tests: [
        {
            description: "should not fail when ignoring unknown formats",
            schema: {
                type: "string",
                format: "unknown"
            },
            valid: true,
            validateSchemaOnly: true
        }
    ]
};
