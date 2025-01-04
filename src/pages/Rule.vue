<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <RouterLink to="/" class="to-title-button">
        <img :src="toTitleButton" class="image-button">
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import bgImageUrl from '../assets/background/rule-screen.webp';
import toTitleButton from '../assets/buttons/to-title-button.webp';
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function keyDownListener(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    router.push('/');
  }
}

onMounted(() => document.addEventListener('keydown', keyDownListener))
onUnmounted(() => document.removeEventListener('keydown', keyDownListener))
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
