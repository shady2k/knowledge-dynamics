export default {
    getElementTitle: state => {
        return state.element.title;
    },

    getSchemaLength: state => {
        return state.element.length;
    },

    getSchema: state => {
        return state.element.children;
    },

    getSchemaById: state => schemaId => {
        if(!schemaId) {
            return state.element;
        }

        function find(data, id) {
            let result = null;

            data.some((e) => {
                if (e.schemaId == id) return (result = e);
                if (!result && e.children) result = find(e.children, id);
            });

            return result;
        }

        let schema = null;
        schema = find(state.element.children, schemaId);

        if (!schema) {
            return false;
        } else {
            return schema;
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

    traverseTree: () => obj => {
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
        traverse(flatMap, flatArr, obj);
        return { flatMap, flatArr };
    },

    getNextSchemaId: (state, getters) => schemaId => {
        const schema = getters.getNextSchema(schemaId);
        if(schema) {
            return schema.schemaId;
        }
    },

    getNextSchema: (state, getters) => schemaId => {
        const flat = getters.traverseTree(state.element);

        const index = flat.flatMap.get(schemaId);
        if(index === (flat.flatArr.length - 1)) {
            return null;
        } else {
            return flat.flatArr[index + 1];
        }
    },

    getPrevSchemaId: (state, getters) => schemaId => {
        const schema = getters.getPrevSchema(schemaId);
        if(schema) {
            return schema.schemaId;
        }
    },

    getPrevSchema: (state, getters) => schemaId => {
        const flat = getters.traverseTree(state.element);

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

    getBlockBySchemaId: state => schemaId => {
        const schema = this.getters.getSchemaById(schemaId);
        return this.getters.getBlockById(schema.blockId);
    },
};
