<script setup lang="ts">
import judge1Image from '../assets/sprites/judge1.png';

import { computed, ref } from 'vue'

let noddingTimer: any = null;
const judgeImagesClass = ref('');

const { judgesCount } = defineProps({
  judgesCount: Number
})

const judgesImageUrl = computed(() => {
  if (judgesCount === 5) {
    return judge1Image;
  } else if (judgesCount === 3) {
    return judge1Image;
  } else {
    return judge1Image;
  }
})

function nod() {
  judgeImagesClass.value = 'judges-image-nodding';

  clearTimeout(noddingTimer);
  noddingTimer = setTimeout(() => {
    judgeImagesClass.value = '';
  }, 1000);
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
}

.judges-image-nodding {
  animation-name: start-nodding;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
}
</style>
