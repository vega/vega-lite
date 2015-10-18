"use strict";

module.exports = {
    description: "Issue #71 - additionalProperties problem",
    tests: [
        {
            description: "should have one error #1",

            schema: {
                type: "object",
                minProperties: 1,
                additionalProperties: false,
                properties: {
                    foo: {
                        type: "object",
                        minProperties: 1
                    }
                }
            },

            data: { foo: {}, bar: 1 },

            valid: false,

            after: function (errors) {
                expect(errors.length).toBe(1);
            }
        },

        {
            description: "should have one error #2",

            schema: {
                type: "object",
                minProperties: 1,
                additionalProperties: false,
                properties: {
                    foo: {
                        type: "object",
                        minProperties: 1,
                        additionalProperties: false,
                        properties: {
                            foo: {}
                        }
                    }
                }
            },

            data: { foo: {}, bar: 1 },

            valid: false,

            after: function (errors) {
                expect(errors.length).toBe(1);
            }
        },

        {
            description: "should have more than one error with breakOnFirstError false #1",

            options: {
                breakOnFirstError: false
            },

            schema: {
                type: "object",
                minProperties: 1,
                additionalProperties: false,
                properties: {
                    foo: {
                        type: "object",
                        minProperties: 1
                    }
                }
            },

            data: { foo: {}, bar: 1 },

            valid: false,

            after: function (errors) {
                expect(errors.length).toBeGreaterThan(1);
            }
        },

        {
            description: "should have more than one error with breakOnFirstError false #2",

            options: {
                breakOnFirstError: false
            },

            schema: {
                type: "object",
                minProperties: 1,
                additionalProperties: false,
                properties: {
                    foo: {
                        type: "object",
                        minProperties: 1,
                        additionalProperties: false,
                        properties: {
                            foo: {}
                        }
                    }
                }
            },

            data: { foo: {}, bar: 1 },

            valid: false,

            after: function (errors) {
                expect(errors.length).toBeGreaterThan(1);
            }
        }
    ]
};
