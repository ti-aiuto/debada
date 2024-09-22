<template>
  <div>
    <img :src="bgImageUrl" class="bg-image">
    <div>
      <RouterLink to="/">TOPへ</RouterLink>
    </div>
</div>
</template>

<script setup lang="ts">
import bgImageUrl from '../assets/background/rule-screen.png';
</script>
