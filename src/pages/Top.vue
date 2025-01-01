<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <RouterLink to="/select_mode" class="start-button">
        <img :src="startButton" class="image-button">
      </RouterLink>

      <RouterLink to="/rule" class="rule-button">
        <img :src="ruleButton" class="image-button">
      </RouterLink>

      <div class="m-plus-rounded-1c-regular version">v2.0.0</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bgImageUrl from '../assets/background/title-screen.webp';
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

.version {
  position: absolute;
  font-size: 20px;
  right: 12px;
  bottom: 12px;
}
</style>
