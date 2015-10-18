"use strict";

module.exports = {
    description: "Issue #41 - invalid schema",
    tests: [
        {
            description: "should fail schema validation",
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "id": "http://jsonschema.net#",
                "type": "array",
                "required": false,
                "items": {
                    "id": "http://jsonschema.net/5#",
                    "type": "object",
                    "required": false,
                    "properties": {
                        "identifiers": {
                            "id": "http://jsonschema.net/5/identifiers#",
                            "type": "array",
                            "required": false,
                            "items": {
                                "id": "http://jsonschema.net/5/identifiers/0#",
                                "type": "object",
                                "required": false,
                                "properties": {
                                    "identifier": {
                                        "id": "http://jsonschema.net/5/identifiers/0/identifier#",
                                        "type": "string",
                                        "required": false
                                    }
                                }
                            }
                        },
                        "vital": {
                            "id": "http://jsonschema.net/5/vital#",
                            "type": "object",
                            "required": false,
                            "properties": {
                                "name": {
                                    "id": "http://jsonschema.net/5/vital/name#",
                                    "type": "string",
                                    "required": false
                                },
                                "code": {
                                    "id": "http://jsonschema.net/5/vital/code#",
                                    "type": "string",
                                    "required": false
                                },
                                "code_system_name": {
                                    "id": "http://jsonschema.net/5/vital/code_system_name#",
                                    "type": "string",
                                    "required": false
                                }
                            }
                        },
                        "status": {
                            "id": "http://jsonschema.net/5/status#",
                            "type": "string",
                            "required": false
                        },
                        "date": {
                            "id": "http://jsonschema.net/5/date#",
                            "type": "array",
                            "required": false,
                            "items": {
                                "id": "http://jsonschema.net/5/date/0#",
                                "type": "object",
                                "required": false,
                                "properties": {
                                    "date": {
                                        "id": "http://jsonschema.net/5/date/0/date#",
                                        "type": "string",
                                        "required": false
                                    },
                                    "precision": {
                                        "id": "http://jsonschema.net/5/date/0/precision#",
                                        "type": "string",
                                        "required": false
                                    }
                                }
                            }
                        },
                        "interpretations": {
                            "id": "http://jsonschema.net/5/interpretations#",
                            "type": "array",
                            "required": false,
                            "items": {
                                "id": "http://jsonschema.net/5/interpretations/0#",
                                "type": "string",
                                "required": false
                            }
                        },
                        "value": {
                            "id": "http://jsonschema.net/5/value#",
                            "type": "integer",
                            "required": false
                        },
                        "unit": {
                            "id": "http://jsonschema.net/5/unit#",
                            "type": "string",
                            "required": false
                        }
                    }
                }
            },
            validateSchemaOnly: true,
            valid: false
        }
    ]
};
