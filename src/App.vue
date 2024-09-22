<script setup lang="ts">
import { typingGame } from './composables/typing-game'
import { onMounted, onUnmounted } from 'vue'

const questions = ['あか', 'あお', 'き'];

const {
  correctCount,
  wrongCount,
  renzokuCorrectCount,
  typeKey,
  proceedToNextQuestion,
  hasCompletedWord,
  koremadeUttaRoamji,
  nokoriRomaji,
  currentQuestionIndex,
} = typingGame(questions);

function keyDownListener(event: KeyboardEvent) {
  typeKey(event.key);
  if (hasCompletedWord.value) {
    // proceedToNextQuestion();
  }
}

onMounted(() => document.addEventListener('keydown', keyDownListener))
onUnmounted(() => document.removeEventListener('keydown', keyDownListener))

</script>

<template>
  <div class="screen">
    <div>
      <div>
        正解タイプ数：{{ correctCount }}、連続正解タイプ数：{{ renzokuCorrectCount }}、間違いタイプ数：{{ wrongCount }}
      </div>
      <div>
        {{ currentQuestionIndex + 1 }} / {{ questions.length }}問
      </div>
    </div>
    <strong>{{ koremadeUttaRoamji }}</strong>{{ nokoriRomaji }}
  </div>
</template>

<style scoped>
.screen {
  border: 2px solid #000;
}
</style>
