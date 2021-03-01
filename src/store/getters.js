export default {
    getElementTitle: state => {
        return state.element.title;
    },

    getSchemaLength: state => {
        return state.element.length;
    },

    getSchema: state => {
        return state.element.schema;
    },

    getSchemaById: state => schemaId => {
        if(!schemaId) {
            return state.element.schema;
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
        schema = find(state.element.schema, schemaId);

        if (!schema) {
            return false;
        } else {
            return schema;
        }
    },

    getBlockById: state => blockId => {
        console.log(blockId);
        console.log(state.element.blocks);
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
