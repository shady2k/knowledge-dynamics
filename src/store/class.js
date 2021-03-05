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
        this.dbId = block.dbId || null;
        this.title = block.title || '';
        this.data = block.data || '';
    }
}

class Element {
    constructor(element) {
        this.schemaId = element.schemaId || utils.generateUUID();
        this.blockId = element.blockId || utils.generateUUID();
        this.dbId = element.dbId || null;
        this.data = element.data || '';
        this.children = element.children || [];
        this.blocks = element.blocks || [];
    }

    get length() {
        return this.blocks.length;
    }
}

export { Schema, Block, Element };