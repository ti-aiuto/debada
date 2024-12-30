<script setup lang="ts">
import bgImageUrl from '../assets/background/play-screen.svg';

import CommGauge from '../components/comm-gauge.vue';
import GotPointSign from '../components/got-point-sign.vue';
import Judges from '../components/judges.vue';

import { typingGame } from '../composables/typing-game'
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { findEasyQuestions } from '../questions/easy';

const router = useRouter();
const questions = findEasyQuestions();

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

const currentScore = ref(0);
const currentJudgesCount = ref(1);
const currentCommPoint = ref(3);

const gotPointGaugeRef = useTemplateRef('gotPointSign');
const judgesRef = useTemplateRef('judges');

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

  if (!typeKey(event.key)) {
    // タイプミス効果音
  }

  if (renzokuCorrectCount.value >= 30) {
    currentCommPoint.value = 5;
  } else if (renzokuCorrectCount.value >= 15) {
    currentCommPoint.value = 4;
  } else {
    currentCommPoint.value = 3;
  }

  if (hasCompletedWord.value) {
    gotPointGaugeRef.value!.show();
    judgesRef.value!.nod();

    currentScore.value += currentJudgesCount.value * currentCommPoint.value;

    if (!proceedToNextQuestion()) {
      const gameResult = {
        correctCount: correctCount.value,
        wrongCount: wrongCount.value,
        renzokuCorrectCount: renzokuCorrectCount.value,
        score: currentScore.value,
      };
      // TODO: この結果をどこかで覚える
      console.log(gameResult);
      router.push('/result');
    }
  }
}

onMounted(() => document.addEventListener('keydown', keyDownListener))
onUnmounted(() => document.removeEventListener('keydown', keyDownListener))
</script>

<template>
  <div>
    <div class="wrapper">
      <img :src="bgImageUrl" class="bg-image">

      <div class="question-label-area m-plus-rounded-1c-regular">
        <span class="question-label">{{ currentQuestion.label }}</span>
      </div>

      <div class="question-kana-area m-plus-rounded-1c-regular">
        <span class="chars-before-type">{{ koremadeUttaRoamji.toUpperCase() }}</span><span class="chars-after-type">{{
          nokoriRomaji.toUpperCase() }}</span>
      </div>

      <comm-gauge class="gauge" :comm-point="currentCommPoint" />
      <got-point-sign class="got-point-sign" :comm-point="currentCommPoint" ref="gotPointSign" />
      <judges class="judges" :judges-count="currentJudgesCount" ref="judges" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  overflow: hidden;
  width: 640px;
  height: 480px;
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

.judges {
  top: 350px;
  position: absolute;
  z-index: 100;
}

.gauge {
  position: absolute;
  left: 130px;
  top: 440px;
  z-index: 110;
}

.got-point-sign {
  position: absolute;
  left: 170px;
  top: 270px;
  z-index: 120;
}
</style>
