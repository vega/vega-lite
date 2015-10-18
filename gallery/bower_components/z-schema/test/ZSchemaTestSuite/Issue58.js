"use strict";

module.exports = {
    description: "Issue #58 - getMissingReferences should return all missing references",
    tests: [
        {
            description: "should fail validation",
            schema: {
              "id": "root.json",
              "person": {
                "id": "personDetails",
                "type": "object",
                "properties": {
                  "firstName": {
                    "type": "string"
                  },
                  "lastName": {
                    "type": "string"
                  }
                },
                "required": ["firstName", "lastName"]
              },
              "addr": {
                "id": "addressDetails",
                "type": "object",
                "properties": {
                  "street": {
                    "type": "string"
                  },
                  "city": {
                    "type": "string"
                  }
                },
                "required": ["street", "city"]
              },
              "peraddr": {
                "id": "personWithAddress",
                "allOf": [{
                  "$ref": "#personDetails"
                }, {
                  "$ref": "#addressDetails"
                }, {
                  "$ref": "#/yy"
                }, {
                  "$ref": "#xx"
                }]
              }
            },
            validateSchemaOnly: true,
            valid: false,
            after: function (err, valid, data, validator) {
                var missingReferences = validator.getMissingReferences();
                expect(missingReferences.length).toBe(2);
                expect(missingReferences.indexOf("#xx")).not.toBe(-1);
                expect(missingReferences.indexOf("#/yy")).not.toBe(-1);
                var missingRemoteReferences = validator.getMissingRemoteReferences();
                expect(missingRemoteReferences.length).toBe(0);
            }
        }
    ]
};
