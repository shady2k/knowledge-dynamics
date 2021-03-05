import utils from "./utils";
const stringifyObject = require('stringify-object');
const moment = require('moment'); 

export default {
    addBlock(store, obj) {
        const schema = obj.schema;

        let block = obj.block;
        if (!block) {
            block = {};
        }
        const blockIdNew = utils.generateUUID();
        block.blockId = blockIdNew;
        store.commit("addBlock", block);

        let parent = null;
        if (schema.children && schema.children.length === 0) {
            if (schema.parentId) {
                parent = store.getters.getSchemaById(schema.parentId);
            } else {
                parent = store.state.element;
            }

            const childrenCount = parent.children.length;
            const index = store.getters.getIndexInArrayBySchemaId({
                arr: parent.children,
                needle: schema.schemaId,
            });

            if (index === childrenCount - 1) {
                store.commit("addSchema", {
                    arr: parent.children,
                    blockId: blockIdNew,
                    parentId: parent.schemaId,
                    type: "push",
                });
            } else {
                store.commit("addSchema", {
                    arr: parent.children,
                    blockId: blockIdNew,
                    parentId: parent.schemaId,
                    type: "splice",
                    index: index + 1,
                });
            }
        } else {
            if (!schema.children) {
                schema.children = [];
            }

            parent = schema;

            store.commit("addSchema", {
                arr: schema.children,
                blockId: blockIdNew,
                parentId: parent.schemaId,
                type: "unshift",
            });
        }

        const nextBlock = store.getters.getNextSchemaId(schema.schemaId);
        if (nextBlock) {
            store.commit("setActiveBlock", nextBlock);
        }
    },

    deleteBlock(store, obj) {
        const schema = obj;
        const prevBlock = store.getters.getPrevSchema(schema.schemaId);
        store.commit("deleteBlock", {
            schemaId: schema.schemaId,
        });
        if (prevBlock) {
            store.commit("setActiveBlock", prevBlock);
        }
    },

    identBlock(store, obj) {
        const schema = obj;

        const prev = store.getters.getPrevIndexSchema(schema);
        if (!prev) return;

        const target = prev;
        if (!target) return;

        let parent = null;
        if (schema.parentId) {
            parent = store.getters.getSchemaById(schema.parentId);
        } else {
            parent = store.state.element;
        }

        const index = store.getters.getIndexInArrayBySchemaId({
            arr: parent.children,
            needle: schema.schemaId,
        });

        if (index === -1) return;

        store.commit("identBlock", {
            schema,
            parent,
            target,
            index,
        });
    },

    unIdentBlock(store, obj) {
        const schema = obj;

        let target = null;
        let targetIndex = null;
        let parent = null;

        if (schema.parentId) {
            parent = store.getters.getSchemaById(schema.parentId);
        } else {
            return;
        }

        if (!parent) return;

        if (parent.parentId) {
            const parentParent = store.getters.getSchemaById(parent.parentId);
            if (!parentParent) return;
            target = parentParent;
        } else {
            target = store.state.element;
        }

        if (!target) return;

        const nextBlock = store.getters.getNextSchema(schema.schemaId);
        if (nextBlock) {
            if (target.schemaId === nextBlock.parentId) {
                const nextBlockIndex = store.getters.getIndexInArrayBySchemaId({
                    arr: target.children,
                    needle: nextBlock.schemaId,
                });
                if (nextBlockIndex !== -1) {
                    targetIndex = nextBlockIndex;
                } else {
                    return;
                }
            } else {
                const parentBlockIndex = store.getters.getIndexInArrayBySchemaId(
                    {
                        arr: target.children,
                        needle: parent.schemaId,
                    }
                );
                targetIndex = parentBlockIndex + 1;
            }
        } else {
            const prevBlock = store.getters.getPrevSchema(schema.schemaId);
            if (!prevBlock) return;

            const prevBlockIndex = store.getters.getIndexInArrayBySchemaId({
                arr: target.children,
                needle: prevBlock.schemaId,
            });
            targetIndex = prevBlockIndex + 1;
        }

        if (!targetIndex) return;

        const index = store.getters.getIndexInArrayBySchemaId({
            arr: parent.children,
            needle: schema.schemaId,
        });

        if (index === -1) return;

        store.commit("unIdentBlock", {
            schema,
            parent,
            target,
            index,
            targetIndex,
        });
    },

    swapBlocks(store, obj) {
        const direction = obj.direction;
        const schema = obj.schema;
        if (!direction || !schema) return;

        let parent = null;
        if (schema.parentId) {
            parent = store.getters.getSchemaById(schema.parentId);
        } else {
            parent = store.getters.getRootSchema;
        }

        if (!parent) return;

        const index = store.getters.getIndexInArrayBySchemaId({
            arr: parent.children,
            needle: schema.schemaId,
        });

        if (index === -1) return;

        let targetIndex = null;
        if (direction == "up") {
            if (index === 0) return;
            targetIndex = index - 1;
        } else {
            if (index === parent.children.length - 1) return;
            targetIndex = index + 1;
        }

        if (targetIndex === null && targetIndex < 0) return;

        store.commit("swapBlocks", {
            parent,
            arr: parent.children,
            index,
            targetIndex,
        });

        this._vm.$eventHub.$emit("forceEdit");
    },

    setActiveBlock(store, obj) {
        const type = obj.type || "current";
        let schemaId = null;

        if (type === "current") {
            schemaId = obj.schemaId;
        } else if (type === "prev") {
            const schema = store.getters.getPrevSchema(obj.schemaId);
            if (schema) {
                schemaId = schema.schemaId;
            }
        } else if (type === "next") {
            const schema = store.getters.getNextSchema(obj.schemaId);
            if (schema) {
                schemaId = schema.schemaId;
            }
        }

        store.commit("setActiveBlock", schemaId);
    },

    unsetActiveBlock(store) {
        store.commit("unsetActiveBlock");
    },

    unsetActiveBlockById(store, schemaId) {
        if (store.state.editor.activeBlock === schemaId) {
            store.commit("unsetActiveBlock");
        }
    },

    connectDB() {
        const neo4j = {
            protocol: process.env.VUE_APP_DB_PROTOCOL,
            host: process.env.VUE_APP_DB_HOST,
            port: process.env.VUE_APP_DB_PORT,
            username: process.env.VUE_APP_DB_USERNAME,
            password: process.env.VUE_APP_DB_PASSWORD,
        };

        return this._vm.$neo4j
            .connect(
                neo4j.protocol,
                neo4j.host,
                neo4j.port,
                neo4j.username,
                neo4j.password
            )
            .then((driver) => {
                this._vm.$log.debug(driver);
            });
    },

    queryDB(store, obj) {
        const session = this._vm.$neo4j.getSession();
        session
            .run(obj)
            .then((res) => {
                this._vm.$log.debug(res);
            })
            .then(() => {
                session.close();
            });
    },

    saveBlock(store, blockId) {
        const block = store.getters.getBlockById(blockId);
        const obj = `MERGE (p:Block {blockId: '${blockId}'})
                     SET p = ${stringifyObject(block)}`;
        store.dispatch('queryDB', obj);
    },

    createTodayElement(store) {
        const title = moment().locale('ru').format('LL');
        const element = {
            title
        };
        
        store.commit("createTodayElement", element);

        return store.state.element;
    }
};
