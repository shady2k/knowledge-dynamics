<template>
    <div id="element" class="ml-5 mt-0 text-left flex flex-col">
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
        this.getSchema();
    },
    computed: {
        title() {
            return this.$store.getters.getElementTitle;
        },
    },
    methods: {
        getSchema: function() {
            if(this.$store.getters.getSchemaLength === 0) {
                this.$store.dispatch('addBlock', {
                    schema: this.$store.getters.getRootSchema
                }).then(() => {
                    this.schema = this.$store.getters.getSchema;
                });
            } else {
                this.schema = this.$store.getters.getSchema;
            }
        }
    },
    data() {
        return {
            schema: []
        }
    }
};
</script>

<style></style>