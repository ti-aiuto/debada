<script setup lang="ts">
import bgImageUrl from '../assets/background/play-screen.svg';
import judge1Image from '../assets/sprites/judge1.png';
import gauge3Image from '../assets/sprites/gauge3.png';
import gauge4Image from '../assets/sprites/gauge4.png';
import gauge5Image from '../assets/sprites/gauge5.png';
import pointGood from '../assets/sprites/point_good.png';
import pointGreat from '../assets/sprites/point_great.png';
import pointFantastic from '../assets/sprites/point_fantastic.png';

import { typingGame } from '../composables/typing-game'
import { computed, onMounted, onUnmounted, ref } from 'vue'
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

const currentScore = ref(0);
const currentShinpanCount = ref(1);
const currentCommPoint = ref(3);
const judgeImagesClass = ref('');
const pointImageClass = ref('');

const gaugeImageUrl = computed(() => {
  if (currentCommPoint.value === 5) {
    return gauge5Image;
  } else if (currentCommPoint.value === 4) {
    return gauge4Image;
  } else {
    return gauge3Image;
  }
})

const pointImageUrl = computed(() => {
  if (currentCommPoint.value === 5) {
    return pointFantastic;
  } else if (currentCommPoint.value === 4) {
    return pointGreat;
  } else {
    return pointGood;
  }
})

const currentQuestion = computed(() => {
  return questions[currentQuestionIndex.value];
});

function abortGame() {
  router.push('/');
}

let noddingTimer: any = null;
let pointImageTimer: any = null;

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
    judgeImagesClass.value = 'judges-image-nodding';

    clearTimeout(noddingTimer);
    noddingTimer = setTimeout(() => {
      judgeImagesClass.value = '';
    }, 1000);

    pointImageClass.value = 'point-image-visible';
    clearTimeout(pointImageTimer);
    pointImageTimer = setTimeout(() => {
      pointImageClass.value = '';
    }, 1000);

    currentScore.value += currentShinpanCount.value * currentCommPoint.value;

    if (!proceedToNextQuestion()) {
      // TODO: この結果をどこかで覚える
      console.log({
        correctCount: correctCount.value,
        wrongCount: wrongCount.value,
        renzokuCorrectCount: renzokuCorrectCount.value,
        score: currentScore.value,
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
    <div class="wrapper">
      <img :src="bgImageUrl" class="bg-image">

      <div class="question-label-area m-plus-rounded-1c-regular">
        <span class="question-label">{{ currentQuestion.label }}</span>
      </div>

      <div class="question-kana-area m-plus-rounded-1c-regular">
        <span class="chars-before-type">{{ koremadeUttaRoamji.toUpperCase() }}</span><span class="chars-after-type">{{
          nokoriRomaji.toUpperCase() }}</span>
      </div>

      <img :src="gaugeImageUrl" class="gauge">
      <img :src="pointImageUrl" class="point-image" :class="pointImageClass">

      <div class="judges-area">
        <img :src="judge1Image" class="judges-image" :class="judgeImagesClass">
      </div>
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

@keyframes start-nodding {
  0% {
    top: 0;
  }

  25% {
    top: 8px;
  }

  50% {
    top: 0;
  }

  75% {
    top: 8px;
  }

  100% {
    top: 0;
  }
}

.judges-area {
  top: 325px;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  z-index: 100;
}

.judges-image {
  position: absolute;
}

.judges-image-nodding {
  animation-name: start-nodding;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
}

.gauge {
  position: absolute;
  width: 380px;
  height: 22px;
  left: 130px;
  top: 440px;
  z-index: 110;
}

.point-image {
  position: absolute;
  left: 170px;
  top: 270px;
  width: 300px;
  height: 74px;
  opacity: 0;
  z-index: 120;
}

@keyframes point-image-animate {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  25% {
    opacity: 1;
    transform: scale(1);
  }

  75% {
    opacity: 1;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(0);
  }
}

.point-image-visible {
  animation-name: point-image-animate;
  animation-duration: 0.75s;
  animation-iteration-count: 1;
}
</style>
