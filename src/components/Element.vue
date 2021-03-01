<template>
    <div id="element" class="ml-5 mt-5 text-left flex flex-col">
        <span class="text-4xl font-medium">{{ title }}</span>
            <div
                id="blocks"
                class="flex flex-col mt-3"
            >
                <section
                    v-for="item in schema"
                    :key="'section-block-'+item.schemaId"
                >
                    <Block :schemaId="item.schemaId" :blockId="item.blockId" />
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
        schema() {
            if(this.$store.getters.getSchemaLength === 0) {
                this.$store.commit('addBlockToTheEnd', { data: 'Проверяем' });
            }
            return this.$store.getters.getSchema;
        },
    },
};
</script>

<style></style>