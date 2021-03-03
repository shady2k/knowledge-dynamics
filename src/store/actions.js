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

        let parent = null;
        if(schema.children && schema.children.length === 0) {
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
            
            parent = schema;

            store.commit('addSchema', {
                arr: schema.children,
                blockId: blockIdNew,
                parentId: parent.schemaId,
                type: 'unshift'
            });            

        }

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
        
        const prev = store.getters.getPrevIndexSchema(schema);
        if(!prev) return;

        const target = prev;
        if(!target) return;

        let parent = null;
        if(schema.parentId) {
            parent = store.getters.getSchemaById(schema.parentId);
        } else {
            parent = store.state.element;
        }

        const index = store.getters.getIndexInArrayBySchemaId({
            arr: parent.children,
            needle: schema.schemaId
        });

        if(index === -1) return;

        store.commit('identBlock', {
            schema,
            parent,
            target,
            index
        });
    },

    unIdentBlock(store, obj) {
        const schema = obj;
        
        let target = null;
        let targetIndex = null;
        let parent = null;

        if(schema.parentId) {
            parent = store.getters.getSchemaById(schema.parentId);
        } else {
            return;
        }

        if(!parent) return;

        if(parent.parentId) {
            const parentParent = store.getters.getSchemaById(parent.parentId);
            if(!parentParent) return;
            target = parentParent;
        } else {
            target = store.state.element;
        }

        if(!target) return;

        const nextBlock = store.getters.getNextSchema(schema.schemaId);
        if(nextBlock) {
            if(target.schemaId === nextBlock.parentId) {
                const nextBlockIndex = store.getters.getIndexInArrayBySchemaId({
                    arr: target.children,
                    needle: nextBlock.schemaId
                });
                if(nextBlockIndex !== -1) {
                    targetIndex = nextBlockIndex;
                } else {
                    return;
                }
            } else {
                const parentBlockIndex = store.getters.getIndexInArrayBySchemaId({
                    arr: target.children,
                    needle: parent.schemaId
                });
                targetIndex = parentBlockIndex + 1;
            }
        }

        if(!targetIndex) return;

        const index = store.getters.getIndexInArrayBySchemaId({
            arr: parent.children,
            needle: schema.schemaId
        });

        if(index === -1) return;
        
        store.commit('unIdentBlock', {
            schema,
            parent,
            target,
            index,
            targetIndex
        });

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
