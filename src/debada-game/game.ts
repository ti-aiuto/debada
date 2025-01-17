import { GameEventName } from "./game-event-name"

export function initializeGame({
  notifyGameEvent
}: {
  notifyGameEvent: (eventName: GameEventName) => void
}): {
  handleKeyDownEvent: (key: string) => void,
  clockTick: (timeElapsedSeconds: number) => void
} {
  function handleKeyDownEvent(key: string) {

  }

  function clockTick(timeElapsedSeconds: number) {

  }

  return {
    handleKeyDownEvent,
    clockTick
  }
}
