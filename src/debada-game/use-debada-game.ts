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
import {useLevelDependantValues} from './use-level-dependant-values';

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
  if (!selectedEasyQuestions.length)
    throw new Error('selectedEasyQuestionsを1問以上指定してください');
  if (!selectedMiddleQuestions.length)
    throw new Error('selectedMiddleQuestionsを1問以上指定してください');
  if (!selectedHardQuestions.length)
    throw new Error('selectedHardQuestionsを1問以上指定してください');

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
  const currentJudgesCount = ref<JudgesCount>(1); // 審判人数＝現在のレベル
  const currentEnabledState = ref(false); // ゲームの一時停止中はfalse
  const currentBlockModeEnabled = ref(false); // ブロックモード中かどうか
  const nokoriJikanSeconds = ref(0); // 便宜上適当な値で初期化しておく
  const perKeyWrongCount = ref<{[key: string]: number}>({}); // 間違えたキーの対応表

  const {
    questionIndexInCurrentDifficulty,
    questionsTotalCountInCurrentDifficulty,
    blockModeQuestionIndicesInCurrentDifficulty,
    nextJudgesCount,
  } = useLevelDependantValues({
    currentJudgesCount,
    currentQuestionIndex,
    selectedEasyQuestions,
    selectedMiddleQuestions,
    selectedHardQuestions,
  });

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

  // 時間が経過するごとに実行される処理
  async function clockTick(timeElapsedSeconds: number) {
    if (!currentEnabledState.value) return;

    nokoriJikanSeconds.value = Math.max(
      nokoriJikanSeconds.value - timeElapsedSeconds,
      0
    );

    if (nokoriJikanSeconds.value <= 0) {
      pauseGame();
      await Promise.resolve(notifyGameEvent('time_is_up'));
    }
  }

  // ゲームの開始。一度だけ呼び出す
  async function startGame() {
    if (gameState.value !== 'to_do') {
      return;
    }
    setupNextLevel(1);
    gameState.value = 'doing';
    await Promise.resolve(notifyGameEvent('game_start'));
    resumeGame();
  }

  // 各種イベント監視やタイマーの一時停止
  function pauseGame() {
    currentEnabledState.value = false;
  }

  // 再開
  function resumeGame() {
    currentEnabledState.value = true;
  }

  // ゲーム中止
  function abortGame() {
    return notifyGameEvent('abort_game');
  }

  // ゲーム完遂
  function completeGame() {
    // 残時間をスコアに加算
    addScore(
      calcCompleteGameScore({
        nokoriJikanSeconds: nokoriJikanSeconds.value,
        currentJudgesCount: currentJudgesCount.value,
      })
    );

    pauseGame();
    return Promise.resolve(notifyGameEvent('game_complete'));
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
    await Promise.resolve(
      notifyGameEvent(success ? 'block_mode_succeeded' : 'block_mode_failed')
    );
    currentBlockModeEnabled.value = false;
    resumeGame();
  }

  async function nextLevelOrProceed() {
    if (
      questionIndexInCurrentDifficulty.value + 1 ===
      questionsTotalCountInCurrentDifficulty.value
    ) {
      // 現在のレベルの問題を全部終わったとき

      if (!nextJudgesCount.value) {
        // 次がない＝全レベルコンプリート
        return completeGame();
      } else {
        // レベルアップ
        await Promise.resolve(notifyGameEvent('level_up'));
        setupNextLevel(nextJudgesCount.value);
      }
    }

    // 次の問題をセットする前にブロックモードの有効化を実行
    if (
      blockModeQuestionIndicesInCurrentDifficulty.value.includes(
        questionIndexInCurrentDifficulty.value + 1
      )
    ) {
      await enabaleBlockMode();
    }

    proceedToNextQuestion();
  }

  async function handleKeyDownEvent(key: string) {
    if (key === 'Escape') abortGame();
    if (!currentEnabledState.value) return;

    if (typeKey(key)) {
      // キー入力を間違えていない場合
      if (hasCompletedWord.value) {
        // 一語全て入力し終わったとき
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

          // 頷くと間が悪いので頷かない
          await Promise.resolve(
            notifyGameEvent('question_complete_without_nodding')
          );

          nextLevelOrProceed();
        } else {
          await Promise.resolve(
            notifyGameEvent('question_complete_with_nodding')
          );
          nextLevelOrProceed();
        }
      }
    } else {
      // キーを間違えた場合
      const correctChar = nokoriRomaji.value[0];
      perKeyWrongCount.value[correctChar] =
        (perKeyWrongCount.value[correctChar] ?? 0) + 1;

      if (currentBlockModeEnabled.value) {
        disableBlockMode(false);

        // 頷くと間が悪いので頷かない
        await Promise.resolve(
          notifyGameEvent('question_complete_without_nodding')
        );

        nextLevelOrProceed();
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
