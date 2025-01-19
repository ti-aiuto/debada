// setTimeoutの抽象化＋asyncで書けるようにする
export function asyncSleep(durationMilliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, durationMilliseconds));
}
