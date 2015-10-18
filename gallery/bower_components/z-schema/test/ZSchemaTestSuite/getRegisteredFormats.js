'use strict';

module.exports = {
    description: "getRegisteredFormats - return an array of format names",
    setup: function (validator, Class) {
        Class.registerFormat('phone', function (str) {
            return true;
        });

    },

    tests: [
        {
            description: "should pass validation for new format",
            valid: true,
            data: '01234567',
            schema: {
                "type": "string",
                "format": "phone"
            }
        }
    ]
};
