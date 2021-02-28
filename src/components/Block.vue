<template>
    <div class="flex flex-row my-1">
        <div class="flex mt-2">
            <span class="bullet"></span>
        </div>
        <div
            class="ml-1 mr-6 text-black w-full text-lg flex"
            @click="clickDiv"
        >
            <span v-if="!isEdit" 
                class="text-justify"
                :class="{ grayed: !data }"
                @click="clickSpan"
            >
                {{ data ? data : "Нажмите здесь, чтобы начать редактирование" }}
            </span>
            <textarea
                v-if="isEdit"
                @blur="blurElement"
                v-model="data"
                autocapitalize="none"
                rows="1"
                :ref="'editor-' + blockId"
                role="textbox"
                @keydown.esc="$event.target.blur()"
                @keydown.enter="addNewBlock"
                v-autogrow
                class="break-words overflow-hidden bg-transparent resize-none outline-none w-full bg-white"
            >
            </textarea>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        blockId: String
    },
    mounted() {
        if(this.$store.state.editor.activeBlock === this.blockId) {
            this.focusBlock(this.blockId);
        }
    },
    asyncComputed: {
        block: {
            get() {
                return this.$store.dispatch('getBlock', this.blockId).then((response => {
                    return response;
                }));
            },
            default: {}
        }
    },
    computed: {
        data: {
            get: function() {
                let block = this.block;
                if (!block) {
                    block = {
                        data: ""
                    }
                }
                return block.data;
            },
            set: function(data) {
                this.$store.commit('changeBlock', { id: this.blockId, data });
            }
        }
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
            this.$store.dispatch('addNewBlock');
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
                this.$refs["editor-" + this.blockId].focus();
                this.$refs["editor-" + this.blockId].setSelectionRange(start, end);
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
