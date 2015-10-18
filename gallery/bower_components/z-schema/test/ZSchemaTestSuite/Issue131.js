"use strict";

module.exports = {
    description: "Issue #131 - Top-level errors obscure deeper errors",
    tests: [
        {
            description: "should pass",
            options: {
              breakOnFirstError: false
            },
            schema: {
                "title": "Nested requirements don't work",
                "type":  "object",
                "properties": {
                    "required": {
                        "type": "string"
                    },
                    "nested": {
                        "type": "object",
                        "properties": {
                            "required": {
                                "type": "string"
                            }
                        },
                        "required": ["required"]
                    }
                },
                "required" : ["required"]
            },
            data: { "nested": { } },
            valid: false,
            after: function (err) {
                expect(err.length).toBe(2);
                if (err.length === 2) {
                    expect(err[0].code).toBe("OBJECT_MISSING_REQUIRED_PROPERTY");
                    expect(err[1].code).toBe("OBJECT_MISSING_REQUIRED_PROPERTY");
                }
            }
        }
    ]
};
