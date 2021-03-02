import utils from "./utils";

export default {
    addBlock(store, obj) {
        const schema = store.getters.getSchemaById(obj.schemaId);
        if(schema.children && schema.children.length > 0) {
            store.commit('addBySchemaId', {
                schemaId: obj.schemaId,
                block: obj.block,
                type: 'unshift'
            });
        } else if(schema.parentId) {
            store.commit('addBySchemaId', {
                schemaId: schema.parentId,
                block: obj.block,
                type: 'push'
            });
        } else {
            store.commit('addBySchemaId', {
                schemaId: obj.schemaId,
                block: obj.block,
                type: 'splice'
            });
        }

        const nextBlock = store.getters.getNextSchemaId(obj.schemaId);
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
