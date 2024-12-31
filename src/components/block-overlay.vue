<script setup lang="ts">
import { ref } from 'vue'

import blockImageUrl from '../assets/sprites/block-overlay.png';

const imageClass = ref('');

function show() {
  imageClass.value = 'image-visible';
}

function hide() {
  imageClass.value = 'image-invisible';
}

defineExpose({ show, hide });
</script>

<template>
  <img :src="blockImageUrl" class="block-overlay-image" :class="imageClass">
</template>

<style scoped>
.block-overlay-image {
  width: 100%;
  height: 100%;
  opacity: 0;
}

@keyframes image-animate-show {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}


@keyframes image-animate-hide {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.image-visible {
  animation-name: image-animate-show;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.image-invisible {
  animation-name: image-animate-hide;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
</style>
