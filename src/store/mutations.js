import utils from './utils';

export default {
    addBlock(state, obj) {
        const block = {
            id: utils.generateUUID(),
            title: '',
            data: ''
        }
        if(obj) {
            Object.assign(block, obj);
        }
        state.element.blocks.push(block);
    },
    changeBlock(state, obj) {
        let block = null;
        block = state.element.blocks.find((item) => {
            return item.id === obj.id;
        });
        block.data = obj.data;
    },
    setActiveBlock(state, blockId) {
        state.editor.activeBlock = blockId;
    }
};
