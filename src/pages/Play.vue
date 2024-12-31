<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import shuffle from 'lodash/shuffle';

import bgImageUrl from '../assets/background/play-screen.webp';
import player1Url from '../assets/sprites/player1.png';
import player2Url from '../assets/sprites/player2.png';

import CommGauge from '../components/comm-gauge.vue';
import GotPointSign from '../components/got-point-sign.vue';
import Judges from '../components/judges.vue';
import LevelUpSign from '../components/level-up-sign.vue';

import { typingGame } from '../composables/typing-game'
import { findEasyQuestions } from '../questions/easy';
import { findMiddleQuestions } from '../questions/middle';
import { findHardQuestions } from '../questions/hard';

const router = useRouter();

const selectedEasyQuestions = shuffle(findEasyQuestions()).slice(0, 6);
const selectedMiddleQuestions = shuffle(findMiddleQuestions()).slice(0, 3);
const selectedHardQuestions = shuffle(findHardQuestions()).slice(0, 4);

const questions = selectedEasyQuestions.concat(selectedMiddleQuestions).concat(selectedHardQuestions);

const gotPointGaugeRef = useTemplateRef('gotPointSign');
const judgesRef = useTemplateRef('judges');
const levelUpSignRef = useTemplateRef('levelUpSign');

function abortGame() {
  router.push('/');
}

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
const currentEnabledState = ref(true);
const currentKoshuKotaiEnabled = ref(false);

const currentQuestion = computed(() => {
  return questions[currentQuestionIndex.value];
});

const playerImageUrl = computed(() => {
  if (currentKoshuKotaiEnabled.value) {
    return player2Url;
  } else {
    return player1Url;
  }
});

function pauseGame() {
  currentEnabledState.value = false;
}

function resumeGame() {
  currentEnabledState.value = true;
}

function nextQuestion() {
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

function keyDownListener(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    return abortGame();
  }

  if (!currentEnabledState.value) {
    return;
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
    currentScore.value += currentJudgesCount.value * currentCommPoint.value;

    if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length) {
      currentJudgesCount.value = 3;
      levelUpSignRef.value!.show();
      pauseGame();
      setTimeout(() => {
        nextQuestion();
        resumeGame();
      }, 750);
    } else if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length + selectedMiddleQuestions.length) {
      currentJudgesCount.value = 5;
      levelUpSignRef.value!.show();
      pauseGame();
      setTimeout(() => {
        nextQuestion();
        resumeGame();
      }, 750);
    } else {
      judgesRef.value!.nod();
      gotPointGaugeRef.value!.show();
      nextQuestion();
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
        <span class="chars-after-type">{{ koremadeUttaRoamji.toUpperCase() }}</span><span class="chars-before-type">{{
          nokoriRomaji.toUpperCase() }}</span>
      </div>

      <comm-gauge class="gauge" :comm-point="currentCommPoint" />
      <got-point-sign class="got-point-sign" :comm-point="currentCommPoint" ref="gotPointSign" />
      <judges class="judges" :judges-count="currentJudgesCount" ref="judges" />
      <level-up-sign class="level-up-sign" ref="levelUpSign" />

      <img :src="playerImageUrl" class="player">
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
  word-break: break-all;
  padding: 0 24px;
  line-height: 22px;
  z-index: 90;
}

.question-label-area {
  width: 100%;
  text-align: center;
  font-size: 28px;
  position: absolute;
  top: 40px;
  word-break: break-all;
  padding: 0 24px;
  line-height: 32px;
  z-index: 90;
}

.question-label {
  color: #fff;
}

.chars-before-type {
  color: #fff;
  font-weight: bold;
}

.chars-after-type {
  color: #ff0;
}

.player {
  position: absolute;
  z-index: 1;
  width: 140px;
  height: 150px;
  left: 255px;
  top: 165px;
}

.judges {
  top: 330px;
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

.level-up-sign {
  position: absolute;
  left: 34px;
  top: 80px;
  z-index: 130;
}
</style>
