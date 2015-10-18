"use strict";

var isBrowser = typeof window !== "undefined";
var ZSchema = require("../../src/ZSchema");
if (!isBrowser) {
    var request = require("request");
}

function validateWithAutomaticDownloads(validator, data, schema, callback) {

    var lastResult;

    function finish() {
        callback(validator.getLastErrors(), lastResult);
    }

    function validate() {

        lastResult = validator.validate(data, schema);

        var missingReferences = validator.getMissingRemoteReferences();
        if (missingReferences.length > 0) {
            var finished = 0;
            missingReferences.forEach(function (url) {
                request(url, function (error, response, body) {
                    validator.setRemoteReference(url, JSON.parse(body));
                    finished++;
                    if (finished === missingReferences.length) {
                        validate();
                    }
                });
            });
        } else {
            finish();
        }

    }

    validate();

}

describe("Automatic schema loading", function () {

    it("should download schemas and validate successfully", function (done) {

        if (isBrowser) {
            // skip this test in browsers
            expect(1).toBe(1);
            done();
            return;
        }

        var validator = new ZSchema();
        var schema = { "$ref": "http://json-schema.org/draft-04/schema#" };
        var data = { "minLength": 1 };

        validateWithAutomaticDownloads(validator, data, schema, function (err, valid) {
            expect(valid).toBe(true);
            expect(err).toBe(undefined);
            done();
        });

    });

    it("should download schemas and fail validating", function (done) {

        if (typeof window !== "undefined") {
            // skip this test in browsers
            expect(1).toBe(1);
            done();
            return;
        }

        var validator = new ZSchema();
        var schema = { "$ref": "http://json-schema.org/draft-04/schema#" };
        var data = { "minLength": -1 };

        validateWithAutomaticDownloads(validator, data, schema, function (err, valid) {
            expect(valid).toBe(false);
            expect(err[0].code).toBe("MINIMUM");
            done();
        });

    });

});
