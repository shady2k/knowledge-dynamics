<template>
    <div id="element" class="ml-5 mt-5 text-left flex flex-col">
        <span class="text-4xl font-medium">{{ title }}</span>
            <div
                id="blocks"
                class="flex flex-col mt-3"
            >
                <section
                    v-for="item in schema"
                    :key="'block-'+item.schemaId"
                >
                    <Block :schemaId="item.schemaId" />
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
        schema() {
            if(this.$store.state.element.schema.length === 0) {
                this.$store.commit('addBlock');
            }
            return this.$store.state.element.schema;
        },
    },
};
</script>

<style></style>
