export default {
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
};
