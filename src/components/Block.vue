<template>
    <div class="flex flex-row my-1">
        <div class="flex mt-2">
            <span class="bullet"></span>
        </div>
        <div
            class="ml-1 mr-6 text-black w-full text-lg flex"
            @click="clickDiv"
        >
            <span v-if="!isEdit" class="text-justify" @click="clickSpan">
                {{ data }}
            </span>
            <textarea
                v-if="isEdit"
                @blur="blurElement"
                v-model="data"
                autocapitalize="none"
                rows="1"
                ref="editor"
                role="textbox"
                @keydown.esc="$event.target.blur()"
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
        blockId: Number
    },
    mounted() {
    },
    computed: {
        data: {
            get: function() {
                let block = null;
                block = this.$store.state.element.blocks.find((item) => {
                    return item.id === this.blockId;
                });
                if (!block) {
                    block.data = "Нажмите здесь, чтобы начать редактирования";
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
                this.$refs.editor.focus();
                this.$refs.editor.setSelectionRange(start, end);
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
</style>
