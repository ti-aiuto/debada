<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <div class="score m-plus-rounded-1c-regular">
        スコア：{{ Math.floor(tweened.score) }}
      </div>

      <RouterLink to="/" class="to-title-button">
        <img :src="toTitleButton" class="image-button">
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import bgImageUrl from '../assets/background/result-screen.webp';
import toTitleButton from '../assets/buttons/to-title-button.png';
import gsap from 'gsap'
import { reactive } from 'vue'
import { GameResult } from '../debada-game/game-result';

const descriptor = Object.getOwnPropertyDescriptor(window, 'gameResult');
const savedGameResult = (descriptor?.value ?? {}) as GameResult;

const tweened = reactive({
  score: 0
})

gsap.to(tweened, { duration: 1, score: savedGameResult.score ?? 0 })

</script>

<style scoped>
.to-title-button {
  width: 240px;
  display: block;
  position: absolute;
  top: 400px;
  left: calc(320px - 120px);
}

.score {
  font-size: 22px;
  color: #fff;
  top: 110px;
  position: absolute;
  text-align: center;
  width: 100%;
}
</style>
