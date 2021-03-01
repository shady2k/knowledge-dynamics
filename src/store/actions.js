import utils from "./utils";

export default {
    addNewBlock(store, schemaCurrent) {
        console.log(store);
        store.element.addToTheEnd();        
        
        const schemaId = utils.generateUUID();
        const blockId = utils.generateUUID();
        store.commit("addBlock", {
            block: {
                id: blockId,
            },
        });
        store.commit("addBlockToSchema", {
            schemaId,
            blockId,
            schemaCurrent,
        });
        store.commit("setActiveBlock", schemaId);
        return schemaId;
    },

    getBlockData(store, blockId) {
        return store.getters.getBlockData(blockId);
    },

    getSchemaById(store, schemaId) {
        return store.element.getSchemaById(schemaId);
    },

    focusBlock(store, blockId) {},
};
