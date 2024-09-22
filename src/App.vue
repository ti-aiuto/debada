<script setup lang="ts">
import { typingGame } from './composables/typing-game'
import { onMounted, onUnmounted } from 'vue'

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

function keyDownListener(event: KeyboardEvent) {
  typeKey(event.key);
  if (hasCompletedWord.value) {
    proceedToNextQuestion()
  }
}

onMounted(() => document.addEventListener('keydown', keyDownListener))
onUnmounted(() => document.removeEventListener('keydown', keyDownListener))

</script>

<template>
  <div class="screen">
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
      <strong>{{ koremadeUttaRoamji.toUpperCase() }}</strong>{{ nokoriRomaji.toUpperCase() }}
    </div>
  </div>
</template>

<style scoped>
.screen {
  border: 2px solid #000;
  width: 640px;
  height: 480px;
  margin: auto;
}

.question-area {
  text-align: center;
  font-size: 30px;
}
</style>
