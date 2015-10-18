"use strict";

var ZSchema = require("../../src/ZSchema");

function setRemoteReferences(validator) {
    validator.setRemoteReference("http://json-schema.org/draft-04/schema",
                                 require("../files/draft-04-schema.json"));
    validator.setRemoteReference("http://localhost:1234/integer.json",
                                 require("../jsonSchemaTestSuite/remotes/integer.json"));
    validator.setRemoteReference("http://localhost:1234/subSchemas.json",
                                 require("../jsonSchemaTestSuite/remotes/subSchemas.json"));
    validator.setRemoteReference("http://localhost:1234/folder/folderInteger.json",
                                 require("../jsonSchemaTestSuite/remotes/folder/folderInteger.json"));
}

var jsonSchemaTestSuiteFiles = [
    require("../jsonSchemaTestSuite/tests/draft4/additionalItems.json"),
    require("../jsonSchemaTestSuite/tests/draft4/additionalProperties.json"),
    require("../jsonSchemaTestSuite/tests/draft4/allOf.json"),
    require("../jsonSchemaTestSuite/tests/draft4/anyOf.json"),
    require("../jsonSchemaTestSuite/tests/draft4/default.json"),
    require("../jsonSchemaTestSuite/tests/draft4/definitions.json"),
    require("../jsonSchemaTestSuite/tests/draft4/dependencies.json"),
    require("../jsonSchemaTestSuite/tests/draft4/enum.json"),
    require("../jsonSchemaTestSuite/tests/draft4/items.json"),
    require("../jsonSchemaTestSuite/tests/draft4/maximum.json"),
    require("../jsonSchemaTestSuite/tests/draft4/maxItems.json"),
    require("../jsonSchemaTestSuite/tests/draft4/maxLength.json"),
    require("../jsonSchemaTestSuite/tests/draft4/maxProperties.json"),
    require("../jsonSchemaTestSuite/tests/draft4/minimum.json"),
    require("../jsonSchemaTestSuite/tests/draft4/minItems.json"),
    require("../jsonSchemaTestSuite/tests/draft4/minLength.json"),
    require("../jsonSchemaTestSuite/tests/draft4/minProperties.json"),
    require("../jsonSchemaTestSuite/tests/draft4/multipleOf.json"),
    require("../jsonSchemaTestSuite/tests/draft4/not.json"),
    require("../jsonSchemaTestSuite/tests/draft4/oneOf.json"),
    require("../jsonSchemaTestSuite/tests/draft4/pattern.json"),
    require("../jsonSchemaTestSuite/tests/draft4/patternProperties.json"),
    require("../jsonSchemaTestSuite/tests/draft4/properties.json"),
    require("../jsonSchemaTestSuite/tests/draft4/ref.json"),
    require("../jsonSchemaTestSuite/tests/draft4/refRemote.json"),
    require("../jsonSchemaTestSuite/tests/draft4/required.json"),
    require("../jsonSchemaTestSuite/tests/draft4/type.json"),
    require("../jsonSchemaTestSuite/tests/draft4/uniqueItems.json"),
    // optional
    require("../jsonSchemaTestSuite/tests/draft4/optional/bignum.json"),
    require("../jsonSchemaTestSuite/tests/draft4/optional/format.json")
    // zeroTerminatedFloats.json is excluded because JavaScript doesn't distinguish between different types of numeric values
    // require("../jsonSchemaTestSuite/tests/draft4/optional/zeroTerminatedFloats.json")
];

var testExcludes = [
    "an invalid URI",
    "an invalid URI though valid URI reference"
];

describe("JsonSchemaTestSuite", function () {

    it("should contain 30 files", function () {
        expect(jsonSchemaTestSuiteFiles.length).toBe(30);
    });

    jsonSchemaTestSuiteFiles.forEach(function (testDefinitions, fileIndex) {

        testDefinitions.forEach(function (testDefinition) {

            testDefinition.tests.forEach(function (test) {

                if (testExcludes.indexOf(test.description) !== -1) { return; }

                it("[" + fileIndex + "]" + testDefinition.description + " - " + test.description + ": " + JSON.stringify(test.data), function () {

                    var validator = new ZSchema();
                    setRemoteReferences(validator);

                    var valid = validator.validate(test.data, testDefinition.schema);
                    expect(valid).toBe(test.valid);

                    if (valid !== test.valid) {
                        if (!valid) {
                            var errors = validator.getLastErrors();
                            expect(errors).toBe(null);
                        }
                    }

                });

            });

        });

    });

});
