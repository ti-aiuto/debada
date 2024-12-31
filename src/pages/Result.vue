<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <RouterLink to="/" class="to-title-button">
        <img :src="toTitleButton" class="image-button">
      </RouterLink>
    </div>
</div>
</template>

<script setup lang="ts">
import bgImageUrl from '../assets/background/result-screen.webp';
import toTitleButton from '../assets/buttons/to-title-button.png';
</script>

<style scoped>
.to-title-button {
  width: 240px;
  display: block;
  position: absolute;
  top: 400px;
  left: calc(320px - 120px);
}
</style>
