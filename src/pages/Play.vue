<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import bgImageUrl from '../assets/background/play-screen.webp';

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
import Player from '../components/player.vue';

import { typingGame } from '../composables/typing-game'
import { findQuestions } from '../questions/find-questions';
import { calcBlockFailScore, calcCompleteGameScore, calcCompleteWordScore, standardJikanSeconds } from '../debada-game/calc-score';
import { JudgesCount } from '../types/judges-count';
import { formatPerKeyWrongCount } from '../debada-game/format-per-key-wrong-count';

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
const currentJudgesCount = ref<JudgesCount>(1);
const currentCommPoint = ref(3);
const currentEnabledState = ref(false);
const currentBlockModeEnabled = ref(false);
const nokoriJikanSeconds = ref(standardJikanSeconds({ currentJudgesCount: currentJudgesCount.value }));
const showNokoriRomajiEnabled = ref(mode === 'typing-practice');

const perKeyWrongCount = ref<{ [key: string]: number }>({});

function addScore(diff: number) {
  currentScore.value += diff;
  console.debug(currentScore.value, diff);
}

let lastTime = Date.now();
let timerId = setInterval(timeElapsedSeconds, 1000);
function intervalClockCallback() {
  const timeElapsedSeconds = Math.round((Date.now() - lastTime) / 1000);
  lastTime = Date.now(); // 他タブを表示していたときなどタイマーが止まっている間のずれを補正
  clockTick(timeElapsedSeconds);
}

function clockTick(timeElapsedSeconds: number) {
  if (!currentEnabledState.value) {
    return;
  }
  nokoriJikanSeconds.value = Math.max(nokoriJikanSeconds.value - timeElapsedSeconds, 0);

  if (nokoriJikanSeconds.value <= 0) {
    clearInterval(timerId);

    pauseGame();
    notifyGameEvent('time_is_up');
    setTimeout(() => {
      goToResultPage();
    }, 1000);
  }
}


type EventName = 'game_start' | 'game_complete' | 'time_is_up' | 'level_up' | 'question_complete' | 'block_mode_start' | 'block_mode_succeeded' | 'block_mode_failed';

function notifyGameEvent(eventName: EventName) {
  if (eventName === 'game_start') {
    gameStartSignRef.value!.show();
  } else if (eventName === 'block_mode_start') {
    koshuKotaiSignRef.value!.show();
    blockOverlayRef.value!.show();
  } else if (eventName === 'block_mode_succeeded') {
    blockSuccessSignRef.value!.show();
    blockOverlayRef.value!.hide();
  } else if (eventName === 'block_mode_failed') {
    blockFailSignRef.value!.show();
    blockOverlayRef.value!.hide();
  } else if (eventName === 'level_up') {
    levelUpSignRef.value!.show();
  } else if (eventName === 'question_complete') {
    judgesRef.value!.nod();
    gotPointGaugeRef.value!.show();
  } else if (eventName === 'time_is_up') {
    timeUpSignRef.value!.show();
  } else if (eventName === 'game_complete') {
    completeSignRef.value!.show();
  }
}

const currentQuestion = computed(() => {
  return questions[currentQuestionIndex.value];
});

function pauseGame() {
  currentEnabledState.value = false;
}

function resumeGame() {
  currentEnabledState.value = true;
}

function enabaleBlockMode() {
  pauseGame();
  notifyGameEvent('block_mode_start')
  setTimeout(() => {
    currentBlockModeEnabled.value = true;
    proceedToNextQuestion();
    resumeGame();
  }, 750);
}

function disableBlockMode(success: boolean) {
  pauseGame();
  addScore(calcBlockFailScore({
    currentJudgesCount: currentJudgesCount.value,
    nokoriRomajiLength: nokoriRomaji.value.length,
  }));
  if (success) {
    notifyGameEvent('block_mode_succeeded')
  } else {
    notifyGameEvent('block_mode_failed')
  }
  setTimeout(() => {
    currentBlockModeEnabled.value = false;
    resumeGame();
    nextLevelOrProceed(false); // 頷くと間が悪いので頷かない
  }, 750);
}

function nextLevelOrProceed(noddingEnabled: boolean) {
  if (!hasNext.value) {
    // コンプリート
    addScore(calcCompleteGameScore({ nokoriJikanSeconds: nokoriJikanSeconds.value, currentJudgesCount: currentJudgesCount.value }))
    pauseGame();
    notifyGameEvent('game_complete');
    setTimeout(() => {
      goToResultPage();
    }, 1000);
    return;
  } else if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length) {
    notifyGameEvent('level_up');
    pauseGame();
    setTimeout(() => {
      currentJudgesCount.value = 3;
      nokoriJikanSeconds.value = standardJikanSeconds({ currentJudgesCount: currentJudgesCount.value });
      goToBlockOrProceed();
      resumeGame();
    }, 750);
  } else if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length + selectedMiddleQuestions.length) {
    notifyGameEvent('level_up');
    pauseGame();
    setTimeout(() => {
      currentJudgesCount.value = 5;
      nokoriJikanSeconds.value = standardJikanSeconds({ currentJudgesCount: currentJudgesCount.value });
      goToBlockOrProceed();
      resumeGame();
    }, 750);
  } else {
    if (noddingEnabled) {
      notifyGameEvent('question_complete');
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
      formattedPerKeyWrongCount: formatPerKeyWrongCount(perKeyWrongCount.value)
    }
  });
}

function goToBlockOrProceed() {
  if (currentJudgesCount.value === 1 && currentQuestionIndex.value + 1 === 4 - 1) {
    enabaleBlockMode();
  } else if (currentJudgesCount.value === 3 && (currentQuestionIndex.value - selectedEasyQuestions.length) + 1 === 2 - 1) {
    enabaleBlockMode();
  } else if (currentJudgesCount.value === 5 && (currentQuestionIndex.value - selectedEasyQuestions.length - selectedMiddleQuestions.length) + 1 === 3 - 1) {
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
    const correctChar = nokoriRomaji.value[0];
    perKeyWrongCount.value[correctChar] = (perKeyWrongCount.value[correctChar] ?? 0) + 1;

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
    addScore(calcCompleteWordScore({ currentJudgesCount: currentJudgesCount.value, currentCommPoint: currentCommPoint.value, koremadeUttaRoamjiLength: koremadeUttaRoamji.value.length }));

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
  notifyGameEvent('game_start');
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

      <judges class="judges" :judges-count="currentJudgesCount" ref="judges" />
      <comm-gauge class="gauge" :comm-point="currentCommPoint" v-show="currentEnabledState" />

      <div class="nokori-jikan m-plus-rounded-1c-regular" v-show="currentEnabledState">残り時間：{{ nokoriJikanSeconds }}秒
      </div>

      <player class="player" :block-mode-enabled="currentBlockModeEnabled" />
      <got-point-sign class="got-point-sign" :comm-point="currentCommPoint" ref="gotPointSign" />

      <level-up-sign class="level-up-sign" ref="levelUpSign" />
      <koshu-kotai-sign class="koshu-kotai-sign" ref="koshuKotaiSign" />
      <block-success-sign class="block-success-sign" ref="blockSuccessSign" />
      <block-fail-sign class="block-fail-sign" ref="blockFailSign" />
      <time-up-sign class="time-up-sign" ref="timeUpSign" />
      <complete-sign class="complete-sign" ref="completeSign" />
      <game-start-sign class="game-start-sign" ref="gameStartSign" />

      <block-overlay class="block-overlay" ref="blockOverlay" />
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
  left: 255px;
  top: 165px;
}

.judges {
  top: 330px;
  position: absolute;
  z-index: -9;
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
