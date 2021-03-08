const moment = require('moment'); 

export default {
    getElementTitle: (state, getters) => {
        if(!state.element.blockId) return null;
        const block = getters.getBlockById(state.element.blockId);
        return block.title;
    },

    getSchemaLength: state => {
        return state.element.children.length;
    },

    getSchema: state => {
        return state.element.children;
    },

    getRootSchema: state => {
        return state.element;
    },

    getIsElementEmpty: state => {
        if(state.element.blocks && state.element.blocks.length > 0) {
            const blocks = state.element.blocks;
            const res = blocks.some((block) => {
                if(block.data !== '' && block.blockId !== state.element.blockId) return true;
            });
            return !res;
        } else {
            return true;
        }
    },

    getSchemaById: (state, getters) => schemaId => {
        if(!schemaId) {
            return null;
        }

        const rootSchema = getters.getRootSchema;
        if(getters.getRootSchema.schemaId === schemaId) {
            return rootSchema;
        }

        const flat = getters.traversedTree;

        const index = flat.flatMap.get(schemaId);
        if(index !== -1) {
            return flat.flatArr[index];
        } else {
            return null;
        }
    },

    getIndexInArrayBySchemaId: () => obj => {
        const arr = obj.arr;
        const needle = obj.needle;
        let index = -1;
        arr.some(function(element, i) {
            if (element.schemaId == needle) {
                index = i;
                return true;
            }
        });
        return index;
    },

    getLastChild: (state, getters) => obj => {
        let result = null;
        if(!obj) {
            return result;
        }

        if(!result) {
            if(obj.children && obj.children.length > 0) {
                const childObj = obj.children[obj.children.length - 1];
                result = getters.getLastChild(childObj);
            } else {
                result = obj;
            }
        }

        return result;
    },

    traversedTree: (state) => {
        function traverse(flatMap, flatArr, obj) {
            if(obj.children && obj.children.length > 0) {
                obj.children.forEach((element) => {
                    const index = flatArr.push(element) - 1;
                    flatMap.set(element.schemaId, index);
                    traverse(flatMap, flatArr, element);
                });
            }
        }

        let flatMap = new Map();
        let flatArr = [];
        traverse(flatMap, flatArr, state.element);
        return { flatMap, flatArr };
    },

    getNextSchemaId: (state, getters) => schemaId => {
        const schema = getters.getNextSchema(schemaId);
        if(schema) {
            return schema.schemaId;
        }
    },

    getNextSchema: (state, getters) => schemaId => {
        const flat = getters.traversedTree;

        const index = flat.flatMap.get(schemaId);
        if(index === (flat.flatArr.length - 1)) {
            return null;
        } else {
            return flat.flatArr[index + 1];
        }
    },
    
    getNextIndexSchema: (state, getters) => schema => {
        if(!schema) return;
        let parent = null;
        if(schema.parentId) {
            parent = getters.getSchemaById(schema.parentId);
        } else {
            parent = state.element;
        }
        const index = getters.getIndexInArrayBySchemaId({
            arr: parent.children,
            needle: schema.schemaId
        });
        
        if(index !== -1) {
            if(index !== parent.children.length - 1) {
                return parent.children[index + 1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    },

    getPrevSchemaId: (state, getters) => schemaId => {
        const schema = getters.getPrevSchema(schemaId);
        if(schema) {
            return schema.schemaId;
        }
    },

    getPrevIndexSchema: (state, getters) => schema => {
        if(!schema) return;
        let parent = null;
        if(schema.parentId) {
            parent = getters.getSchemaById(schema.parentId);
        } else {
            parent = state.element;
        }
        const index = getters.getIndexInArrayBySchemaId({
            arr: parent.children,
            needle: schema.schemaId
        });
        
        if(index !== -1) {
            if(index !== 0) {
                return parent.children[index - 1];
            } else {
                return null;
            }
        } else {
            return null;
        }
    },

    getPrevSchema: (state, getters) => schemaId => {
        const flat = getters.traversedTree;

        const index = flat.flatMap.get(schemaId);
        if(index === 0) {
            return null;
        } else {
            return flat.flatArr[index - 1];
        }
    },

    getBlockById: state => blockId => {
        let block = null;
        block = state.element.blocks.find((item) => {
            return item.blockId === blockId;
        });
        if (!block) {
            return false;
        } else {
            return block;
        }
    },

    getBlockBySchemaId: () => schemaId => {
        const schema = this.getters.getSchemaById(schemaId);
        return this.getters.getBlockById(schema.blockId);
    },

    getTodayJounalTile: () => {
        return moment().locale('ru').format('LL');
    }
};
