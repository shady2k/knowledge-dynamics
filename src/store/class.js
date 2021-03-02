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

export { Schema };