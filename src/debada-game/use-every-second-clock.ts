import {onUnmounted} from 'vue';

// 毎秒処理を実行する責務を切り出したもの
export function useEverySecondClock(
  clockTick: (timeElapsedSeconds: number) => void
) {
  let lastTime = Date.now();
  const timerId = setInterval(intervalClockCallback, 1000);
  function intervalClockCallback() {
    const timeElapsedSeconds = Math.round((Date.now() - lastTime) / 1000);
    lastTime = Date.now(); // 他タブを表示していたときなどタイマーが止まっている間のずれを補正
    clockTick(timeElapsedSeconds);
  }

  onUnmounted(() => {
    clearInterval(timerId);
  });
}
