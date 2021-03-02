import utils from "./utils";

export default {
    addBlock(store, obj) {
        const schema = obj.schema;
        const schemaId = schema.schemaId;
        
        let block = obj.block;
        if(!block) {
            block = {};
        }
        const blockIdNew = utils.generateUUID();
        block.blockId = blockIdNew;
        store.commit('addBlock', block);

        if(schema.children && schema.children.length === 0) {
            let parent = null;
            if(schema.parentId) {
                parent = store.getters.getSchemaById(schema.parentId);
            } else {
                parent = store.state.element;
            }
            const childrenCount = parent.children.length;
            const index = store.getters.getIndexInArrayBySchemaId({
                arr: parent.children,
                needle: schemaId
            });

            if(index === (childrenCount - 1)) {
                store.commit('addSchema', {
                    arr: parent.children,
                    blockId: blockIdNew,
                    parentId: parent.schemaId,
                    type: 'push'
                });
            } else {
                store.commit('addSchema', {
                    arr: parent.children,
                    blockId: blockIdNew,
                    parentId: parent.schemaId,
                    type: 'splice',
                    index: index + 1
                });
            }
        } else {
            if(!schema.children) {
                schema.children = [];
            }
            
            store.commit('addSchema', {
                arr: schema.children,
                blockId: blockIdNew,
                parentId: parent.schemaId,
                type: 'unshift'
            });            

        }

        // if(schema.children && schema.children.length > 0) {
        //     store.commit('addBySchemaId', {
        //         schemaId: obj.schemaId,
        //         block: obj.block,
        //         type: 'unshift'
        //     });
        // } else if(schema.parentId) {
        //     store.commit('addBySchemaId', {
        //         schemaId: schema.parentId,
        //         block: obj.block,
        //         type: 'push'
        //     });
        // } else {
        //     store.commit('addBySchemaId', {
        //         schemaId: obj.schemaId,
        //         block: obj.block,
        //         type: 'splice'
        //     });
        // }

        const nextBlock = store.getters.getNextSchemaId(schema.schemaId);
        if(nextBlock) {
            store.commit('setActiveBlock', nextBlock);
        }
    },

    deleteBlock(store, obj) {
        const schema = obj;
        const prevBlock = store.getters.getPrevSchema(schema.schemaId);
        store.commit('deleteBlock', {
            schemaId: schema.schemaId
        });
        if(prevBlock) {
            store.commit('setActiveBlock', prevBlock);
        }
    },

    identBlock(store, obj) {
        const schema = obj;
        const parent = store.getters.getSchemaById(schema.parentId);
        if(!parent) return;
        const prev = store.getters.getPrevSchema(schema.schemaId);
        if(!prev) return;

        const prevIndex = store.getters.getIndexInArrayBySchemaId({
            arr: parent.children,
            needle: prev.schemaId
        });
        const index = store.getters.getIndexInArrayBySchemaId({
            arr: parent.children,
            needle: schema.schemaId
        });

        if(prevIndex !== -1) {
            store.commit('identBlock', {
                schema,
                parent,
                prev,
                index
            });
            return;
        }
    },

    setActiveBlock(store, obj) {
        const type = obj.type || 'current';
        let schemaId = null;

        if(obj.type === "current") {
            schemaId = obj.schemaId;
        } else if(obj.type === "prev") {
            const schema = store.getters.getPrevSchema(obj.schemaId);
            if(schema) {
                schemaId = schema.schemaId;
            }
        } else if(obj.type === "next") {
            const schema = store.getters.getNextSchema(obj.schemaId);
            if(schema) {
                schemaId = schema.schemaId;
            }
        }
        
        store.commit('setActiveBlock', schemaId);
    }
};
