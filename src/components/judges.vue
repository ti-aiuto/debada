<script setup lang="ts">
import judge1Image from '../assets/sprites/judge1.webp';
import judge3Image from '../assets/sprites/judge3.webp';
import judge5Image from '../assets/sprites/judge5.webp';

import { computed, ref } from 'vue'

let noddingTimer: any = null;
const judgeImagesClass = ref('');

const { judgesCount } = defineProps({
  judgesCount: Number
})

const judgesImageUrl = computed(() => {
  if (judgesCount === 5) {
    return judge5Image;
  } else if (judgesCount === 3) {
    return judge3Image;
  } else {
    return judge1Image;
  }
})

function nod() {
  judgeImagesClass.value = '';
  clearTimeout(noddingTimer);

  noddingTimer = setTimeout(() => {
    judgeImagesClass.value = '';
  }, 1000);
  judgeImagesClass.value = 'judges-image-nodding';
}

defineExpose({ nod });
</script>

<template>
  <div class="judges-area">
    <img :src="judgesImageUrl" class="judges-image" :class="judgeImagesClass">
  </div>
</template>

<style scoped>
@keyframes start-nodding {
  0% {
    top: 0;
  }

  25% {
    top: 8px;
  }

  50% {
    top: 0;
  }

  75% {
    top: 8px;
  }

  100% {
    top: 0;
  }
}

.judges-area {
  display: flex;
  justify-content: center;
  width: 100%;
}

.judges-image {
  position: absolute;
  height: 181px;
}

.judges-image-nodding {
  animation-name: start-nodding;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
}
</style>
