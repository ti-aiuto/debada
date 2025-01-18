import {onMounted, onUnmounted} from 'vue';

// キー監視の責務を切り出したもの
export function useKeyDownListener(handleKeyDownEvent: (key: string) => void) {
  function keyDownListener(event: KeyboardEvent) {
    handleKeyDownEvent(event.key);
  }

  onMounted(() => {
    document.addEventListener('keydown', keyDownListener);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', keyDownListener);
  });
}
