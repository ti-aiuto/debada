<script setup lang="ts">
import pointGood from '../assets/sprites/point_good.webp';
import pointGreat from '../assets/sprites/point_great.webp';
import pointFantastic from '../assets/sprites/point_fantastic.webp';

import { computed, ref } from 'vue'

let pointImageTimer: any = null;
const pointImageClass = ref('');

const { commPoint } = defineProps({
  commPoint: Number
})

const pointImageUrl = computed(() => {
  if (commPoint === 5) {
    return pointFantastic;
  } else if (commPoint === 4) {
    return pointGreat;
  } else {
    return pointGood;
  }
})

function show() {
  pointImageClass.value = '';
  clearTimeout(pointImageTimer);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      pointImageTimer = setTimeout(() => {
        pointImageClass.value = '';
      }, 1000);
      pointImageClass.value = 'point-image-visible';
    });
  });
}

defineExpose({ show });
</script>

<template>
  <img :src="pointImageUrl" class="point-image" :class="pointImageClass">
</template>

<style scoped>
.point-image {
  width: 300px;
  height: 74px;
  opacity: 0;
}

@keyframes point-image-animate {
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

.point-image-visible {
  animation-name: point-image-animate;
  animation-duration: 0.75s;
  animation-iteration-count: 1;
}
</style>
