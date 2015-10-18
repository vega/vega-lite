"use strict";

var resourceObject = {
    "id": "resourceObject.json",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "required": ["path"],
    "properties": {
        "path": {
            "type": "string",
            "format": "uri"
        },
        "description": {
            "type": "string"
        }
    },
    "additionalProperties": false
};
var infoObject = {
    "id": "infoObject.json",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "info object (section 5.1.3)",
    "type": "object",
    "required": ["title", "description"],
    "properties": {
        "title": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "termsOfServiceUrl": {
            "type": "string",
            "format": "uri"
        },
        "contact": {
            "type": "string",
            "format": "email"
        },
        "license": {
            "type": "string"
        },
        "licenseUrl": {
            "type": "string",
            "format": "uri"
        }
    },
    "additionalProperties": false
};
var oauth2GrantType = {
    "id": "oauth2GrantType.json",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "minProperties": 1,
    "properties": {
        "implicit": {
            "$ref": "#/definitions/implicit"
        },
        "authorization_code": {
            "$ref": "#/definitions/authorizationCode"
        }
    },
    "definitions": {
        "implicit": {
            "type": "object",
            "required": ["loginEndpoint"],
            "properties": {
                "loginEndpoint": {
                    "$ref": "#/definitions/loginEndpoint"
                },
                "tokenName": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        },
        "authorizationCode": {
            "type": "object",
            "required": ["tokenEndpoint", "tokenRequestEndpoint"],
            "properties": {
                "tokenEndpoint": {
                    "$ref": "#/definitions/tokenEndpoint"
                },
                "tokenRequestEndpoint": {
                    "$ref": "#/definitions/tokenRequestEndpoint"
                }
            },
            "additionalProperties": false
        },
        "loginEndpoint": {
            "type": "object",
            "required": ["url"],
            "properties": {
                "url": {
                    "type": "string",
                    "format": "uri"
                }
            },
            "additionalProperties": false
        },
        "tokenEndpoint": {
            "type": "object",
            "required": ["url"],
            "properties": {
                "url": {
                    "type": "string",
                    "format": "uri"
                },
                "tokenName": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        },
        "tokenRequestEndpoint": {
            "type": "object",
            "required": ["url"],
            "properties": {
                "url": {
                    "type": "string",
                    "format": "uri"
                },
                "clientIdName": {
                    "type": "string"
                },
                "clientSecretName": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        }
    }
};
var authorizationObject = {
    "id": "authorizationObject.json",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "additionalProperties": {
        "oneOf": [
            {
                "$ref": "#/definitions/basicAuth"
      },
            {
                "$ref": "#/definitions/apiKey"
      },
            {
                "$ref": "#/definitions/oauth2"
      }
    ]
    },
    "definitions": {
        "basicAuth": {
            "required": ["type"],
            "properties": {
                "type": {
                    "enum": ["basicAuth"]
                }
            },
            "additionalProperties": false
        },
        "apiKey": {
            "required": ["type", "passAs", "keyname"],
            "properties": {
                "type": {
                    "enum": ["apiKey"]
                },
                "passAs": {
                    "enum": ["header", "query"]
                },
                "keyname": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        },
        "oauth2": {
            "type": "object",
            "required": ["type", "grantTypes"],
            "properties": {
                "type": {
                    "enum": ["oauth2"]
                },
                "scopes": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/oauth2Scope"
                    }
                },
                "grantTypes": {
                    "$ref": "oauth2GrantType.json"
                }
            },
            "additionalProperties": false
        },
        "oauth2Scope": {
            "type": "object",
            "required": ["scope"],
            "properties": {
                "scope": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        }
    }
};
var resourceListing = {
    "id": "resourceListing.json",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "required": ["swaggerVersion", "apis"],
    "properties": {
        "swaggerVersion": {
            "enum": ["1.2"]
        },
        "apis": {
            "type": "array",
            "items": {
                "$ref": "resourceObject.json"
            }
        },
        "apiVersion": {
            "type": "string"
        },
        "info": {
            "$ref": "infoObject.json"
        },
        "authorizations": {
            "$ref": "authorizationObject.json"
        }
    }
};

var schemaCombinations = {
    "authorizationObject.json": [
        oauth2GrantType,
        authorizationObject
    ],
    "infoObject.json": [
        infoObject
    ],
    "oauth2GrantType.json": [
        oauth2GrantType
    ],
    "resourceObject.json": [
        resourceObject
    ],
    "resourceListing.json": [
        resourceObject,
        infoObject,
        oauth2GrantType,
        authorizationObject,
        resourceListing
    ]
};

module.exports = {
    description: "Issue #45 - recompiling schemas results in 'Reference could not be resolved'",
    tests: [
        {
            description: "should pass schema validation #1",
            schema: schemaCombinations["authorizationObject.json"],
            validateSchemaOnly: true,
            valid: true
        },
        {
            description: "should pass schema validation #2",
            schema: schemaCombinations["infoObject.json"],
            validateSchemaOnly: true,
            valid: true
        },
        {
            description: "should pass schema validation #3",
            schema: schemaCombinations["oauth2GrantType.json"],
            validateSchemaOnly: true,
            valid: true
        },
        {
            description: "should pass schema validation #4",
            schema: schemaCombinations["resourceObject.json"],
            validateSchemaOnly: true,
            valid: true
        },
        {
            description: "should pass schema validation #5",
            schema: schemaCombinations["resourceListing.json"],
            validateSchemaOnly: true,
            valid: true
        }
    ]
};
