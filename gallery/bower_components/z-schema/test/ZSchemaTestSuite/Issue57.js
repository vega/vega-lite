"use strict";

var dataTypeBaseJson = {
    "id": "http://wordnik.github.io/schemas/v1.2/dataTypeBase.json#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "Data type fields (section 4.3.3)",
    "type": "object",
    "oneOf": [
        {
            "required": [
        "type"
      ]
    },
        {
            "required": [
        "$ref"
      ]
    }
  ],
    "properties": {
        "type": {
            "type": "string"
        },
        "$ref": {
            "type": "string"
        },
        "format": {
            "type": "string"
        },
        "defaultValue": {
            "not": {
                "type": [
          "array",
          "object",
          "null"
        ]
            }
        },
        "enum": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "minimum": {
            "type": "string"
        },
        "maximum": {
            "type": "string"
        },
        "items": {
            "$ref": "#/definitions/itemsObject"
        },
        "uniqueItems": {
            "type": "boolean"
        }
    },
    "dependencies": {
        "format": {
            "oneOf": [
                {
                    "properties": {
                        "type": {
                            "enum": [
                "integer"
              ]
                        },
                        "format": {
                            "enum": [
                "int32",
                "int64"
              ]
                        }
                    }
        },
                {
                    "properties": {
                        "type": {
                            "enum": [
                "number"
              ]
                        },
                        "format": {
                            "enum": [
                "float",
                "double"
              ]
                        }
                    }
        },
                {
                    "properties": {
                        "type": {
                            "enum": [
                "string"
              ]
                        },
                        "format": {
                            "enum": [
                "byte",
                "date",
                "date-time"
              ]
                        }
                    }
        }
      ]
        }
    },
    "definitions": {
        "itemsObject": {
            "oneOf": [
                {
                    "type": "object",
                    "required": [
            "$ref"
          ],
                    "properties": {
                        "$ref": {
                            "type": "string"
                        }
                    },
                    "additionalProperties": false
        },
                {
                    "allOf": [
                        {
                            "$ref": "#"
            },
                        {
                            "required": [
                "type"
              ],
                            "properties": {
                                "type": {},
                                "format": {}
                            },
                            "additionalProperties": false
            }
          ]
        }
      ]
        }
    }
};
var modelsObjectJson = {
    "id": "http://wordnik.github.io/schemas/v1.2/modelsObject.json#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "required": [
    "id",
    "properties"
  ],
    "properties": {
        "id": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "properties": {
            "type": "object",
            "additionalProperties": {
                "$ref": "#/definitions/propertyObject"
            }
        },
        "subTypes": {
            "type": "array",
            "items": {
                "type": "string"
            },
            "uniqueItems": true
        },
        "discriminator": {
            "type": "string"
        }
    },
    "dependencies": {
        "subTypes": [
      "discriminator"
    ]
    },
    "definitions": {
        "propertyObject": {
            "allOf": [
                {
                    "not": {
                        "$ref": "#"
                    }
        },
                {
                    "$ref": "dataTypeBase.json#"
        }
      ]
        }
    }
};
var oauth2GrantTypeJson = {
    "id": "http://wordnik.github.io/schemas/v1.2/oauth2GrantType.json#",
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
            "required": [
        "loginEndpoint"
      ],
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
            "required": [
        "tokenEndpoint",
        "tokenRequestEndpoint"
      ],
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
            "required": [
        "url"
      ],
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
            "required": [
        "url"
      ],
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
            "required": [
        "url"
      ],
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
var authorizationObjectJson = {
    "id": "http://wordnik.github.io/schemas/v1.2/authorizationObject.json#",
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
            "required": [
        "type"
      ],
            "properties": {
                "type": {
                    "enum": [
            "basicAuth"
          ]
                }
            },
            "additionalProperties": false
        },
        "apiKey": {
            "required": [
        "type",
        "passAs",
        "keyname"
      ],
            "properties": {
                "type": {
                    "enum": [
            "apiKey"
          ]
                },
                "passAs": {
                    "enum": [
            "header",
            "query"
          ]
                },
                "keyname": {
                    "type": "string"
                }
            },
            "additionalProperties": false
        },
        "oauth2": {
            "type": "object",
            "required": [
        "type",
        "grantTypes"
      ],
            "properties": {
                "type": {
                    "enum": [
            "oauth2"
          ]
                },
                "scopes": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/oauth2Scope"
                    }
                },
                "grantTypes": {
                    "$ref": "oauth2GrantType.json#"
                }
            },
            "additionalProperties": false
        },
        "oauth2Scope": {
            "type": "object",
            "required": [
        "scope"
      ],
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
var parameterObjectJson = {
    "id": "http://wordnik.github.io/schemas/v1.2/parameterObject.json#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "allOf": [
        {
            "$ref": "dataTypeBase.json#"
    },
        {
            "required": [
        "paramType",
        "name"
      ],
            "properties": {
                "paramType": {
                    "enum": [
            "path",
            "query",
            "body",
            "header",
            "form"
          ]
                },
                "name": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "required": {
                    "type": "boolean"
                },
                "allowMultiple": {
                    "type": "boolean"
                }
            }
    },
        {
            "description": "type File requires special paramType and consumes",
            "oneOf": [
                {
                    "properties": {
                        "type": {
                            "not": {
                                "enum": [
                  "File"
                ]
                            }
                        }
                    }
        },
                {
                    "properties": {
                        "type": {
                            "enum": [
                "File"
              ]
                        },
                        "paramType": {
                            "enum": [
                "form"
              ]
                        },
                        "consumes": {
                            "enum": [
                "multipart/form-data"
              ]
                        }
                    }
        }
      ]
    }
  ]
};
var operationObjectJson = {
    "id": "http://wordnik.github.io/schemas/v1.2/operationObject.json#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "allOf": [
        {
            "$ref": "dataTypeBase.json#"
    },
        {
            "required": [
        "method",
        "nickname",
        "parameters"
      ],
            "properties": {
                "method": {
                    "enum": [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
          ]
                },
                "summary": {
                    "type": "string",
                    "maxLength": 120
                },
                "notes": {
                    "type": "string"
                },
                "nickname": {
                    "type": "string",
                    "pattern": "^[a-zA-Z0-9_]+$"
                },
                "authorizations": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "array",
                        "items": {
                            "$ref": "authorizationObject.json#/definitions/oauth2Scope"
                        }
                    }
                },
                "parameters": {
                    "type": "array",
                    "items": {
                        "$ref": "parameterObject.json#"
                    }
                },
                "responseMessages": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/responseMessageObject"
                    }
                },
                "produces": {
                    "$ref": "#/definitions/mimeTypeArray"
                },
                "consumes": {
                    "$ref": "#/definitions/mimeTypeArray"
                },
                "deprecated": {
                    "enum": [
            "true",
            "false"
          ]
                }
            }
    }
  ],
    "definitions": {
        "responseMessageObject": {
            "type": "object",
            "required": [
        "code",
        "message"
      ],
            "properties": {
                "code": {
                    "$ref": "#/definitions/rfc2616section10"
                },
                "message": {
                    "type": "string"
                },
                "responseModel": {
                    "type": "string"
                }
            }
        },
        "rfc2616section10": {
            "type": "integer",
            "minimum": 100,
            "maximum": 600,
            "exclusiveMaximum": true
        },
        "mimeTypeArray": {
            "type": "array",
            "items": {
                "type": "string",
                "format": "mime-type"
            }
        }
    }
};
var apiDeclarationJson = {
    "id": "http://wordnik.github.io/schemas/v1.2/apiDeclaration.json#",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "required": [
    "swaggerVersion",
    "basePath",
    "apis"
  ],
    "properties": {
        "swaggerVersion": {
            "enum": [
        "1.2"
      ]
        },
        "apiVersion": {
            "type": "string"
        },
        "basePath": {
            "type": "string",
            "format": "uri",
            "pattern": "^https?://"
        },
        "resourcePath": {
            "type": "string",
            "format": "uri",
            "pattern": "^/"
        },
        "apis": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/apiObject"
            }
        },
        "models": {
            "type": "object",
            "additionalProperties": {
                "$ref": "modelsObject.json#"
            }
        },
        "produces": {
            "$ref": "#/definitions/mimeTypeArray"
        },
        "consumes": {
            "$ref": "#/definitions/mimeTypeArray"
        },
        "authorizations": {
            "$ref": "authorizationObject.json#"
        }
    },
    "additionalProperties": false,
    "definitions": {
        "apiObject": {
            "type": "object",
            "required": [
        "path",
        "operations"
      ],
            "properties": {
                "path": {
                    "type": "string",
                    "format": "uri-template",
                    "pattern": "^/"
                },
                "description": {
                    "type": "string"
                },
                "operations": {
                    "type": "array",
                    "items": {
                        "$ref": "operationObject.json#"
                    }
                }
            },
            "additionalProperties": false
        },
        "mimeTypeArray": {
            "type": "array",
            "items": {
                "type": "string",
                "format": "mime-type"
            }
        }
    }
};

module.exports = {
    description: "Issue #57 - maximum call stack exceeded error",
    setup: function (validator, Class) {
        Class.registerFormat("mime-type", function () {
            return true;
        });
        Class.registerFormat("uri-template", function () {
            return true;
        });
    },
    tests: [
        {
            description: "should pass validation #1",
            schema: [
                dataTypeBaseJson,
                modelsObjectJson,
                oauth2GrantTypeJson,
                authorizationObjectJson,
                parameterObjectJson,
                operationObjectJson,
                apiDeclarationJson
            ],
            validateSchemaOnly: true,
            valid: true
        }
    ]
};
