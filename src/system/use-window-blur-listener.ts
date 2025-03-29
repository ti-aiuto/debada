import {onMounted, onUnmounted} from 'vue';

// Windowの状態監視の責務を切り出したもの
export function useWindowBlurListener(
  handleBlurEvent: (() => void) | (() => Promise<void>)
) {
  onMounted(() => {
    window.addEventListener('blur', handleBlurEvent);
  });

  onUnmounted(() => {
    window.removeEventListener('blur', handleBlurEvent);
  });
}
