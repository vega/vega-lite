"use strict";

module.exports = {
    description: "Issue #130 - Improve escaping of slashes in path",
    tests: [
        {
            description: "should pass",
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "title": "Schema to test names that would otherwise conflict with the path handling",
                "type":  "object",
                "properties": {
                    "this/that": {
                        "type": "object",
                        "properties": {
                            "t/h/e/ /o/t/h/e/r": {
                                "type": "object",
                                "properties": {
                                    "man": {
                                        "type": "string"
                                    }
                                },
                                "required": ["man"]
                            }
                        },
                        "required": ["t/h/e/ /o/t/h/e/r"]
                    }
                }
            },
            data: {
                "this/that": {
                  "t/h/e/ /o/t/h/e/r": {}
                }
            },
            valid: false,
            after: function (err) {
                err.forEach(function (e) {
                    expect(e.path).toBe("#/this~1that/t~1h~1e~1 ~1o~1t~1h~1e~1r");
                });
            }
        }
    ]
};
