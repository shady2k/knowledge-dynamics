export const state = {
    count: 0,
    editor: {
        activeBlock: null
    },
    element: {
        title: "test",
        length: 7,
        children: [
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
                                children: [],
                            },
                            { 
                                schemaId : "7",
                                blockId: "7",
                                parentId: "2",
                                children: [],
                            },
                        ]
                    },
                    { 
                        schemaId : "4",
                        blockId: "3",
                        parentId: "1",
                        children: [],
                    },
                ]
            },
            { 
                schemaId : "5",
                blockId: "4",
                parentId: null,
                children: [],
            },
            { 
                schemaId : "6",
                blockId: "6",
                parentId: null,
                children: [],
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
            },
            {
                blockId: "6",
                data: "test6"
            },
            {
                blockId: "7",
                data: "test7"
            }
        ],
    },
};
