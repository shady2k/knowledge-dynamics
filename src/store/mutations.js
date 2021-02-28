import utils from './utils';

export default {
    addBlock(state, obj) {
        let block = {};
        const blockTemplate = {
            id: utils.generateUUID(),
            title: '',
            data: ''
        }
        block = Object.assign(blockTemplate, obj.block);
        state.element.blocks.push(block);
    },
    addBlockToSchema(state, obj) {
        const item = {
            blockId: obj.blockId,
            level: 0,
            schemaId: obj.schemaId
        }
        state.element.schema.push(item);
    },
    changeBlock(state, obj) {
        let block = null;
        block = state.element.blocks.find((item) => {
            return item.id === obj.blockId;
        });
        block.data = obj.data;
    },
    setActiveBlock(state, blockId) {
        state.editor.activeBlock = blockId;
    }
};
