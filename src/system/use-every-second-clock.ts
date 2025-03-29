import {onUnmounted} from 'vue';
import {useWindowBlurListener} from './use-window-blur-listener';
import {useWindowFocusListener} from './use-window-focus-listener';
import {useKeyDownListener} from './use-key-down-listener';

// 毎秒処理を実行する責務を切り出したもの
export function useEverySecondClock(
  clockTick:
    | ((timeElapsedSeconds: number) => void)
    | ((timeElapsedSeconds: number) => Promise<void>)
) {
  let isActive = true;
  useWindowBlurListener(() => {
    isActive = false;
  });

  useWindowFocusListener(() => {
    isActive = true;
  });

  // 万が一Focusイベントを捕捉できなかった場合もキー入力でタイマーを再開する
  useKeyDownListener(() => {
    isActive = true;
  });

  const timerId = setInterval(intervalClockCallback, 1000);
  function intervalClockCallback() {
    if (!isActive) {
      return;
    }

    clockTick(1); // 多少の誤差は許容
  }

  onUnmounted(() => {
    clearInterval(timerId);
  });
}
