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
                    <span class="text-xs">| schemaId: {{this.schema.schemaId}}</span>
                </span>
                <textarea
                    v-if="isEdit"
                    @blur="blurElement"
                    @input="taInput"
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
            this.$log.debug('mounted', this.schemaId);
            this.isEdit = true;
            this.focusBlock(this.schemaId);
        }
        this.$eventHub.$on('unsetActiveBlock', this.blurElement);
        this.$eventHub.$on('forceEdit', this.forceEdit);
    },
    created() {
    },
    beforeDestroy() {
        this.$eventHub.$off('unsetActiveBlock');
        this.$eventHub.$off('forceEdit');
    },
    updated() {
        // if (this.activeBlock === this.schemaId) {
        //     this.$log.debug('updated', this.schemaId);
        //     this.isUpdated = true;
        // }
    },
    watch: {
        // isUpdated: function() {
        //     if (this.isUpdated) {
        //         this.$nextTick(() => {
        //             if(this.activeBlock === this.schemaId && !this.isEdit) {
        //                 this.$log.debug('isUpdated', this.schemaId);
        //                 this.isEdit = true;
        //                 this.focusBlock(this.schemaId);
        //                 this.isUpdated = false;
        //             } else {
        //                 this.isUpdated = false;
        //             }
        //         });
        //     }
        // }
        /*activeBlock: function(activeBlock) {
            if (activeBlock === this.schemaId) {
                if(!this.isEdit) {
                    const that = this;
                    this.$nextTick(() => {
                        that.focusBlock();
                    });
                }
            }
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
        },
        activeBlock: function() {
            return this.$store.state.editor.activeBlock;
        }
    },
    data() {
        return {
            isEdit: false,
            isUpdated: false,
            taCursorPosition: 0
        };
    },
    methods: {
        saveBlock: function() {
            if(!this.$store.getters.getRootSchema.dbId) {
                if(!this.$store.getters.getIsElementEmpty) {
                    this.$store.dispatch('saveBlock', this.$store.getters.getRootSchema);
                }
            }            
            if(this.data !== "") { //TODO!
                this.$store.dispatch('saveBlock', this.schema);
            }
        },
        taInput: function() {
            if(this.$refs["editor-" + this.schemaId]) {
                this.taCursorPosition = this.$refs["editor-" + this.schemaId].selectionStart;
            }
        },
        forceEdit: function() {
            if (this.activeBlock === this.schemaId) {
                this.$log.debug('forceEdit', this.schemaId);
                this.$nextTick(() => {
                    this.isEdit = true;
                    this.focusBlock(this.schemaId, this.taCursorPosition, this.taCursorPosition);
                });
            }
        },
        keyHandlerEditor: function(e) {
            //this.$log.debug(e);
            switch(e.code) {
                case "Escape":
                    this.blur(e);
                    break;
                case "Enter":
                    e.preventDefault();
                    if(this.data !== "") {
                        this.addBlock();
                    }
                    break;
                case "Backspace":
                    if(this.isEdit && this.data == "") {
                        e.preventDefault();
                        this.deleteBlock();
                    }
                    break;
                case "Tab":
                    if(e.shiftKey) {
                        e.preventDefault();
                        this.$store.dispatch("unIdentBlock", this.schema);
                    } else {
                        e.preventDefault();
                        this.$store.dispatch("identBlock", this.schema);
                    }
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    if(e.ctrlKey) {
                        this.$store.dispatch("swapBlocks", {
                            direction: "up",
                            schema: this.schema
                        });
                    } else {
                        this.$store.dispatch("setActiveBlock", {
                            type: "prev",
                            schemaId: this.schemaId
                        });
                    }
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    if(e.ctrlKey) {
                        this.$store.dispatch("swapBlocks", {
                            direction: "down",
                            schema: this.schema
                        });
                    } else {
                        this.$store.dispatch("setActiveBlock", {
                            type: "next",
                            schemaId: this.schemaId
                        });
                    }
                    break;
            }
        },
        deleteBlock: function() {
            this.$store.dispatch("deleteBlock", this.schema);
        },
        // focusBlock: function() {
        //     if(this.isEdit) return;
        //     this.isEdit = true;
        //     const range = this.data.length;
        //     this.focusBlock(range, range);
        // },
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
        edit: function() {

        },
        focusBlock: function(schemaId, start, end) {
            if(start === null || end === null) {
                const range = window.getSelection().getRangeAt(0);
                start = end = range;
            }

            // const selectionLength = range.endOffset - range.startOffset;
            // range.setStart(target, 0);
            // let end = range.toString().length;
            // if (end >= 1) end--;
            // let start = end - selectionLength;

            this.$nextTick(() => {
                //that.$log.debug(that.schemaId, that.$refs["editor-" + that.schemaId]);
                if(this.$refs["editor-" + schemaId]) {
                    this.$refs["editor-" + schemaId].focus();
                    this.$refs["editor-" + schemaId].setSelectionRange(
                        start,
                        end
                    );
                    this.taCursorPosition = start;
                }
            });
        },
        clickSpan: function(e) {
            this.$log.debug('clickSpan');
            this.$store.commit("setActiveBlock", this.schema.schemaId);
            this.isEdit = true;
            const range = window.getSelection().getRangeAt(0);
            let target = e.target;

            while (target.tagName.toLowerCase() !== "div") {
                target = target.parentElement;
                if (!target) return;
            }
            this.focusBlock(this.schemaId, range.startOffset - 1, range.endOffset - 1);

        },
        blurElement: function() {
            if(this.isEdit) {
                this.isEdit = false;
                this.saveBlock();
            }
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