import utils from './utils';

export default {
    addBlock(state, obj) {
        const block = {
            id: utils.generateUUID(),
            title: '',
            data: ''
        }
        if(obj) {
            obj.title ? block.title = obj.title : '';
            obj.data ? block.data = obj.data : '';
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
};
