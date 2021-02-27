<template>
    <div id="element" class="ml-5 mt-5 text-left flex flex-col">
        <span class="text-4xl font-medium">{{ title }}</span>
            <div
                id="blocks"
                class="flex flex-col mt-3"
            >
                <section
                    v-for="block in blocks"
                    :key="'block-'+block.id"
                >
                    <Block :blockId="block.id" />
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
            return this.$store.state.element.title;
        },
        blocks() {
            return this.$store.state.element.blocks;
        },
    },
};
</script>

<style></style>
