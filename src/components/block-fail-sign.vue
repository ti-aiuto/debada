<script setup lang="ts">
import { ref } from 'vue'

import blockFailImage from '../assets/sprites/block-fail.webp';

let imageTimer: any = null;
const imageClass = ref('');

function show() {
  imageClass.value = '';
  clearTimeout(imageTimer);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      imageTimer = setTimeout(() => {
        imageClass.value = '';
      }, 750);
      imageClass.value = 'image-visible';
    });
  });
}

defineExpose({ show });
</script>

<template>
  <img :src="blockFailImage" class="image" :class="imageClass">
</template>

<style scoped>
.image {
  width: 571px;
  height: 299px;
  opacity: 0;
}

@keyframes image-animate {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  25% {
    opacity: 1;
    transform: scale(1);
  }

  75% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0);
  }
}

.image-visible {
  animation-name: image-animate;
  animation-duration: 0.75s;
  animation-iteration-count: 1;
}
</style>
