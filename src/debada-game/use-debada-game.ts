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
  const currentScore = ref(0); // 現在のスコア合計
  const currentJudgesCount = ref<JudgesCount>(1); // 審判人数＝現在ンおレベル
  const currentEnabledState = ref(false); // ゲームの一時停止中はfalse
  const currentBlockModeEnabled = ref(false); // ブロックモード中かどうか
  const nokoriJikanSeconds = ref(0); // 便宜上適当な値で初期化しておく
  const perKeyWrongCount = ref<{[key: string]: number}>({}); // 間違えたキーの対応表

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

  // 現在挑戦中の問題
  const currentQuestion = computed(() => {
    return questions[currentQuestionIndex.value];
  });

  // 現在のレベルの中で何問目か
  const questionIndexInCurrentDifficulty = computed(() => {
    if (currentJudgesCount.value === 1) {
      return currentQuestionIndex.value;
    } else if (currentJudgesCount.value === 3) {
      return currentQuestionIndex.value - selectedEasyQuestions.length;
    } else if (currentJudgesCount.value === 5) {
      return (
        currentQuestionIndex.value -
        selectedEasyQuestions.length -
        selectedMiddleQuestions.length
      );
    } else {
      throw new Error(
        `想定外のcurrentJudgesCount: ${currentJudgesCount.value}`
      );
    }
  });

  // 現在のレベルで何問あるか
  const questionsTotalCountInCurrentDifficulty = computed(() => {
    if (currentJudgesCount.value === 1) {
      return selectedEasyQuestions.length;
    } else if (currentJudgesCount.value === 3) {
      return selectedMiddleQuestions.length;
    } else if (currentJudgesCount.value === 5) {
      return selectedHardQuestions.length;
    } else {
      throw new Error(
        `想定外のcurrentJudgesCount: ${currentJudgesCount.value}`
      );
    }
  });

  // ブロックモードを有効化したいインデックスの配列を返す
  const blockModeQuestionIndicesInCurrentDifficulty = computed(() => {
    if (currentJudgesCount.value === 1) {
      return Object.freeze([3]);
    } else if (currentJudgesCount.value === 3) {
      return Object.freeze([1]);
    } else if (currentJudgesCount.value === 5) {
      return Object.freeze([2]);
    } else {
      throw new Error(
        `想定外のcurrentJudgesCount: ${currentJudgesCount.value}`
      );
    }
  });

  const nextJudgesCount = computed(() => {
    if (currentJudgesCount.value === 1) {
      return 3;
    } else if (currentJudgesCount.value === 3) {
      return 5;
    } else if (currentJudgesCount.value === 5) {
      return null; // 次はない
    } else {
      throw new Error(
        `想定外のcurrentJudgesCount: ${currentJudgesCount.value}`
      );
    }
  });

  // スコア加算の抽象化
  function addScore(diff: number) {
    currentScore.value += diff;
    console.debug(currentScore.value, diff);
  }

  // レベルの初期化
  function setupNextLevel(nextLevel: JudgesCount) {
    currentJudgesCount.value = nextLevel;

    nokoriJikanSeconds.value = standardJikanSeconds({
      currentJudgesCount: nextLevel,
    });
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
    setupNextLevel(1);
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
  }

  async function nextLevelOrProceed(noddingEnabled: boolean) {
    if (
      questionIndexInCurrentDifficulty.value + 1 ===
      questionsTotalCountInCurrentDifficulty.value
    ) {
      // 現在のレベルの問題を全部終わったとき

      if (!nextJudgesCount.value) {
        // 次がない＝全レベルコンプリート
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
      } else {
        // レベルアップ
        await Promise.resolve(
          notifyGameEvent('question_complete_without_nodding')
        );
        await Promise.resolve(notifyGameEvent('level_up'));
        setupNextLevel(nextJudgesCount.value);
      }
    } else {
      // ふつうに一問入力完了した場合
      await Promise.resolve(
        notifyGameEvent(
          noddingEnabled
            ? 'question_complete_with_nodding'
            : 'question_complete_without_nodding'
        )
      );
    }

    // 次の問題をセットする前にブロックモードの有効化を実行
    if (
      blockModeQuestionIndicesInCurrentDifficulty.value.includes(
        questionIndexInCurrentDifficulty.value + 1
      )
    ) {
      await enabaleBlockMode();
    }

    return Promise.resolve(proceedToNextQuestion());
  }

  async function handleKeyDownEvent(key: string) {
    if (key === 'Escape') {
      // ゲーム中止
      return notifyGameEvent('abort_game');
    }

    if (!currentEnabledState.value) {
      // ゲームを実行中でない場合は何もしない
      return;
    }

    if (!typeKey(key)) {
      const correctChar = nokoriRomaji.value[0];
      perKeyWrongCount.value[correctChar] =
        (perKeyWrongCount.value[correctChar] ?? 0) + 1;

      if (currentBlockModeEnabled.value) {
        disableBlockMode(false);
        return nextLevelOrProceed(false); // 頷くと間が悪いので頷かない
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
        await disableBlockMode(true);
        nextLevelOrProceed(false); // 頷くと間が悪いので頷かない
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
