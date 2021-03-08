import utils from "./utils";
import {
    Schema,
    Block,
    Element
} from "./class";

export default {
    changeBlock(state, obj) {
        state.element.blocks.some((element) => {
            if (element.blockId == obj.blockId) {
                Object.assign(element, obj);
                //element.data = obj.data;
                return true;
            } else {
                return false;
            }
        });
    },

    addBlock(state, block) {
        block = new Block(block);
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

                    if (e.children.length === 0) {
                        if (e.parentId) {
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

    identBlock: function (state, obj) {
        // const store = this;
        let schema = obj.schema;
        const parent = obj.parent;
        const target = obj.target;
        const index = obj.index;

        parent.children.splice(index, 1);
        schema.parentId = target.schemaId;
        target.children.push(schema);
    },

    unIdentBlock: function (state, obj) {
        // const store = this;
        let schema = obj.schema;
        const parent = obj.parent;
        const target = obj.target;
        const index = obj.index;
        const targetIndex = obj.targetIndex;

        parent.children.splice(index, 1);
        schema.parentId = target.schemaId;
        target.children.splice(targetIndex, 0, schema);
    },

    addSchema: function (state, obj) {
        const arr = obj.arr;
        const blockId = obj.blockId;
        const parentId = obj.parentId;
        const type = obj.type || "push";
        const index = obj.index || null;

        const schemaIdNew = utils.generateUUID();

        const schema = new Schema(state, {
            schemaId: schemaIdNew,
            blockId: blockId,
            parentId: parentId,
            children: [],
        });

        if (type === "unshift") {
            arr.unshift(schema);

        } else if (type === "push") {
            arr.push(schema);

        } else if (type === "splice") {
            arr.splice(index, 0, schema);
        }

        state.element = Object.assign({}, state.element);
    },

    swapBlocks: function (state, obj) {
        const index = obj.index;
        const targetIndex = obj.targetIndex;
        let arr = obj.arr;
        //let parent = obj.parent;

        const swapArrayLocs = (arr, index1, index2) => {
            [arr[index1], arr[index2]] = [arr[index2], arr[index1]]
        }
        
        swapArrayLocs(arr, index, targetIndex);
        state.element = Object.assign({}, state.element);
    },

    setActiveBlock(state, schemaId) {
        state.editor.activeBlock = schemaId;
    },

    unsetActiveBlock(state) {
        state.editor.activeBlock = null;
    },

    createTodayElement(state, obj) {
        const element = new Element(obj);
        state.element = element;
    }

};