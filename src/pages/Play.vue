<script setup lang="ts">
import bgImageUrl from '../assets/background/play-screen.svg';
import { typingGame } from '../composables/typing-game'
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

type Question = {
  kana: string;
  label: string;
}

const questions: Question[] = [
  {
    kana: 'れいとれすぽんす',
    label: 'レイトレスポンス',
  },
  {
    kana: 'にゅーあぎゅめんと',
    label: 'ニューアーギュメント',
  },
  {
    kana: 'どろーひてい',
    label: 'ドロー否定',
  },
];

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
} = typingGame(questions.map(item => item.kana));

const currentQuestion = computed(() => {
  return questions[currentQuestionIndex.value];
});

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
      // TODO: この結果をどこかで覚える
      console.log({
        correctCount: correctCount.value, 
        wrongCount: wrongCount.value, 
        renzokuCorrectCount: renzokuCorrectCount.value, 
      });
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

    <div class="wrapper">
      <div class="question-label-area m-plus-rounded-1c-regular">
        <span class="question-label">{{ currentQuestion.label }}</span>
      </div>

      <div class="question-kana-area m-plus-rounded-1c-regular">
        <span class="chars-before-type">{{ koremadeUttaRoamji.toUpperCase() }}</span><span class="chars-after-type">{{
          nokoriRomaji.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
}

.question-kana-area {
  width: 100%;
  text-align: center;
  font-size: 20px;
  position: absolute;
  top: 120px;
}

.question-label-area {
  width: 100%;
  text-align: center;
  font-size: 28px;
  position: absolute;
  top: 40px;
}

.question-label {
  color: #fff;
}

.chars-before-type {
  color: #fff;
}

.chars-after-type {
  color: #999;
}
</style>
