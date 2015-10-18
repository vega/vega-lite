"use strict";

module.exports = {
    description: "Issue #76 - circular dependencies between schemas",
    tests: [
        {
            description: "should pass validation",
            schema: [
                {
                    id: "id",
                    type: "number"
                },
                {
                    id: "user",
                    type: "object",
                    properties: {
                        id: {
                            $ref: "id"
                        },
                        posts: {
                            type: "array",
                            items: {
                                $ref: "post"
                            }
                        }
                    }
                },
                {
                    id: "post",
                    type: "object",
                    properties: {
                        id: {
                            $ref: "id"
                        },
                        author: {
                            $ref: "user"
                        }
                    }
                }
            ],
            schemaIndex: 2,
            data: {
                id: 11,
                author: {
                    id: 1,
                    posts: [
                        {
                            id: 11,
                            author: {
                                id: 1
                            }
                        },
                        {
                            id: 12,
                            author: {
                                id: 1
                            }
                        },
                        {
                            id: 13,
                            author: {
                                id: 1
                            }
                        }
                    ]
                }
            },
            valid: true
        }
    ]
};
