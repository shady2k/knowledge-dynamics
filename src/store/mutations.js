import utils from './utils';

export default {
    addBlockToTheEnd(state, obj) {
        state.element.addToTheEnd(obj);
    },
    /*addNewBlock(state, schemaId) {
        console.log(schemaId);
    },
    addBlock(state) {
        /*let block = {};
        const blockTemplate = {
            id: utils.generateUUID(),
            title: '',
            data: ''
        }
        block = Object.assign(blockTemplate, obj.block);
        state.element.blocks.push(block);*/
    //},
    // addBlockToSchema(state, obj) {
    //     const item = {
    //         blockId: obj.blockId,
    //         schemaId: obj.schemaId,
    //         parentId: obj.schemaCurrent.parentId
    //     }

    //     if(obj.schemaCurrent.parentId) {
    //         utils.pushBySchemaId(state, obj.schemaCurrent.parentId, item);
    //     }
    //     //const schema = this.getters.getSchema(obj.schemaIdParent);
    // },
    // changeBlock(state, obj) {
    //     let block = null;
    //     block = state.element.blocks.find((item) => {
    //         return item.id === obj.blockId;
    //     });
    //     block.data = obj.data;
    // },
    // setActiveBlock(state, schema) {
    //     state.editor.activeBlock = schema;
    // },
    // unsetActiveBlock(state) {
    //     state.editor.activeBlock = null;
    // },
    // identBlock(state, blockId) {

    // }
}