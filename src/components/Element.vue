<template>
    <div id="element" class="ml-5 mt-5 text-left flex flex-col">
        <span class="text-4xl font-medium">27 февраля 2021 г.</span>
        <div id="blocks" class="flex flex-col mt-3">
            <Block />
            <Block />
        </div>
    </div>
</template>

<script>
import Block from './Block.vue'
export default {
  components: { Block },

}
</script>

<style>

</style>