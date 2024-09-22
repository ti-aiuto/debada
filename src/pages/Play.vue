<script setup lang="ts">
import bgImageUrl from '../assets/background/play-screen.svg';
import { typingGame } from '../composables/typing-game'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const questions = ['れいとれすぽんす', 'にゅーあぎゅめんと', 'どろーひてい'];

const {
  correctCount,
  wrongCount,
  renzokuCorrectCount,
  typeKey,
  proceedToNextQuestion,
  hasCompletedWord,
  hasCompletedGame,
  koremadeUttaRoamji,
  nokoriRomaji,
  currentQuestionIndex,
} = typingGame(questions);

function abortGame() {
  router.push('/');
}

function keyDownListener(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    return abortGame();
  }

  typeKey(event.key);
  if (hasCompletedWord.value) {
    if (!proceedToNextQuestion()) {
      router.push('/result');
    }
  }
}

onMounted(() => document.addEventListener('keydown', keyDownListener))
onUnmounted(() => document.removeEventListener('keydown', keyDownListener))
</script>

<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <div class="m-plus-rounded-1c-light">
        正解タイプ数：{{ correctCount }}、連続正解タイプ数：{{ renzokuCorrectCount }}、間違いタイプ数：{{ wrongCount }}
      </div>
      <div class="m-plus-rounded-1c-light">
        {{ currentQuestionIndex + 1 }} / {{ questions.length }}問
      </div>
      <div v-if="hasCompletedGame">
        おわり
      </div>
    </div>
    <div class="question-area m-plus-rounded-1c-regular">
      <span>{{ koremadeUttaRoamji.toUpperCase() }}</span><span style="color: #aaa;">{{ nokoriRomaji.toUpperCase() }}</span>
    </div>
  </div>
</template>

<style scoped>
.question-area {
  text-align: center;
  font-size: 30px;
}
</style>
