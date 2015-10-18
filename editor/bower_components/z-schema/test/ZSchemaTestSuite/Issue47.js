"use strict";

var draft4 = require("./files/Issue47/draft4.json");
var modifiedSchema = require("./files/Issue47/swagger_draft_modified.json");
var realSchema = require("./files/Issue47/swagger_draft.json");
var json = require("./files/Issue47/sample.json");

module.exports = {
    description: "Issue #47 - references to draft4 subschema are not working",
    setup: function (validator) {
        validator.setRemoteReference("http://json-schema.orgx/draft-04/schema", draft4);
    },
    tests: [
        {
            description: "should pass validation #1",
            schema: modifiedSchema,
            data: json,
            valid: true
        },
        {
            description: "should pass validation #1",
            schema: realSchema,
            data: json,
            valid: true
        }
    ]
};
