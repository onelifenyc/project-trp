
<template>
  <div id="app"
       class="ui page container">

    <div class="ui top attached tabular menu">
      <a class="active item"
         data-tab="trp">TRP &nbsp;<sup>TM</sup></a>
      <a class="item"
         data-tab="csvMerge">CSVMerge <sup>TM</sup></a>
    </div>
    <div class="ui bottom attached tab padded segment"
         data-tab="trp">
      <TRP></TRP>
    </div>
    <div class="ui bottom attached tab padded segment"
         data-tab="csvMerge">
      <c-s-v-merge></c-s-v-merge>
    </div>

  </div>
</template>

<script>
/* eslint-disable no-undef */
import TRP from './components/TRP.vue'
import CSVMerge from './components/CSVMerge.vue'

export default {
  components: {
    TRP,
    CSVMerge
  },
  mounted() {
    $('.menu .item').tab()
  }
}
</script>

<style>
#app {
  padding-top: 3rem;
}
</style>
