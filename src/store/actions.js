import utils from './utils';

export default {
    addNewBlock(store) {
        const id = utils.generateUUID();
        const block = {
            id
        }
        store.commit('addBlock', block);
        store.commit('setActiveBlock', id);
        return id;
    },

    getBlock(store, blockId) {
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

    focusBlock(store, blockId) {

    }
};
