import utils from './utils';

export default {
    addNewBlock(store) {
        const schemaId = utils.generateUUID();
        const blockId = utils.generateUUID();
        store.commit('addBlock', { block: { id: blockId } });
        store.commit('addBlockToSchema', { schemaId, blockId });
        store.commit('setActiveBlock', schemaId);
        return schemaId;
    },

    getBlockData(store, blockId) {
        let block = null;
        block = store.state.element.blocks.find((item) => {
            return item.id === blockId;
        });
        if (!block) {
            return false;
        } else {
            return block;
        }
    },

    getSchema(store, schemaId) {
        function find(data, id) {
            let result = null;
          
            data.some(e => {
              if (e.schemaId == id) return result = e;
              if (!result && e.childs) result = find(e.childs, id)
            })
          
            return result;
          }

        let block = null;
        block = find(store.state.element.schema, schemaId);

        if (!block) {
            return false;
        } else {
            return block;
        }
    },

    focusBlock(store, blockId) {

    }
};
