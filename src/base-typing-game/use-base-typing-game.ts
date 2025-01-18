import {ref} from 'vue';
import {TypingWord} from '../kana2romaji/typing-word';

export function useBaseTypingGame(initialQunestions: string[]) {
  const questions = ref(structuredClone(initialQunestions));
  const currentQuestionIndex = ref(-1);
  const correctCount = ref(0);
  const wrongCount = ref(0);
  const renzokuCorrectCount = ref(0);
  const koremadeUttaRoamji = ref('');
  const nokoriRomaji = ref('');
  const hasCompletedWord = ref(false);
  const hasCompletedGame = ref(false);
  const hasNext = ref(true);

  let currentTypingWord: TypingWord | undefined = undefined;

  const typeKey = function (key: string): boolean {
    if (!currentTypingWord) {
      throw new Error('currentTypingWordが未定義');
    }

    if (hasCompletedGame.value) {
      return false;
    }

    const result = currentTypingWord.typeKey(key);
    syncVars();

    if (result) {
      correctCount.value += 1;
      renzokuCorrectCount.value += 1;
    } else {
      wrongCount.value += 1;
      renzokuCorrectCount.value = 0;
    }

    return result;
  };

  function proceedToNextQuestion(): boolean {
    if (currentQuestionIndex.value + 1 >= questions.value.length) {
      // 最後の問題の終了後は最後の問題が終わったときの状態を維持する
      hasCompletedGame.value = true;
      return false;
    }

    currentQuestionIndex.value += 1;
    const nextWord = questions.value[currentQuestionIndex.value];
    if (!nextWord) {
      throw new Error('indexの範囲外');
    }

    currentTypingWord = new TypingWord(nextWord);
    syncVars();

    return true;
  }

  function syncVars() {
    if (!currentTypingWord) {
      return;
    }

    koremadeUttaRoamji.value = currentTypingWord.koremadeUttaRoamji();
    nokoriRomaji.value = currentTypingWord.nokoriRomaji();
    hasCompletedWord.value = currentTypingWord.hasCompleted();
    hasNext.value = currentQuestionIndex.value + 1 < questions.value.length;
  }

  proceedToNextQuestion();

  return {
    correctCount,
    wrongCount,
    renzokuCorrectCount,
    typeKey,
    proceedToNextQuestion,
    hasCompletedWord,
    hasCompletedGame,
    koremadeUttaRoamji,
    hasNext,
    nokoriRomaji,
    currentQuestionIndex,
    questions,
  };
}
