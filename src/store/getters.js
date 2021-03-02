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

    getIndexInArrayBySchemaId: state => obj => {
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

    getNextSchema: (state, getters) => schemaId => {
        if(!schemaId) {
            return null;
        }
        const schema = getters.getSchemaById(schemaId);

        if(schema.children && schema.children.length > 0) {
            return schema.children[0].schemaId;
        } else {
            if(schema.parentId) {
                const parent = getters.getSchemaById(schema.parentId);
                const childrenCount = parent.children.length;

                const index = getters.getIndexInArrayBySchemaId({
                    arr: parent.children,
                    needle: schemaId
                });

                if(index === (childrenCount - 1)) {
                    const parentParent = getters.getSchemaById(parent.parentId);
                    const childrenParentCount = parentParent.children.length;
                    const parentIndex = getters.getIndexInArrayBySchemaId({
                        arr: parentParent.children,
                        needle: schema.parentId
                    });

                    if(parentIndex === (childrenParentCount - 1)) {
                        return null;
                    } else {
                        return parentParent.children[parentIndex + 1].schemaId;
                    }
                } else {
                    return parent.children[index + 1].schemaId;
                }
            } else {
                const parent = state.element;
                const childrenCount = parent.children.length;
                const index = getters.getIndexInArrayBySchemaId({
                    arr: parent.children,
                    needle: schemaId
                });

                if(index === (childrenCount - 1)) {
                    return null;
                } else {
                    return parent.children[index + 1].schemaId;
                }
            }
        }
    },

    getPrevSchema: state => schemaId => {

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
