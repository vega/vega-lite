/*jshint -W030 */

"use strict";

var ZSchema = require("../../src/ZSchema");

var testSuiteFiles = [
    require("../ZSchemaTestSuite/CustomFormats.js"),
    require("../ZSchemaTestSuite/CustomFormatsAsync.js"),
    require("../ZSchemaTestSuite/ForceAdditional.js"),
    require("../ZSchemaTestSuite/ForceItems.js"),
    require("../ZSchemaTestSuite/ForceMinLength.js"),
    require("../ZSchemaTestSuite/ForceMaxLength.js"),
    require("../ZSchemaTestSuite/ForceMinItems.js"),
    require("../ZSchemaTestSuite/ForceMaxItems.js"),
    require("../ZSchemaTestSuite/ForceProperties.js"),
    require("../ZSchemaTestSuite/IgnoreUnresolvableReferences.js"),
    require("../ZSchemaTestSuite/AssumeAdditional.js"),
    require("../ZSchemaTestSuite/NoEmptyArrays.js"),
    require("../ZSchemaTestSuite/NoEmptyStrings.js"),
    require("../ZSchemaTestSuite/NoTypeless.js"),
    require("../ZSchemaTestSuite/NoExtraKeywords.js"),
    require("../ZSchemaTestSuite/StrictUris.js"),
    require("../ZSchemaTestSuite/MultipleSchemas.js"),
    require("../ZSchemaTestSuite/ErrorPathAsArray.js"),
    require("../ZSchemaTestSuite/ErrorPathAsJSONPointer.js"),
    require("../ZSchemaTestSuite/PedanticCheck.js"),
    require("../ZSchemaTestSuite/getRegisteredFormats.js"),
    require("../ZSchemaTestSuite/InvalidId.js"),
    // issues
    require("../ZSchemaTestSuite/Issue12.js"),
    require("../ZSchemaTestSuite/Issue13.js"),
    require("../ZSchemaTestSuite/Issue16.js"),
    require("../ZSchemaTestSuite/Issue22.js"),
    require("../ZSchemaTestSuite/Issue25.js"),
    require("../ZSchemaTestSuite/Issue26.js"),
    require("../ZSchemaTestSuite/Issue37.js"),
    require("../ZSchemaTestSuite/Issue40.js"),
    require("../ZSchemaTestSuite/Issue41.js"),
    require("../ZSchemaTestSuite/Issue43.js"),
    require("../ZSchemaTestSuite/Issue44.js"),
    require("../ZSchemaTestSuite/Issue45.js"),
    require("../ZSchemaTestSuite/Issue47.js"),
    require("../ZSchemaTestSuite/Issue48.js"),
    require("../ZSchemaTestSuite/Issue49.js"),
    require("../ZSchemaTestSuite/Issue53.js"),
    require("../ZSchemaTestSuite/Issue56.js"),
    require("../ZSchemaTestSuite/Issue57.js"),
    require("../ZSchemaTestSuite/Issue58.js"),
    require("../ZSchemaTestSuite/Issue63.js"),
    require("../ZSchemaTestSuite/Issue64.js"),
    require("../ZSchemaTestSuite/Issue67.js"),
    require("../ZSchemaTestSuite/Issue71.js"),
    require("../ZSchemaTestSuite/Issue73.js"),
    require("../ZSchemaTestSuite/Issue76.js"),
    require("../ZSchemaTestSuite/Issue85.js"),
    require("../ZSchemaTestSuite/Issue94.js"),
    require("../ZSchemaTestSuite/Issue96.js"),
    require("../ZSchemaTestSuite/Issue98.js"),
    require("../ZSchemaTestSuite/Issue101.js"),
    require("../ZSchemaTestSuite/Issue102.js"),
    require("../ZSchemaTestSuite/Issue103.js"),
    require("../ZSchemaTestSuite/Issue106.js"),
    require("../ZSchemaTestSuite/Issue107.js"),
    require("../ZSchemaTestSuite/Issue121.js"),
    require("../ZSchemaTestSuite/Issue125.js"),
    require("../ZSchemaTestSuite/Issue126.js"),
    require("../ZSchemaTestSuite/Issue130.js"),
    require("../ZSchemaTestSuite/Issue131.js"),
    require("../ZSchemaTestSuite/Issue137.js"),

    undefined
];

describe("ZSchemaTestSuite", function () {

    var idx = testSuiteFiles.length;
    while (idx--) {
        if (testSuiteFiles[idx] == null) {
            testSuiteFiles.splice(idx, 1);
        }
    }

    it("should contain 62 files", function () {
        expect(testSuiteFiles.length).toBe(62);
    });

    testSuiteFiles.forEach(function (testSuite) {

        testSuite.tests.forEach(function (test) {

            var data = test.data;
            if (typeof data === "undefined") {
                data = testSuite.data;
            }

            var async               = test.async              || testSuite.async        || false,
                options             = test.options            || testSuite.options      || undefined,
                setup               = test.setup              || testSuite.setup,
                schema              = test.schema             || testSuite.schema,
                schemaIndex         = test.schemaIndex        || testSuite.schemaIndex  || 0,
                after               = test.after              || testSuite.after,
                validateSchemaOnly  = test.validateSchemaOnly || testSuite.validateSchemaOnly,
                failWithException   = test.failWithException  || testSuite.failWithException;

            !async && it(testSuite.description + ", " + test.description, function () {

                var validator = new ZSchema(options);
                var caughtErr;

                if (setup) { setup(validator, ZSchema); }

                var valid;
                try {
                    valid = validator.validateSchema(schema);
                } catch (err) {
                    if (!failWithException) {
                        throw err;
                    }
                    caughtErr = err;
                }

                if (valid && !validateSchemaOnly) {
                    if (Array.isArray(schema)) {
                        schema = schema[schemaIndex];
                    }
                    try {
                        valid = validator.validate(data, schema);
                    } catch (err) {
                        if (!failWithException) {
                            throw err;
                        }
                        caughtErr = err;
                    }
                }

                var err = caughtErr || validator.getLastErrors();

                if (failWithException) {
                    expect(caughtErr).toBeTruthy();
                } else {
                    expect(typeof valid).toBe("boolean", "returned response is not a boolean");
                    expect(valid).toBe(test.valid, "test result doesn't match expected test result");
                }

                if (test.valid === true) {
                    expect(err).toBe(undefined, "errors are not undefined when test is valid");
                }

                if (after) {
                    after(err, valid, data, validator);
                }

            });

            async && it(testSuite.description + ", " + test.description, function (done) {

                var validator = new ZSchema(options);
                if (setup) { setup(validator, ZSchema); }

                // see http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony
                var zalgo = false;

                var result = validator.validate(data, schema, function (err, valid) {
                    // make sure callback wasn't called synchronously
                    expect(zalgo).toBe(true, "callback was fired in synchronous way");
                    expect(typeof valid).toBe("boolean", "returned response is not a boolean");
                    expect(valid).toBe(test.valid, "test result doesn't match expected test result");
                    if (test.valid === true) {
                        expect(err).toBe(undefined, "errors are not undefined when test is valid");
                    }
                    if (after) {
                        after(err, valid, data);
                    }
                    done();

                });

                // never return anything when callback is specified
                expect(result).toBe(undefined, "validator returned something else than undefined in callback mode");
                zalgo = true;

            });

        });

    });

});
