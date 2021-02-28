export default {
    changeBlock(state, obj) {
        let block = null;
        block = state.element.blocks.find((item) => {
            return item.id === obj.id;
        });
        block.data = obj.data;
    },
};
