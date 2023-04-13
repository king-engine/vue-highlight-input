<script lang="ts" setup>
import {ref} from 'vue'
// import highlightInput from '@/components/HighlightInput.vue'
const myText = ref('')
const keywords = ref(['鼠鼠', '润'])
const color = ref('#67C23A')
</script>

<template>
  <div class="demo">
    <header>
      <h1>看图说话</h1>
      <img src="@/assets/shushu.png" alt="">
    </header>
    <highlightInput v-model="myText" :keywords="keywords" :color="color" placeholder="关键字（鼠、润）" class="high-light"></highlightInput>
    <p>{{ myText }}</p>
  </div>
</template>

<style scoped lang='scss'>
.demo {
  width: 550px;
  h1 {
    text-align: center;
  }
  header {
    margin-bottom: 10px;
  }
  p {
    margin-top: 10px;
  }
  .high-light {
    height: 200px;
  }
}
</style>