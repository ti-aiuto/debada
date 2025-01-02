<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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
import TimeUpSign from '../components/time-up-sign.vue';
import CompleteSign from '../components/complete-sign.vue';
import GameStartSign from '../components/game-start-sign.vue';
import BlockOverlay from '../components/block-overlay.vue';

import { typingGame } from '../composables/typing-game'
import { findQuestions } from '../questions/find-questions';

const router = useRouter();
const route = useRoute();

const mode = route.query.mode === 'word-quiz' ? 'word-quiz' : 'typing-practice'
const { selectedEasyQuestions, selectedMiddleQuestions, selectedHardQuestions } = findQuestions(mode);
const questions = selectedEasyQuestions.concat(selectedMiddleQuestions).concat(selectedHardQuestions);

const gotPointGaugeRef = useTemplateRef('gotPointSign');
const judgesRef = useTemplateRef('judges');
const levelUpSignRef = useTemplateRef('levelUpSign');
const koshuKotaiSignRef = useTemplateRef('koshuKotaiSign');
const blockSuccessSignRef = useTemplateRef('blockSuccessSign');
const blockFailSignRef = useTemplateRef('blockFailSign');
const timeUpSignRef = useTemplateRef('timeUpSign');
const completeSignRef = useTemplateRef('completeSign');
const gameStartSignRef = useTemplateRef('gameStartSign');
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
const currentEnabledState = ref(false);
const currentBlockModeEnabled = ref(false);
const nokoriJikanSeconds = ref(30);
const showNokoriRomajiEnabled = ref(mode === 'typing-practice');

function nextTick() {
  if (!currentEnabledState.value) {
    lastTime = Date.now();
    return;
  }

  nokoriJikanSeconds.value -= Math.max(Math.round((Date.now() - lastTime) / 1000), 0);
  lastTime = Date.now(); // 他タブを表示していたときなどタイマーが止まっている間のずれを補正

  if (nokoriJikanSeconds.value <= 0) {
    clearInterval(timerId);

    pauseGame();
    timeUpSignRef.value!.show();
    setTimeout(() => {
      goToResultPage();
    }, 1000);
  }
}

let lastTime = Date.now();
let timerId = setInterval(nextTick, 1000);

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
  nextLevelOrProceed(success);
  setTimeout(() => {
    currentBlockModeEnabled.value = false;
    resumeGame();
  }, 750);
}

function nextLevelOrProceed(noddingEnabled: boolean) {
  if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length) {
    levelUpSignRef.value!.show();
    pauseGame();
    setTimeout(() => {
      currentJudgesCount.value = 3;
      nokoriJikanSeconds.value = 45;
      goToBlockOrProceed();
      resumeGame();
    }, 750);
  } else if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length + selectedMiddleQuestions.length) {
    levelUpSignRef.value!.show();
    pauseGame();
    setTimeout(() => {
      currentJudgesCount.value = 5;
      nokoriJikanSeconds.value = 60;
      goToBlockOrProceed();
      resumeGame();
    }, 750);
  } else {
    if (noddingEnabled) {
      judgesRef.value!.nod();
      gotPointGaugeRef.value!.show();
    }
    goToBlockOrProceed();
  }
}

function goToResultPage() {
  router.push({
    path: '/result', query: {
      correctCount: correctCount.value,
      wrongCount: wrongCount.value,
      renzokuCorrectCount: renzokuCorrectCount.value,
      score: currentScore.value,
    }
  });
}

function goToBlockOrProceed() {
  if (!hasNext.value) {
    currentScore.value += nokoriJikanSeconds.value;
    pauseGame();
    completeSignRef.value!.show();
    setTimeout(() => {
      goToResultPage();
    }, 1000);
  }

  if (currentJudgesCount.value === 1 && currentQuestionIndex.value + 1 === 3) {
    enabaleBlockMode();
  } else if (currentJudgesCount.value === 3 && (currentQuestionIndex.value - selectedEasyQuestions.length) + 1 === 1) {
    enabaleBlockMode();
  } else if (currentJudgesCount.value === 5 && (currentQuestionIndex.value - selectedEasyQuestions.length - selectedMiddleQuestions.length) + 1 === 2) {
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
      return disableBlockMode(false);
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
    } else {
      nextLevelOrProceed(true);
    }
  }
}



onMounted(() => {
  document.addEventListener('keydown', keyDownListener);

  gameStartSignRef.value!.show();
  setTimeout(() => {
    resumeGame();
  }, 1000);
});

onUnmounted(() => {
  document.removeEventListener('keydown', keyDownListener);
  clearInterval(timerId);
});
</script>

<template>
  <div>
    <div class="wrapper">
      <img :src="bgImageUrl" class="bg-image">

      <div class="question-label-area m-plus-rounded-1c-regular" v-show="currentEnabledState">
        <span class="question-label">{{ currentQuestion.label }}</span>
      </div>

      <div class="question-kana-area m-plus-rounded-1c-regular" v-show="currentEnabledState">
        <span><span class="chars-after-type">{{ koremadeUttaRoamji.toUpperCase() }}</span><span
            class="chars-before-type" v-show="showNokoriRomajiEnabled">{{
              nokoriRomaji.toUpperCase() }}</span></span>
      </div>

      <block-overlay class="block-overlay" ref="blockOverlay" />

      <judges class="judges" :judges-count="currentJudgesCount" ref="judges" />
      <comm-gauge class="gauge" :comm-point="currentCommPoint" v-show="currentEnabledState" />

      <div class="nokori-jikan m-plus-rounded-1c-regular" v-show="currentEnabledState" >残り時間：{{ nokoriJikanSeconds }}秒</div>

      <level-up-sign class="level-up-sign" ref="levelUpSign" />
      <koshu-kotai-sign class="koshu-kotai-sign" ref="koshuKotaiSign" />
      <block-success-sign class="block-success-sign" ref="blockSuccessSign" />
      <block-fail-sign class="block-fail-sign" ref="blockFailSign" />
      <time-up-sign class="time-up-sign" ref="timeUpSign" />
      <complete-sign class="complete-sign" ref="completeSign" />
      <game-start-sign class="game-start-sign" ref="gameStartSign" />

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
  font-size: 19px;
  position: absolute;
  top: 110px;
  word-break: break-all;
  padding: 0 24px;
  line-height: 22px;
  z-index: -10;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.question-label-area {
  width: 100%;
  font-size: 21px;
  position: absolute;
  top: 20px;
  word-break: break-all;
  padding: 0 24px;
  line-height: 28px;
  z-index: -10;
  height: 84px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.nokori-jikan {
  color: #000;
  position: absolute;
  top: 285px;
  left: 340px;
  border: solid 2px #000;
  padding: 8px;
  background-color: #fff;
  border-radius: 8px;
  z-index: -7;
}

.question-label {
  color: #fff;
}

.chars-before-type {
  color: #fff;
  font-weight: bold;
}

.chars-after-type {
  color: #999;
  font-weight: bold;
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

.time-up-sign {
  position: absolute;
  left: 34px;
  top: 80px;
}

.complete-sign {
  position: absolute;
  left: 34px;
  top: 80px;
}

.game-start-sign {
  position: absolute;
  left: 34px;
  top: 80px;
}

.block-overlay {
  position: absolute;
}
</style>
