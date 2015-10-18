"use strict";

module.exports = {
    description: "Issue #25 - hostname format behaviour",
    tests: [
        {
            description: "should pass validation",
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "ipAddress": {
                        "type": "string",
                        "oneOf": [
                            {
                                "format": "hostname"
                            },
                            {
                                "format": "ipv4"
                            },
                            {
                                "format": "ipv6"
                            }
                        ]
                    }
                }
            },
            data: {
                "ipAddress": "127.0.0.1"
            },
            valid: true
        }
    ]
};
