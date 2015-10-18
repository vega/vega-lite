"use strict";

var ZSchema = require("../../src/ZSchema");

describe("Using multiple instances of Z-Schema", function () {

    it("Should pass all tests", function () {

        var schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "options": {
                    "enum": ["a", "b", "c"]
                }
            },
            "additionalProperties": false
        };

        var v;
        v = new ZSchema({ strictMode: true });
        expect(v.validateSchema(schema)).toBe(false, "1st");

        v = new ZSchema();
        expect(v.validateSchema(schema)).toBe(true, "2nd");

        v = new ZSchema({ strictMode: true });
        expect(v.validateSchema(schema)).toBe(false, "3rd");

    });

});
