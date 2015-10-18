"use strict";

module.exports = {
    description: "Issue #40 - validator ends up in infinite loop",
    tests: [
        {
            description: "should pass validation",
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "title": "Product set",
                "is_start": "boolean",
                "hierarchy": {
                    "$ref": "#/definitions/recursion"
                },
                "definitions": {
                    "recursion": {
                        "type": "object",
                        "additionalProperties": false,
                        "properties": {
                            "is_and": {
                                "type": "boolean"
                            },
                            "filters": {
                                "type": "array",
                                "additionalItems": false,
                                "items": {
                                    "$ref": "#/definitions/recursion"
                                }
                            }
                        }
                    }
                }
            },
            data: {
                "is_start": true,
                "hierarchy": {
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
                                                                    "is_and": true,
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
                }
            },
            valid: true
        }
    ]
};
