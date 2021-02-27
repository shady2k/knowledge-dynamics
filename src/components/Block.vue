<template>
    <div class="flex flex-row my-1">
        <div class="flex justify-center items-center">
            <span class="bullet"></span>
        </div>
        <div class="ml-1 text-black w-full text-xl bg-gray-200" @click="clickDiv">
            <span v-if="!isEdit" class=""
                @click="clickSpan"
            >
                {{ text }}
            </span>
            <textarea
                v-if="isEdit"
                @blur="blurElement"
                v-model="text"
                autocapitalize="none"
                rows="1"
                ref="editor"
                class="break-words overflow-hidden bg-transparent resize-none outline-none w-full bg-white"
            >
            </textarea>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isEdit: false,
            text: "Нажмите здесь, чтобы начать редактирование",
        };
    },
    methods: {
        clickDiv: function(e) {
            if(!this.isEdit) {
                this.clickSpan(e);
            }
        },
        clickSpan: function(e) {
            const range = window.getSelection().getRangeAt(0);
			let target = e.target;
			
            while (target.tagName.toLowerCase() !== 'div') {
				target = target.parentElement;
				if (!target) return;
			}

            const selectionLength = range.endOffset - range.startOffset;
            range.setStart(target, 0);
            let end = range.toString().length;
            if(end >= 1) end--;
            let start = end - selectionLength;
            
            this.isEdit = !this.isEdit;
            this.$nextTick(() => {
                this.$refs.editor.focus();
                this.$refs.editor.setSelectionRange(start, end);
            });
        },
        blurElement: function() {
            this.isEdit = !this.isEdit;
        }
    }
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
