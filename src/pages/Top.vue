<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <RouterLink to="/prepare">
        <img :src="startButton" class="image-button start-button">
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
}
</style>
