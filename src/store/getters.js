export default {
    getElementTitle: state => {
        return state.element.getElementTitle();
    },

    getStructureLength: state => {
        return state.element.getStructureLength();
    },

    getStructure: state => {
        return state.element.getStructure();
    },
/*
    getBlockData: state => blockId => {
        let block = null;
        block = state.element.blocks.find((item) => {
            return item.id === blockId;
        });
        if (!block) {
            return false;
        } else {
            return block;
        }
    },

    getSchema: state => schemaId => {
        function find(data, id) {
            let result = null;

            data.some((e) => {
                if (e.schemaId == id) return (result = e);
                if (!result && e.children) result = find(e.children, id);
            });

            return result;
        }

        let block = null;
        block = find(state.element.schema, schemaId);

        if (!block) {
            return false;
        } else {
            return block;
        }
    },*/
};
