export const state = {
    count: 0,
    editor: {
        activeBlock: null
    },
    element: {
        title: "test",
        length: 6,
        schema: [
            {
                schemaId : "0",
                blockId: "0",
                parentId: null,
                children: [],
            },
            {
                schemaId : "1",
                blockId: "1",
                parentId: null,
                children: [
                    { 
                        schemaId : "2",
                        blockId: "2",
                        parentId: "1",
                        children: [
                            { 
                                schemaId : "3",
                                blockId: "1",
                                parentId: "2",
                            },
                        ]
                    },
                    { 
                        schemaId : "4",
                        blockId: "3",
                        parentId: "1",
                    },
                ]
            },
            { 
                schemaId : "5",
                blockId: "4",
                parentId: null,
            },
        ],
        blocks: [
            {
                blockId: "0",
                data: "test0",
            },
            {
                blockId: "1",
                data: "test1",
            },
            {
                blockId: "4",
                data: "test4"
            },
            {
                blockId: "2",
                data: "test2"
            },
            {
                blockId: "3",
                data: "test3"
            },
            {
                blockId: "5",
                data: "test5"
            }
        ],
    },
};
