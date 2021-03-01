<template>
    <div :id="'component-'+blockId" class="flex flex-row">
        <div :id="'bullet-'+blockId" class="flex mt-2">
            <span class="bullet"></span>
        </div>
        <div
            :id="'level-'+blockId"
            class="w-full"
        >
            <div
                :id="'block-row-'+blockId"
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
                    :ref="'editor-' + blockId"
                    role="textbox"
                    @keydown.esc="blur"
                    @keydown.enter="addNewBlock"
                    v-autogrow
                    class="break-words overflow-hidden bg-transparent resize-none outline-none w-full bg-white"
                >
                </textarea>
            </div>
            <div :id="'component-children-'+blockId" class="flex flex-col">
                <section v-for="item in children" :key="'block-' + item.blockId">
                    <Block :blockId="item.blockId" />
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
        blockId: String,
    },
    mounted() {
        if (this.$store.state.editor.activeBlock === this.blockId) {
            this.focusBlock(this.blockId);
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
        focusBlock: function(blockId) {
            this.isEdit = true;
            this.$nextTick(() => {
                this.$refs["editor-" + blockId].focus();
                this.$refs["editor-" + blockId].setSelectionRange(0, 0);
            });
        },
        addNewBlock: async function(e) {
            e.preventDefault();
            this.$store.commit("addNewBlock", this.schema.blockId);
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
                this.$refs["editor-" + this.blockId].focus();
                this.$refs["editor-" + this.blockId].setSelectionRange(
                    start,
                    end
                );
            });
        },
        blurElement: function() {
            this.$store.commit("unsetActiveBlock");
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
