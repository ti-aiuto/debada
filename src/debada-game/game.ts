import { runAfterDelay } from "../browser/run-after-delay";
import { typingGame } from "../base-typing-game/typing-game";
import { findQuestions } from "../questions/find-questions";
import { JudgesCount } from "../types/judges-count";
import { calcBlockFailScore, calcCompleteGameScore, calcCompleteWordScore, standardJikanSeconds } from "./calc-score";
import { GameEventName } from "./game-event-name"
import { computed, ref } from 'vue'
import { GameMode } from "./game-mode";

export function initializeGame({
  mode,
  notifyGameEvent
}: {
  mode: GameMode,
  notifyGameEvent: (eventName: GameEventName) => void
}) {
  const { selectedEasyQuestions, selectedMiddleQuestions, selectedHardQuestions } = findQuestions(mode);
  const questions = selectedEasyQuestions.concat(selectedMiddleQuestions).concat(selectedHardQuestions);

  const {
    correctCount,
    wrongCount,
    renzokuCorrectCount,
    typeKey,
    proceedToNextQuestion,
    hasCompletedWord,
    hasNext,
    koremadeUttaRoamji,
    nokoriRomaji,
    currentQuestionIndex,
  } = typingGame(questions.map(item => item.kana));

  const gameState = ref<'to_do' | 'doing' | 'done'>('to_do')
  const currentScore = ref(0);
  const currentJudgesCount = ref<JudgesCount>(1);
  const currentCommPoint = ref(3);
  const currentEnabledState = ref(false);
  const currentBlockModeEnabled = ref(false);
  const nokoriJikanSeconds = ref(standardJikanSeconds({ currentJudgesCount: currentJudgesCount.value }));
  const showNokoriRomajiEnabled = ref(mode === 'typing_practice')
  const perKeyWrongCount = ref<{ [key: string]: number }>({});

  const currentQuestion = computed(() => {
    return questions[currentQuestionIndex.value];
  });

  function addScore(diff: number) {
    currentScore.value += diff;
    console.debug(currentScore.value, diff);
  }

  function clockTick(timeElapsedSeconds: number) {
    if (!currentEnabledState.value) {
      return;
    }
    nokoriJikanSeconds.value = Math.max(nokoriJikanSeconds.value - timeElapsedSeconds, 0);

    if (nokoriJikanSeconds.value <= 0) {
      pauseGame();
      gameState.value = 'done';
      notifyGameEvent('time_is_up');
    }
  }

  function startGame() {
    if (gameState.value !== 'to_do') {
      return;
    }
    gameState.value = 'doing';
    notifyGameEvent('game_start');
    runAfterDelay(() => {
      resumeGame();
    }, 1000);
  }

  function pauseGame() {
    currentEnabledState.value = false;
  }

  function resumeGame() {
    currentEnabledState.value = true;
  }

  function enabaleBlockMode() {
    pauseGame();
    notifyGameEvent('block_mode_start')
    runAfterDelay(() => {
      currentBlockModeEnabled.value = true;
      proceedToNextQuestion();
      resumeGame();
    }, 750);
  }

  function disableBlockMode(success: boolean) {
    pauseGame();
    addScore(calcBlockFailScore({
      currentJudgesCount: currentJudgesCount.value,
      nokoriRomajiLength: nokoriRomaji.value.length,
    }));
    if (success) {
      notifyGameEvent('block_mode_succeeded')
    } else {
      notifyGameEvent('block_mode_failed')
    }
    runAfterDelay(() => {
      currentBlockModeEnabled.value = false;
      resumeGame();
      nextLevelOrProceed(false); // 頷くと間が悪いので頷かない
    }, 750);
  }

  function nextLevelOrProceed(noddingEnabled: boolean) {
    if (!hasNext.value) {
      // コンプリート
      addScore(calcCompleteGameScore({ nokoriJikanSeconds: nokoriJikanSeconds.value, currentJudgesCount: currentJudgesCount.value }))
      pauseGame();
      gameState.value = 'done';
      notifyGameEvent('game_complete');
      return;
    } else if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length) {
      notifyGameEvent('level_up');
      pauseGame();
      runAfterDelay(() => {
        currentJudgesCount.value = 3;
        nokoriJikanSeconds.value = standardJikanSeconds({ currentJudgesCount: currentJudgesCount.value });
        goToBlockOrProceed();
        resumeGame();
      }, 750);
    } else if (currentQuestionIndex.value + 1 === selectedEasyQuestions.length + selectedMiddleQuestions.length) {
      notifyGameEvent('level_up');
      pauseGame();
      runAfterDelay(() => {
        currentJudgesCount.value = 5;
        nokoriJikanSeconds.value = standardJikanSeconds({ currentJudgesCount: currentJudgesCount.value });
        goToBlockOrProceed();
        resumeGame();
      }, 750);
    } else {
      if (noddingEnabled) {
        notifyGameEvent('question_complete');
      }
      goToBlockOrProceed();
    }
  }

  function goToBlockOrProceed() {
    if (currentJudgesCount.value === 1 && currentQuestionIndex.value + 1 === 4 - 1) {
      enabaleBlockMode();
    } else if (currentJudgesCount.value === 3 && (currentQuestionIndex.value - selectedEasyQuestions.length) + 1 === 2 - 1) {
      enabaleBlockMode();
    } else if (currentJudgesCount.value === 5 && (currentQuestionIndex.value - selectedEasyQuestions.length - selectedMiddleQuestions.length) + 1 === 3 - 1) {
      enabaleBlockMode();
    } else {
      proceedToNextQuestion();
    }
  }


  function handleKeyDownEvent(key: string) {
    if (key === 'Escape') {
      // ゲーム中止
      return notifyGameEvent('abort_game');
    }

    if (!currentEnabledState.value) {
      return;
    }

    if (!typeKey(key)) {
      const correctChar = nokoriRomaji.value[0];
      perKeyWrongCount.value[correctChar] = (perKeyWrongCount.value[correctChar] ?? 0) + 1;

      if (currentBlockModeEnabled.value) {
        return disableBlockMode(false);
      }

      // タイプミス効果音
    }

    if (renzokuCorrectCount.value >= 30) {
      currentCommPoint.value = 5;
    } else if (renzokuCorrectCount.value >= 15) {
      currentCommPoint.value = 4;
    } else {
      currentCommPoint.value = 3;
    }

    if (hasCompletedWord.value) {
      addScore(calcCompleteWordScore({ currentJudgesCount: currentJudgesCount.value, currentCommPoint: currentCommPoint.value, koremadeUttaRoamjiLength: koremadeUttaRoamji.value.length }));

      if (currentBlockModeEnabled.value) {
        // ブロック成功
        disableBlockMode(true);
      } else {
        nextLevelOrProceed(true);
      }
    }
  }

  return {
    handleKeyDownEvent,
    clockTick,
    startGame,
    gameState,
    currentQuestion,
    correctCount,
    wrongCount,
    renzokuCorrectCount,
    hasCompletedWord,
    hasNext,
    koremadeUttaRoamji,
    nokoriRomaji,
    currentQuestionIndex,
    currentScore,
    currentJudgesCount,
    currentCommPoint,
    currentEnabledState,
    currentBlockModeEnabled,
    nokoriJikanSeconds,
    showNokoriRomajiEnabled,
    perKeyWrongCount
  }
}
