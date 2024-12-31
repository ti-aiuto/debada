<script setup lang="ts">
import { ref } from 'vue'

import levelUpImage from '../assets/sprites/level_up.webp';

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
  <img :src="levelUpImage" class="level-up-image" :class="imageClass">
</template>

<style scoped>
.level-up-image {
  width: 571px;
  height: 299px;
  opacity: 0;
  z-index: 130;
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
