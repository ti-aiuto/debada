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
import KoshuKotaiSign from '../components/koshu-kotai-sign.vue';
import BlockSuccessSign from '../components/block-success-sign.vue';
import BlockFailSign from '../components/block-fail-sign.vue';
import BlockOverlay from '../components/block-overlay.vue';

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
const koshuKotaiSignRef = useTemplateRef('koshuKotaiSign');
const blockSuccessSignRef = useTemplateRef('blockSuccessSign');
const blockFailSignRef = useTemplateRef('blockFailSign');
const blockOverlayRef = useTemplateRef('blockOverlay');

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
  hasNext,
  koremadeUttaRoamji,
  nokoriRomaji,
  currentQuestionIndex,
} = typingGame(questions.map(item => item.kana));

const currentScore = ref(0);
const currentJudgesCount = ref(1);
const currentCommPoint = ref(3);
const currentEnabledState = ref(true);
const currentBlockModeEnabled = ref(false);

const currentQuestion = computed(() => {
  return questions[currentQuestionIndex.value];
});

const playerImageUrl = computed(() => {
  if (currentBlockModeEnabled.value) {
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

function enabaleBlockMode() {
  pauseGame();
  koshuKotaiSignRef.value!.show();
  blockOverlayRef.value!.show();
  setTimeout(() => {
    currentBlockModeEnabled.value = true;
    proceedToNextQuestion();
    resumeGame();
  }, 750);
}

function calcBlockGentenPoint() {
  return currentJudgesCount.value * (2 + 3 * nokoriRomaji.value.length / (koremadeUttaRoamji.value.length + nokoriRomaji.value.length))
}

function disableBlockMode(success: boolean) {
  pauseGame();
  if (success) {
    blockSuccessSignRef.value!.show();
  } else {
    currentScore.value -= calcBlockGentenPoint();
    blockFailSignRef.value!.show();
  }
  blockOverlayRef.value!.hide();
  setTimeout(() => {
    currentBlockModeEnabled.value = false;
    resumeGame();
  }, 750);
}

function nextLevelOrProceed(success: boolean) {
  if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length) {
    levelUpSignRef.value!.show();
    pauseGame();
    setTimeout(() => {
      currentJudgesCount.value = 3;
      goToBlockOrProceed();
      resumeGame();
    }, 750);
  } else if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length + selectedMiddleQuestions.length) {
    levelUpSignRef.value!.show();
    pauseGame();
    setTimeout(() => {
      currentJudgesCount.value = 5;
      goToBlockOrProceed();
      resumeGame();
    }, 750);
  } else {
    if (success) {
      judgesRef.value!.nod();
      gotPointGaugeRef.value!.show();
    }
    goToBlockOrProceed();
  }
}

function goToBlockOrProceed() {
  if (!hasNext.value) {
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

  if (currentJudgesCount.value === 1 && currentQuestionIndex.value + 1 === 4) {
    enabaleBlockMode();
  } else if (currentJudgesCount.value === 3 && (currentQuestionIndex.value - selectedEasyQuestions.length) + 1 === 2) {
    enabaleBlockMode();
  } else if (currentJudgesCount.value === 5 && (currentQuestionIndex.value - selectedEasyQuestions.length - selectedMiddleQuestions.length) + 1 === 3) {
    enabaleBlockMode();
  } else {
    proceedToNextQuestion();
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
    if (currentBlockModeEnabled.value) {
      disableBlockMode(false);
      return nextLevelOrProceed(false); // 強制的に次の問題に遷移
    }

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

    if (currentBlockModeEnabled.value) {
      // ブロック成功
      disableBlockMode(true);
    }
    nextLevelOrProceed(true);
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

      <block-overlay class="block-overlay" ref="blockOverlay" />

      <judges class="judges" :judges-count="currentJudgesCount" ref="judges" />
      <comm-gauge class="gauge" :comm-point="currentCommPoint" />

      <level-up-sign class="level-up-sign" ref="levelUpSign" />
      <koshu-kotai-sign class="koshu-kotai-sign" ref="koshuKotaiSign" />
      <block-success-sign class="block-success-sign" ref="blockSuccessSign" />
      <block-fail-sign class="block-fail-sign" ref="blockFailSign" />

      <got-point-sign class="got-point-sign" :comm-point="currentCommPoint" ref="gotPointSign" />
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
  z-index: -10;
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
  z-index: -10;
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
  z-index: -9;
  width: 140px;
  height: 150px;
  left: 255px;
  top: 165px;
}

.judges {
  top: 330px;
  position: absolute;
}

.gauge {
  position: absolute;
  left: 130px;
  top: 440px;
}

.got-point-sign {
  position: absolute;
  left: 170px;
  top: 270px;
}

.level-up-sign {
  position: absolute;
  left: 34px;
  top: 80px;
}

.koshu-kotai-sign {
  position: absolute;
  left: 34px;
  top: 80px;
}

.block-success-sign {
  position: absolute;
  left: 34px;
  top: 80px;
}

.block-fail-sign {
  position: absolute;
  left: 34px;
  top: 80px;
}

.block-overlay {
  position: absolute;
}
</style>
