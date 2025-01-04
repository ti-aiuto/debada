<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">

    <div>
      <RouterLink :to="{ path: '/prepare', query: { mode: 'typing-practice' } }" class="typing-practice-button">
        <img :src="typingPracticeImageUrl" class="image-button">
      </RouterLink>

      <RouterLink :to="{ path: '/prepare', query: { mode: 'word-quiz' } }" class="word-quiz-button">
        <img :src="wordQuizImageUrl" class="image-button">
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import bgImageUrl from '../assets/background/select-mode.webp';
import typingPracticeImageUrl from '../assets/buttons/typing-practice.webp';
import wordQuizImageUrl from '../assets/buttons/word-quiz.webp';

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

.typing-practice-button {
  width: 300px;
  display: block;
  position: absolute;
  top: 170px;
  left: calc(320px - 150px);
}

.word-quiz-button {
  width: 300px;
  display: block;
  position: absolute;
  top: 260px;
  left: calc(320px - 150px);
}
</style>
