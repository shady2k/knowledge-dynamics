export const state = {
    count: 0,
    editor: {
        activeBlock: null
    },
    element: {
        title: "test",
        schema: [
            {
                schemaId : "1",
                blockId: "1",
                level: 0,
                childs: [
                    { 
                        schemaId : "2",
                        blockId: "2",
                        level: 1,
                        childs: [
                            { 
                                schemaId : "3",
                                blockId: "1",
                                level: 2,
                            },
                        ]
                    },
                    { 
                        schemaId : "4",
                        blockId: "3",
                        level: 1,
                    },
                ]
            },
            { 
                schemaId : "5",
                blockId: "4",
                level: 0,
            },
        ],
        blocks: [
            {
                id: "1",
                data: "test",
            },
            {
                id: "4",
                data: "test4"
            },
            {
                id: "2",
                data: "test2"
            },
            {
                id: "3",
                data: "test3"
            },
            {
                id: "5",
                data: "test5"
            }
        ],
    },
};
