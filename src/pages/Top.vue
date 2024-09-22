<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <RouterLink to="/prepare" class="start-button">
        <img :src="startButton" class="image-button">
      </RouterLink>

      <RouterLink to="/rule" class="rule-button">
        <img :src="ruleButton" class="image-button">
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import bgImageUrl from '../assets/background/title-screen.svg';
import startButton from '../assets/buttons/start-button.svg';
import ruleButton from '../assets/buttons/rule-button.png';
</script>

<style scoped>

.start-button {
  width: 300px;
  display: block;
  position: absolute;
  top: 300px;
  left: calc(320px - 150px);
}

.rule-button {
  width: 300px;
  display: block;
  position: absolute;
  top: 380px;
  left: calc(320px - 150px);
}
</style>
