<script setup lang="ts">
import player1Url from '../assets/sprites/player1.webp';
import player2Url from '../assets/sprites/player2.webp';

import { computed } from 'vue'

const { blockModeEnabled } = defineProps({
  blockModeEnabled: Boolean
})

const playerImageUrl = computed(() => {
  if (blockModeEnabled) {
    return player2Url;
  } else {
    return player1Url;
  }
});

</script>

<template>
  <img :src="playerImageUrl" class="player">
</template>

<style scoped>
.player {
  width: 140px;
  height: 150px;
}
</style>
