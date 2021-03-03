import utils from "./utils";

class Schema {
    constructor(state, schema) {
        if(!schema.blockId) {
            throw Error("Can't create schema without blockId!");
        }

        this._state = state;
        this.schemaId = schema.schemaId || utils.generateUUID();
        this.blockId = schema.blockId;
        this.parentId = schema.parentId || null;
        this.children = schema.children || [];
    }
}

class Block {
    constructor(block) {
        this.blockId = block.blockId || utils.generateUUID();
        this.title = block.title || '';
        this.data = block.data || '';
    }
}

export { Schema, Block };