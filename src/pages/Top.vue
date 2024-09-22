<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <RouterLink to="/prepare" class="start-button">
        <img :src="startButton" class="image-button">
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import bgImageUrl from '../assets/background/title-screen.svg';
import startButton from '../assets/buttons/start-button.svg';
</script>

<style scoped>

.start-button {
  width: 300px;
  display: block;
  position: relative;
  top: 300px;
  left: calc(320px - 150px);
}
</style>
