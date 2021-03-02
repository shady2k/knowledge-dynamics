import utils from "./utils";

export default {
    addNewBlock(store, obj) {
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
    },

    deleteBlock(store, obj) {
        const schema = obj;
        store.commit('deleteBlock', {
            schemaId: schema.schemaId
        });
        if(schema.parentId) {
            store.commit('setActiveBlock', schema.parentId);
        } else {
            store.commit('setActiveBlock', schema.parentId);
        }
    }
};
