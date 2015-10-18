/*jshint -W101*/

"use strict";

module.exports = {
    description: "Issue #63 - unresolvable reference due to hash sign in id",
    tests: [
        {
            description: "should pass validation #1",
            schema: {
                "properties": {
                    "statementpost": {
                        "id": "#statementpost",
                        "type": [
                            "object"
                        ]
                    },
                    "statement": {
                        "id": "#statement",
                        "type": "object",
                    }
                }
            },
            validateSchemaOnly: true,
            valid: true
        },
        {
            description: "should pass validation #2",
            schema: {
                "properties": {
                    "uuid": {
                        "id": "#uuid",
                        "type": "string",
                        "pattern": "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{8}"
                    },
                    "mbox": {
                        "id": "#mbox",
                        "type": "object",
                        "properties": {
                            "mbox": {
                                "required": true,
                                "type": "string",
                                "format": "uri",
                                "pattern": "^mailto:"
                            }
                        },
                        "patternProperties": {
                            "^(mbox_sha1sum|account|openid)$": {
                                "type": "null"
                            }
                        }
                    },
                    "mbox_sha1sum": {
                        "id": "#mbox_sha1sum",
                        "type": "object",
                        "properties": {
                            "mbox_sha1sum": {
                                "required": true,
                                "type": "string"
                            }
                        },
                        "patternProperties": {
                            "^(mbox|account|openid)$": {
                                "type": "null"
                            }
                        }
                    },
                    "account": {
                        "id": "#account",
                        "type": "object",
                        "properties": {
                            "account": {
                                "required": true,
                                "type": "object",
                                "properties": {
                                    "homePage": {
                                        "type": "string",
                                        "format": "uri",
                                        "required": true
                                    },
                                    "name": {
                                        "type": "string",
                                        "required": true
                                    }
                                },
                                "additionalProperties": false
                            }
                        },
                        "patternProperties": {
                            "^(mbox_sha1sum|mbox|openid)$": {
                                "type": "null"
                            }
                        }
                    },
                    "openid": {
                        "id": "#openid",
                        "type": "object",
                        "properties": {
                            "openid": {
                                "required": true,
                                "type": "string",
                                "format": "uri"
                            }
                        },
                        "patternProperties": {
                            "^(mbox_sha1sum|account|mbox)$": {
                                "type": "null"
                            }
                        }
                    },
                    "inversefunctional": {
                        "id": "#inversefunctional",
                        "type": [
                            {
                                "$ref": "#mbox"
                },
                            {
                                "$ref": "#mbox_sha1sum"
                },
                            {
                                "$ref": "#account"
                },
                            {
                                "$ref": "#openid"
                }
            ]
                    },
                    "agent": {
                        "id": "#agent",
                        "type": [
                            {
                                "$ref": "#inversefunctional"
                }
            ],
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "objectType": {
                                "enum": ["Agent"]
                            },
                            "mbox": {},
                            "mbox_sha1sum": {},
                            "account": {},
                            "openid": {}
                        },
                        "additionalProperties": false
                    },
                    "groupBasics": {
                        "id": "#groupBasics",
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "objectType": {
                                "enum": ["Group"],
                                "required": true
                            },
                            "member": {
                                "type": "array",
                                "items": {
                                    "$ref": "#agent"
                                }
                            }
                        }
                    },
                    "anonymousgroup": {
                        "id": "#anonymousgroup",
                        "properties": {
                            "member": {
                                "required": true
                            },
                            "name": {},
                            "objectType": {}
                        },
                        "additionalProperties": false
                    },
                    "identifiedgroup": {
                        "id": "#identifiedgroup",
                        "extends": {
                            "$ref": "#inversefunctional"
                        },
                        "properties": {
                            "name": {},
                            "objectType": {},
                            "member": {},
                            "mbox": {},
                            "mbox_sha1sum": {},
                            "account": {},
                            "openid": {}
                        },
                        "additionalProperties": false
                    },
                    "group": {
                        "id": "#group",
                        "extends": {
                            "$ref": "#groupBasics"
                        },
                        "type": [
                            {
                                "$ref": "#anonymousgroup"
                },
                            {
                                "$ref": "#identifiedgroup"
                }
            ]
                    },
                    "languagemap": {
                        "id": "#languagemap",
                        "type": "object",
                        "patternProperties": {
                            "^(([a-zA-Z]{2,8}((-[a-zA-Z]{3}){0,3})(-[a-zA-Z]{4})?((-[a-zA-Z]{2})|(-\\d{3}))?(-[a-zA-Z\\d]{4,8})*(-[a-zA-Z\\d](-[a-zA-Z\\d]{1,8})+)*)|x(-[a-zA-Z\\d]{1,8})+|en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tsu|i-tay|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)$": {
                                "type": "string"
                            }
                        },
                        "additionalProperties": false
                    },
                    "extensions": {
                        "id": "#extensions",
                        "patternProperties": {
                            "^[a-zA-Z][a-zA-Z+.-]*:": {
                                "type": "any"
                            }
                        },
                        "additionalProperties": false
                    },
                    "activity": {
                        "id": "#activity",
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "string",
                                "format": "uri",
                                "required": true
                            },
                            "objectType": {
                                "enum": ["Activity"]
                            },
                            "definition": {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "$ref": "#languagemap"
                                    },
                                    "description": {
                                        "$ref": "#languagemap"
                                    },
                                    "type": {
                                        "type": "string",
                                        "format": "uri"
                                    },
                                    "interactionType": {
                                        "enum": [
                                "true-false",
                                "choice",
                                "fill-in",
                                "long-fill-in",
                                "matching",
                                "performance",
                                "sequencing",
                                "likert",
                                "numeric",
                                "other"
                            ]
                                    },
                                    "correctResponsesPattern": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "extensions": {
                                        "$ref": "#extensions"
                                    }
                                },
                                "patternProperties": {
                                    "^(choices|scale|source|target|steps)$": {
                                        "type": "object",
                                        "properties": {
                                            "id": {
                                                "type": "string",
                                                "required": true
                                            },
                                            "description": {
                                                "$ref": "#languagemap"
                                            }
                                        },
                                        "additionalProperties": false
                                    }
                                },
                                "additionalProperties": false
                            }
                        },
                        "additionalProperties": false
                    },
                    "objectagent": {
                        "id": "#objectagent",
                        "type": [
                            {
                                "$ref": "#agent"
                }
            ],
                        "properties": {
                            "objectType": {
                                "required": true
                            }
                        }
                    },
                    "statementref": {
                        "id": "#statementref",
                        "type": "object",
                        "properties": {
                            "objectType": {
                                "enum": ["StatementRef"],
                                "required": true
                            },
                            "id": {
                                "type": [
                                    {
                                        "$ref": "#uuid"
                        }
                    ],
                                "required": true
                            }
                        },
                        "additionalProperties": false
                    },
                    "substatement": {
                        "id": "#substatement",
                        "type": [
                            {
                                "$ref": "#statement"
                }
            ],
                        "properties": {
                            "objectType": {
                                "enum": ["SubStatement"],
                                "required": true
                            },
                            "object": {
                                "disallow": [
                                    {
                                        "properties": {
                                            "objectType": {
                                                "enum": ["SubStatement"]
                                            }
                                        }
                        }
                    ]
                            }
                        },
                        "patternProperties": {
                            "^(id|stored|authority|voided)$": {
                                "type": "null"
                            }
                        }
                    },
                    "statement": {
                        "id": "#statement",
                        "type": "object",
                        "properties": {
                            "id": {
                                "$ref": "#uuid"
                            },
                            "actor": {
                                "type": [
                                    {
                                        "$ref": "#agent"
                        },
                                    {
                                        "$ref": "#group"
                        }
                    ],
                                "required": true
                            },
                            "verb": {
                                "required": true,
                                "type": "object",
                                "properties": {
                                    "id": {
                                        "required": true,
                                        "type": "string",
                                        "format": "uri"
                                    },
                                    "display": {
                                        "$ref": "#languagemap"
                                    }
                                },
                                "additionalProperties": false
                            },
                            "object": {
                                "type": [
                                    {
                                        "$ref": "#activity"
                        },
                                    {
                                        "$ref": "#objectagent"
                        },
                                    {
                                        "$ref": "#group"
                        },
                                    {
                                        "$ref": "#statementref"
                        },
                                    {
                                        "$ref": "#substatement"
                        }
                    ],
                                "required": true
                            },
                            "objectType": {},
                            "result": {
                                "type": "object",
                                "properties": {
                                    "score": {
                                        "type": "object",
                                        "properties": {
                                            "scaled": {
                                                "type": "number",
                                                "minimum": 0,
                                                "maximum": 1
                                            },
                                            "raw": {
                                                "type": "number"
                                            },
                                            "min": {
                                                "type": "number"
                                            },
                                            "max": {
                                                "type": "number"
                                            }
                                        }
                                    },
                                    "success": {
                                        "type": "boolean"
                                    },
                                    "completion": {
                                        "type": "boolean"
                                    },
                                    "response": {
                                        "type": "string"
                                    },
                                    "duration": {
                                        "type": "string"
                                    },
                                    "extensions": {
                                        "$ref": "#extensions"
                                    }
                                },
                                "additionalProperties": false
                            },
                            "context": {
                                "type": "object",
                                "properties": {
                                    "registration": {
                                        "$ref": "#uuid"
                                    },
                                    "instructor": {
                                        "type": [
                                            {
                                                "$ref": "#agent"
                                },
                                            {
                                                "$ref": "#group"
                                }
                            ]
                                    },
                                    "team": {
                                        "type": [
                                            {
                                                "$ref": "#agent"
                                },
                                            {
                                                "$ref": "#group"
                                }
                            ]
                                    },
                                    "contextActivities": {
                                        "type": "object",
                                        "properties": {
                                            "parent": {
                                                "$ref": "#activity"
                                            },
                                            "grouping": {
                                                "$ref": "#activity"
                                            },
                                            "other": {
                                                "$ref": "#activity"
                                            }
                                        },
                                        "additionalProperties": false
                                    },
                                    "revision": {
                                        "type": "string"
                                    },
                                    "platform": {
                                        "type": "string"
                                    },
                                    "language": {
                                        "type": "string"
                                    },
                                    "statement": {
                                        "$ref": "#statementref"
                                    },
                                    "extensions": {
                                        "$ref": "#extensions"
                                    }
                                },
                                "additionalProperties": false
                            },
                            "timestamp": {
                                "type": "string"
                            },
                            "stored": {
                                "type": "string"
                            },
                            "authority": {
                                "type": [
                                    {
                                        "$ref": "#agent"
                        },
                                    {
                                        "type": [
                                            {
                                                "$ref": "#anonymousgroup"
                                }
                            ],
                                        "properties": {
                                            "member": {
                                                "type": "array",
                                                "minItems": 2,
                                                "maxItems": 2
                                            }
                                        }
                        }
                    ]
                            },
                            "voided": {
                                "type": "boolean"
                            }
                        },
                        "additionalProperties": false
                    }
                }
            },
            data: {
                "id": "fd41c918-b88b-4b20-a0a5-a4c32391aaa0",
                "actor": {
                    "objectType": "Blowup",
                    "name": "Project Tin Can API",
                    "mbox": "mailto:user@example.com"
                },
                "verb": {
                    "id": "http://adlnet.gov/expapi/verbs/created",
                    "display": {
                        "en-US": "created"
                    }
                },
                "object": {
                    "id": "http://example.adlnet.gov/xapi/example/simplestatement",
                    "definition": {
                        "name": {
                            "en-US": "simple statement"
                        },
                        "description": {
                            "en-US": "A simple Experience API statement. Note that the LRS does not need to have any prior information about the Actor (learner), the verb, or the Activity/object."
                        }
                    }
                }
            },
            valid: false
        }
    ]
};
