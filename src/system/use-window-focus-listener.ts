import {onMounted, onUnmounted} from 'vue';

// Windowの状態監視の責務を切り出したもの
export function useWindowFocusListener(
  handleFocusEvent: (() => void) | (() => Promise<void>)
) {
  onMounted(() => {
    window.addEventListener('focus', handleFocusEvent);
  });

  onUnmounted(() => {
    window.removeEventListener('focus', handleFocusEvent);
  });
}
