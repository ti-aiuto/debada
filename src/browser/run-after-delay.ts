export function runAfterDelay(
  callback: Function,
  delayMilliseconds: number
): number {
  return setTimeout(callback, delayMilliseconds);
}
