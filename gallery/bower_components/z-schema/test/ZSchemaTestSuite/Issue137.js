"use strict";

var schema1 = {
    "definitions": {
        "thing": {
            "$ref": "#/definitions/thing" // <--- circular reference to self
        }
    }
};

var schema2 = {
    "definitions": {
        "person": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "spouse": {
                    "$ref": "#/definitions/person" // <--- circular reference to ancestor
                }
            }
        }
    }
};

var schema3 = {
    "definitions": {
        "parent": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "children": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/child" // <--- indirect circular reference
                    }
                }
            }
        },
        "child": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "parents": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/parent" // <--- indirect circular reference
                    }
                }
            }
        }
    }
};

module.exports = {
    description: "Issue #137 - circular dependencies between schemas",
    tests: [
        {
            description: "should pass validation #1",
            schema: schema1,
            validateSchemaOnly: true,
            valid: true
        },
        {
            description: "should pass validation #2",
            schema: schema2,
            validateSchemaOnly: true,
            valid: true
        },
        {
            description: "should pass validation #3",
            schema: schema3,
            validateSchemaOnly: true,
            valid: true
        }
    ]
};
