<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <div>
        {{ Math.floor(tweened.score) }}
      </div>

      <RouterLink to="/" class="to-title-button">
        <img :src="toTitleButton" class="image-button">
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import bgImageUrl from '../assets/background/result-screen.webp';
import toTitleButton from '../assets/buttons/to-title-button.png';
import gsap from 'gsap'
import { reactive } from 'vue'

const tweened = reactive({
  score: 0
})

gsap.to(tweened, { duration: 1, score: 200 })

</script>

<style scoped>
.to-title-button {
  width: 240px;
  display: block;
  position: absolute;
  top: 400px;
  left: calc(320px - 120px);
}
</style>
