<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <div class="score m-plus-rounded-1c-regular">
        スコア：<b>{{ Math.floor(tweened.score) }}</b>
      </div>
      <div class="correct-count m-plus-rounded-1c-regular">
        正解タイプ数：<b>{{ Math.floor(tweened.correctCount) }}</b> ミスタイプ数：<b>{{ Math.floor(tweened.wrongCount) }}</b><br>
        間違えたキー：{{ perKeyWrongCount }}
      </div>

      <RouterLink to="/" class="to-title-button">
        <img :src="toTitleButton" class="image-button">
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import bgImageUrl from '../assets/background/result-screen.webp';
import toTitleButton from '../assets/buttons/to-title-button.png';
import gsap from 'gsap'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute();

const tweened = reactive({
  score: 0,
  correctCount: 0,
  wrongCount: 0,
})

gsap.to(tweened, { duration: 1, score: Number(route.query.score ?? 0) })
gsap.to(tweened, { duration: 1, correctCount: Number(route.query.correctCount ?? 0) })
gsap.to(tweened, { duration: 1, wrongCount: Number(route.query.wrongCount ?? 0) })

const perKeyWrongCount = ref(route.query.perKeyWrongCount ?? '');

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
  font-size: 21px;
  color: #fff;
  top: 85px;
  position: absolute;
  text-align: center;
  width: 100%;
}

.correct-count {
  font-size: 16px;
  color: #fff;
  top: 120px;
  position: absolute;
  text-align: center;
  width: 100%;
}
</style>
