<template>
    <div class="flex flex-row">
        <div class="flex mt-2">
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
                    @keydown.esc="$event.target.blur()"
                    @keydown.enter="addNewBlock"
                    v-autogrow
                    class="break-words overflow-hidden bg-transparent resize-none outline-none w-full bg-white"
                >
                </textarea>
            </div>
            <div id="blocks-children" class="flex flex-col">
                <section v-for="item in childs" :key="'block-' + item.schemaId">
                    <Block :schemaId="item.schemaId" />
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
    },
    mounted() {
        if (this.$store.state.editor.activeBlock === this.schemaId) {
            this.focusBlock(this.schemaId);
        }
    },
    asyncComputed: {
        block: {
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
                    .dispatch("getSchema", this.schemaId)
                    .then((response) => {
                        return response;
                    });
            },
            default: {},
        },
    },
    computed: {
        data: {
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
        childs: {
            get: function() {
                let schema = this.schema;
                if (schema) {
                    return schema.childs;
                } else {
                    return null;
                }
            },
        },
    },
    data() {
        return {
            isEdit: false,
            blockId: null
        };
    },
    methods: {
        focusBlock: function(schemaId) {
            this.isEdit = true;
            this.$nextTick(() => {
                this.$refs["editor-" + schemaId].focus();
                this.$refs["editor-" + schemaId].setSelectionRange(0, 0);
            });
        },
        addNewBlock: async function(e) {
            e.preventDefault();
            this.$store.dispatch("addNewBlock");
        },
        clickDiv: function(e) {
            if (!this.isEdit) {
                this.clickSpan(e);
            }
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
            this.$nextTick(() => {
                this.$refs["editor-" + this.schemaId].focus();
                this.$refs["editor-" + this.schemaId].setSelectionRange(
                    start,
                    end
                );
            });
        },
        blurElement: function() {
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
</style>
