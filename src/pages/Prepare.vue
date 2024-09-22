<template>
  <div>
    <div>
      <img :src="bgImageUrl" class="bg-image">
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import bgImageUrl from '../assets/prepare-screen.svg';

const router = useRouter()

function keyDownListener(event: KeyboardEvent) {
  if ([' ', 'Enter'].includes(event.key)) {
    router.push('/play');
  } else if (event.key === 'Escape') {
    router.push('/');
  }
}

onMounted(() => document.addEventListener('keydown', keyDownListener))
onUnmounted(() => document.removeEventListener('keydown', keyDownListener))
</script>
