<template>
    <div id="element" class="ml-5 mt-5 text-left flex flex-col">
        <span class="text-4xl font-medium">{{ title }}</span>
            <div
                id="blocks"
                class="flex flex-col mt-3"
            >
                <section
                    v-for="item in structure"
                    :key="'block-'+item.id"
                >
                    <Block :blockId="item.id" />
                </section>
            </div>
    </div>
</template>

<script>
import Block from "./Block.vue";
export default {
    components: {
        Block,
    },
    mounted() {
    },
    computed: {
        title() {
            return this.$store.getters.getElementTitle;
        },
        structure() {
            if(this.$store.getters.getStructureLength === 0) {
                this.$store.commit('addBlockToTheEnd', { data: 'test' });
            }
            return this.$store.getters.getStructure;
        },
    },
};
</script>

<style></style>