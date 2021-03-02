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
                    | schemaId: {{this.schema.schemaId}}
                </span>
                <textarea
                    v-if="isEdit"
                    @blur="blurElement"
                    v-model="data"
                    autocapitalize="none"
                    rows="1"
                    :ref="'editor-' + schemaId"
                    role="textbox"
                    @keydown="keyHandlerEditor"
                    v-autogrow
                    :class="{ 'block-active': isEdit }"
                    class="break-words overflow-hidden bg-transparent resize-none outline-none w-full bg-white"
                >
                </textarea>
            </div>
            <div :id="'component-children-'+schemaId" class="flex flex-col ml-1">
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
        if (this.activeBlock === this.schemaId) {
            this.focusBlock();
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
    watch: {
        activeBlock: function(activeBlock) {
            if (activeBlock === this.schemaId) {
                this.focusBlock();
            }
        },
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
        },
        activeBlock: function() {
            return this.$store.state.editor.activeBlock;
        }
    },
    data() {
        return {
            isEdit: false,
        };
    },
    methods: {
        keyHandlerEditor: function(e) {
            // this.$log.debug(e);
            switch(e.code) {
                case "Escape":
                    this.blur(e);
                    break;
                case "Enter":
                    e.preventDefault();
                    this.addBlock();
                    break;
                case "Backspace":
                    if(this.isEdit && this.data == "") {
                        e.preventDefault();
                        this.deleteBlock();
                    }
                    break;
                case "Tab":
                    e.preventDefault();
                    this.$store.dispatch("identBlock", this.schema);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    this.$store.dispatch("setActiveBlock", {
                        type: "prev",
                        schemaId: this.schemaId
                    });
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    this.$store.dispatch("setActiveBlock", {
                        type: "next",
                        schemaId: this.schemaId
                    });
                    break;
            }
        },
        deleteBlock: function() {
            this.$store.dispatch("deleteBlock", this.schema);
        },
        focusBlock: function() {
            const schemaId = this.schemaId;
            const range = this.data.length;

            this.isEdit = true;
            this.$nextTick(() => {
                this.$refs["editor-" + schemaId].focus();
                this.$refs["editor-" + schemaId].setSelectionRange(range, range);
            });
        },
        addBlock: async function() {
            this.$store.dispatch("addBlock", { 
                    schema: this.schema,
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
            this.$store.commit("setActiveBlock", this.schema.schemaId);
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
    @apply bg-blue-50;
}
</style>