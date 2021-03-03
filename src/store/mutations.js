import utils from "./utils";
import { Schema } from "./class";

export default {
    // addBlockToTheEnd(state, obj) {
    //     const schemaId = utils.generateUUID();
    //     const blockId = utils.generateUUID();
    //     const block = {
    //         blockId,
    //         data: obj.data,
    //     };
    //     this.commit('addBlock', block);

    //     state.element.children.push({
    //         schemaId,
    //         blockId,
    //         parentId: null,
    //         children: [],
    //     });
    //     state.element.length++;
    // },

    changeBlock(state, obj) {
        state.element.blocks.some((element) => {
            if (element.blockId == obj.blockId) {
                element.data = obj.data;
                return true;
            } else {
                return false;
            }
        });
    },

    addBlock(state, block) {
        const blockTemplate = {
            blockId: utils.generateUUID(),
            title: '',
            data: ''
        }
        block = Object.assign(blockTemplate, block);
        state.element.blocks.push(block);
    },

    deleteBlock(state, obj) {
        const store = this;
        const schemaId = obj.schemaId;

        function deleteSchemaById(data, schemaId, type) {
            let result = null;

            data.some((e, index) => {
                if (e.schemaId == schemaId) {
                    result = e;
                    if (!e.children) e.children = [];
                    
                    if(e.children.length === 0) {
                        if(e.parentId) {
                            const parent = store.getters.getSchemaById(e.parentId);
                            parent.children.splice(index, 1);
                        } else {
                            state.element.children.splice(index, 1);
                        }
                    }

                    return;
                }
                if (!result && e.children) {
                    result = deleteSchemaById(e.children, schemaId, type);
                }
            });
        }

        deleteSchemaById(state.element.children, schemaId);
    },

    identBlock: function(state, obj) {
        // const store = this;
        let schema = obj.schema;
        const parent = obj.parent;
        const target = obj.target;
        const index = obj.index;

        parent.children.splice(index, 1);
        schema.parentId = target.schemaId;
        target.children.push(schema);
    },

    addSchema: function(state, obj) {
        const arr = obj.arr;
        const blockId = obj.blockId;
        const parentId = obj.parentId;
        const type = obj.type || "push";
        const index = obj.index || null;

        const schemaIdNew = utils.generateUUID();

        const schema = new Schema (state, {
            schemaId: schemaIdNew,
            blockId: blockId,
            parentId: parentId,
            children: [],
        });
        
        if (type === "unshift") {
            arr.unshift(schema);

        } else if(type === "push") {
            arr.push(schema);

        } else if(type === "splice") {
            arr.splice(index, 0, schema);
        }
    },

    // addBySchemaId: function(state, obj) {
    //     const schemaIdNew = utils.generateUUID();
    //     const blockIdNew = utils.generateUUID();
    //     const type = obj.type;
    //     const schemaId = obj.schemaId;
    //     const block = obj.block || {
    //         blockId: blockIdNew,
    //         data: "",
    //     };
    //     this.commit('addBlock', block);

    //     let schema = {
    //         schemaId: schemaIdNew,
    //         blockId: blockIdNew,
    //         parentId: null,
    //         children: [],
    //     }

    //     function findAndPush(data, schemaId, type) {
    //         let result = null;

    //         data.some((e, index) => {
    //             if (e.schemaId == schemaId) {
    //                 result = e;
    //                 if (!e.children) e.children = [];
                    
    //                 if (type === "unshift") {
    //                     schema.parentId = e.schemaId;
    //                     e.children.unshift(schema);

    //                 } else if(type === "push") {
    //                     schema.parentId = e.schemaId;
    //                     e.children.push(schema);

    //                 } else if(type === "splice") {
    //                     if(!e.parentId) {
    //                         state.element.children.splice(index + 1, 0, schema);
    //                     } else {
    //                         schema.parentId = e.parentId;
    //                         e.splice(index + 1, 0, schema);
    //                     }
    //                 }

    //                 return;
    //             }
    //             if (!result && e.children) {
    //                 result = findAndPush(e.children, schemaId, type);
    //             }
    //         });
    //     }

    //     findAndPush(state.element.children, schemaId, type);
    // },

    //addBlock(state) {
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
    setActiveBlock(state, schemaId) {
        state.editor.activeBlock = schemaId;
    },

    unsetActiveBlock(state) {
        state.editor.activeBlock = null;
    },
    // identBlock(state, blockId) {

    // }
};
