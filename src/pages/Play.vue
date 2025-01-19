<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
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

import { formatPerKeyWrongCount } from '../debada-game/format-per-key-wrong-count';
import { GameEventName } from '../debada-game/game-event-name';
import { useDebadaGame } from '../debada-game/use-debada-game';
import { findQuestions } from '../questions/find-questions';
import { useEverySecondClock } from '../debada-game/use-every-second-clock';
import { useKeyDownListener } from '../debada-game/use-key-down-listener';
import { asyncSleep } from '../system/async-sleep';

const router = useRouter();
const route = useRoute();

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

const mode = route.query.mode === 'word-quiz' ? 'word_quiz' : 'typing_practice';
const showNokoriRomajiEnabled = ref(mode === 'typing_practice');

const { selectedEasyQuestions, selectedMiddleQuestions, selectedHardQuestions } = findQuestions(mode)

const {
  handleKeyDownEvent,
  clockTick,
  startGame,
  currentQuestion,
  correctCount,
  wrongCount,
  renzokuCorrectCount,
  koremadeUttaRoamji,
  nokoriRomaji,
  currentScore,
  currentJudgesCount,
  currentCommPoint,
  currentEnabledState,
  currentBlockModeEnabled,
  nokoriJikanSeconds,
  perKeyWrongCount
} = useDebadaGame({
  selectedEasyQuestions, selectedMiddleQuestions, selectedHardQuestions,
  async notifyGameEvent(eventName: GameEventName) {
    if (eventName === 'game_start') {
      gameStartSignRef.value!.show();
      await asyncSleep(1000);
    } else if (eventName === 'block_mode_start') {
      koshuKotaiSignRef.value!.show();
      blockOverlayRef.value!.show();
      await asyncSleep(750);
    } else if (eventName === 'block_mode_succeeded') {
      blockSuccessSignRef.value!.show();
      blockOverlayRef.value!.hide();
      await asyncSleep(750);
    } else if (eventName === 'block_mode_failed') {
      blockFailSignRef.value!.show();
      blockOverlayRef.value!.hide();
      await asyncSleep(750);
    } else if (eventName === 'level_up') {
      levelUpSignRef.value!.show();
      await asyncSleep(750);
    } else if (eventName === 'question_complete_with_nodding') {
      judgesRef.value!.nod();
      gotPointGaugeRef.value!.show();
    } else if (eventName === 'time_is_up') {
      timeUpSignRef.value!.show();
      await asyncSleep(1000);
      goToResultPage();
    } else if (eventName === 'game_complete') {
      completeSignRef.value!.show();
      await asyncSleep(1000);
      goToResultPage();
    } else if (eventName === 'abort_game') {
      router.push('/');
    }
  }
});

useEverySecondClock(clockTick);
useKeyDownListener(handleKeyDownEvent);

onMounted(() => {
  startGame();
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
