<template>
    <div :id="'component-'+schemaId" class="flex flex-row">
        <div :id="'bullet-'+schemaId" class="flex mt-2">
            <span class="bullet"></span>
        </div>
        <div
            :id="'level-'+schemaId"
            class="w-full"
        >
            <div
                :id="'block-row-'+schemaId"
                class="ml-1 mr-6 text-black w-full text-lg flex"
                @click="clickDiv"
            >
                <span
                    v-if="!isEdit"
                    class="text-justify"
                    :class="{ grayed: !data }"
                    @click="clickSpan"
                >
                    {{
                        data
                            ? data
                            : "Нажмите здесь, чтобы начать редактирование"
                    }}
                </span>
                <textarea
                    v-if="isEdit"
                    @blur="blurElement"
                    v-model="data"
                    autocapitalize="none"
                    rows="1"
                    :ref="'editor-' + schemaId"
                    role="textbox"
                    @keydown.esc="blur"
                    @keydown.enter="addNewBlock"
                    v-autogrow
                    :class="{ 'block-active': isEdit }"
                    class="break-words overflow-hidden bg-transparent resize-none outline-none w-full bg-white"
                >
                </textarea>
            </div>
            <div :id="'component-children-'+schemaId" class="flex flex-col">
                <section v-for="item in schema.children" :key="'block-' + item.schemaId">
                    <Block :schemaId="item.schemaId" :blockId="item.blockId" />
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import Block from "./Block.vue";

export default {
    name: "Block",
    components: {
        Block,
    },
    props: {
        schemaId: String,
        blockId: String
    },
    mounted() {
        this.$log.debug(this.$store.state);
        if (this.$store.state.editor.activeBlock === this.schemaId) {
            this.focusBlock(this.schemaId);
        }
    },
    asyncComputed: {
        /*block: {
            get() {
                return this.$store
                    .dispatch("getBlockData", this.schema.blockId)
                    .then((response) => {
                        return response;
                    });
            },
            default: {},
        },
        schema: {
            get() {
                return this.$store
                    .dispatch("getSchemaById", this.blockId)
                    .then((response) => {
                        return response;
                    });
            },
            default: {},
        },*/
    },
    computed: {
        block: {
            get: function() {
                return this.$store.getters.getBlockById(this.blockId);
            },
            // set: function(data) {
            //     this.$store.commit("changeBlock", { 
            //         blockId: this.block.blockId, 
            //         data
            //     });
            // }
        },
        schema: function() {
            return this.$store.getters.getSchemaById(this.schemaId);
        },
        data: {
            get: function() {
                return this.block.data;
            },
            set: function(data) {
                this.$store.commit("changeBlock", { 
                    blockId: this.blockId, 
                    data
                });
            }
        },
        children: function() {
            return this.block.children;
        }
        /*data: {
            get: function() {
                let block = this.block;
                if (!block) {
                    block = {
                        data: "",
                    };
                }
                return block.data;
            },
            set: function(data) {
                this.$store.commit("changeBlock", { blockId: this.schema.blockId, data });
            },
        },
        children: {
            get: function() {
                let schema = this.schema;
                if (schema) {
                    return schema.children;
                } else {
                    return null;
                }
            },
        },*/
    },
    data() {
        return {
            isEdit: false,
        };
    },
    methods: {
        focusBlock: function(shcemaId) {
            this.isEdit = true;
            this.$nextTick(() => {
                this.$refs["editor-" + shcemaId].focus();
                this.$refs["editor-" + shcemaId].setSelectionRange(0, 0);
            });
        },
        addNewBlock: async function(e) {
            e.preventDefault();
            this.$store.dispatch("addNewBlock", { 
                    schemaId: this.schemaId,
                    block: null
                }
            );
        },
        clickDiv: function(e) {
            if (!this.isEdit) {
                this.clickSpan(e);
            }
        },
        blur: function(e) {
            e.target.blur();
        },
        clickSpan: function(e) {
            const range = window.getSelection().getRangeAt(0);
            let target = e.target;

            while (target.tagName.toLowerCase() !== "div") {
                target = target.parentElement;
                if (!target) return;
            }

            const selectionLength = range.endOffset - range.startOffset;
            range.setStart(target, 0);
            let end = range.toString().length;
            if (end >= 1) end--;
            let start = end - selectionLength;

            this.isEdit = !this.isEdit;
            this.$store.commit("setActiveBlock", this.schema);
            this.$nextTick(() => {
                this.$refs["editor-" + this.schemaId].focus();
                this.$refs["editor-" + this.schemaId].setSelectionRange(
                    start,
                    end
                );
            });
        },
        blurElement: function() {
            //this.$store.commit("unsetActiveBlock");
            this.isEdit = !this.isEdit;
        },
    },
};
</script>

<style scoped>
.bullet {
    box-sizing: content-box;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 50%;
    width: 5px;
    height: 5px;
    background-clip: content-box;
    border: 4px solid transparent;
    background-color: black;
}
.grayed {
    @apply text-gray-300;
}
.block-active {
    @apply bg-gray-100;
}
</style>