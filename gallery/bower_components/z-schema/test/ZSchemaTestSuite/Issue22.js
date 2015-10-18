"use strict";

module.exports = {
    description: "Issue #22 - recursive references",
    tests: [
        {
            description: "should pass validation",
            schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                    "is_and": { type: "boolean" },
                    "filters": {
                        type: "array",
                        additionalItems: false,
                        items: {
                            oneOf: [
                                { $ref: "#" },
                                { $ref: "#/definitions/last" }
                            ]
                        }
                    }
                },
                definitions: {
                    "last": {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                            "text": { type: "string" },
                            "is_last": { type: "boolean" },
                            "filters": { type: "array", additionalItems: false }
                        }
                    }
                }
            },
            data: {
                "is_and": false,
                "filters": [
                    {
                        "is_and": false,
                        "filters": [
                            {
                                "is_and": true,
                                "filters": [
                                    {
                                        "is_and": true,
                                        "filters": [
                                            {
                                                "is_and": true,
                                                "filters": [
                                                    {
                                                        "is_and": true,
                                                        "filters": [
                                                            {
                                                                "text": "ABC",
                                                                "is_last": true,
                                                                "filters": []
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            valid: true
        }
    ]
};
