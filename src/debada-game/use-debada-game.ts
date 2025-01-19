import {useBaseTypingGame} from '../base-typing-game/use-base-typing-game';
import {JudgesCount} from './judges-count';
import {
  calcBlockFailScore,
  calcCompleteGameScore,
  calcCompleteWordScore,
  standardJikanSeconds,
} from './calc-score';
import {GameEventName} from './game-event-name';
import {computed, ref} from 'vue';
import {Question} from '../questions/question';

export function useDebadaGame({
  selectedEasyQuestions,
  selectedMiddleQuestions,
  selectedHardQuestions,
  notifyGameEvent,
}: {
  selectedEasyQuestions: Question[];
  selectedMiddleQuestions: Question[];
  selectedHardQuestions: Question[];
  notifyGameEvent: (eventName: GameEventName) => void | Promise<void>;
}) {
  const questions = selectedEasyQuestions
    .concat(selectedMiddleQuestions)
    .concat(selectedHardQuestions);

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
  } = useBaseTypingGame(questions.map(item => item.kana));

  const gameState = ref<'to_do' | 'doing'>('to_do');
  const currentScore = ref(0);
  const currentJudgesCount = ref<JudgesCount>(1);

  // 画面下部のコミュ点ゲージ
  const currentCommPoint = computed(() => {
    if (renzokuCorrectCount.value >= 30) {
      return 5;
    } else if (renzokuCorrectCount.value >= 15) {
      return 4;
    } else {
      return 3;
    }
  });

  // 残り時間の初期値
  const standardInitialNokoriJikanSeconds = computed(() => {
    return standardJikanSeconds({
      currentJudgesCount: currentJudgesCount.value,
    });
  });

  const currentEnabledState = ref(false);
  const currentBlockModeEnabled = ref(false);
  const nokoriJikanSeconds = ref(standardInitialNokoriJikanSeconds.value);
  const perKeyWrongCount = ref<{[key: string]: number}>({});

  const currentQuestion = computed(() => {
    return questions[currentQuestionIndex.value];
  });

  const questionIndexInCurrentDifficulty = computed(() => {
    if (currentJudgesCount.value === 3) {
      return currentQuestionIndex.value - selectedEasyQuestions.length;
    } else if (currentJudgesCount.value === 5) {
      return (
        currentQuestionIndex.value -
        selectedEasyQuestions.length -
        selectedMiddleQuestions.length
      );
    } else {
      return currentQuestionIndex.value;
    }
  });

  function addScore(diff: number) {
    currentScore.value += diff;
    console.debug(currentScore.value, diff);
  }

  async function clockTick(timeElapsedSeconds: number) {
    if (!currentEnabledState.value) {
      return;
    }
    nokoriJikanSeconds.value = Math.max(
      nokoriJikanSeconds.value - timeElapsedSeconds,
      0
    );

    if (nokoriJikanSeconds.value <= 0) {
      pauseGame();
      await Promise.resolve(notifyGameEvent('time_is_up'));
    }
  }

  async function startGame() {
    if (gameState.value !== 'to_do') {
      return;
    }
    gameState.value = 'doing';
    await Promise.resolve(notifyGameEvent('game_start'));
    resumeGame();
  }

  function pauseGame() {
    currentEnabledState.value = false;
  }

  function resumeGame() {
    currentEnabledState.value = true;
  }

  async function enabaleBlockMode() {
    pauseGame();
    await Promise.resolve(notifyGameEvent('block_mode_start'));
    currentBlockModeEnabled.value = true;
    proceedToNextQuestion();
    resumeGame();
  }

  async function disableBlockMode(success: boolean) {
    pauseGame();
    addScore(
      calcBlockFailScore({
        currentJudgesCount: currentJudgesCount.value,
        nokoriRomajiLength: nokoriRomaji.value.length,
      })
    );
    if (success) {
      await Promise.resolve(notifyGameEvent('block_mode_succeeded'));
    } else {
      await Promise.resolve(notifyGameEvent('block_mode_failed'));
    }
    currentBlockModeEnabled.value = false;
    resumeGame();
    nextLevelOrProceed(false); // 頷くと間が悪いので頷かない
  }

  async function nextLevelOrProceed(noddingEnabled: boolean) {
    if (!hasNext.value) {
      // コンプリート
      addScore(
        calcCompleteGameScore({
          nokoriJikanSeconds: nokoriJikanSeconds.value,
          currentJudgesCount: currentJudgesCount.value,
        })
      );
      pauseGame();
      await Promise.resolve(
        notifyGameEvent('question_complete_without_nodding')
      );
      await Promise.resolve(notifyGameEvent('game_complete'));
      return;
    } else if (
      currentQuestionIndex.value + 1 ===
      selectedEasyQuestions.length
    ) {
      await Promise.resolve(
        notifyGameEvent('question_complete_without_nodding')
      );
      await Promise.resolve(notifyGameEvent('level_up'));
      pauseGame();
      currentJudgesCount.value = 3;
      nokoriJikanSeconds.value = standardInitialNokoriJikanSeconds.value;
      await goToBlockOrProceed();
      resumeGame();
    } else if (
      currentQuestionIndex.value + 1 ===
      selectedEasyQuestions.length + selectedMiddleQuestions.length
    ) {
      await Promise.resolve(
        notifyGameEvent('question_complete_without_nodding')
      );
      await Promise.resolve(notifyGameEvent('level_up'));
      pauseGame();
      currentJudgesCount.value = 5;
      nokoriJikanSeconds.value = standardInitialNokoriJikanSeconds.value;
      await goToBlockOrProceed();
      resumeGame();
    } else {
      if (noddingEnabled) {
        await Promise.resolve(
          notifyGameEvent('question_complete_with_nodding')
        );
      } else {
        await Promise.resolve(
          notifyGameEvent('question_complete_without_nodding')
        );
      }
      await goToBlockOrProceed();
    }
  }

  function goToBlockOrProceed(): Promise<unknown> {
    if (
      currentJudgesCount.value === 1 &&
      questionIndexInCurrentDifficulty.value + 1 === 4 - 1
    ) {
      return enabaleBlockMode();
    } else if (
      currentJudgesCount.value === 3 &&
      questionIndexInCurrentDifficulty.value + 1 === 2 - 1
    ) {
      return enabaleBlockMode();
    } else if (
      currentJudgesCount.value === 5 &&
      questionIndexInCurrentDifficulty.value + 1 === 3 - 1
    ) {
      return enabaleBlockMode();
    } else {
      return Promise.resolve(proceedToNextQuestion());
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
      perKeyWrongCount.value[correctChar] =
        (perKeyWrongCount.value[correctChar] ?? 0) + 1;

      if (currentBlockModeEnabled.value) {
        return disableBlockMode(false);
      }

      // タイプミス効果音
    }

    if (hasCompletedWord.value) {
      addScore(
        calcCompleteWordScore({
          currentJudgesCount: currentJudgesCount.value,
          currentCommPoint: currentCommPoint.value,
          koremadeUttaRoamjiLength: koremadeUttaRoamji.value.length,
        })
      );

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
    perKeyWrongCount,
  };
}
