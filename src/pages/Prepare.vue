<template>
  <div>
    準備画面
    <div>
      スペースキーまたはエンターキーを押下で開始
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function keyDownListener(event: KeyboardEvent) {
  if ([' ', 'Enter'].includes(event.key)) {
    router.push('/play');
  }
}

onMounted(() => document.addEventListener('keydown', keyDownListener))
onUnmounted(() => document.removeEventListener('keydown', keyDownListener))
</script>
