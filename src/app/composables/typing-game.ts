import {ref} from 'vue';
import {TypingWord} from '../../kana2romaji/typing-word';

export function typingGame(words: string[]) {
  const currenWordIndex = ref(-1);
  const correctCount = ref(0);
  const wrongCount = ref(0);
  const renzokuCorrectCount = ref(0);
  const koremadeUttaRoamji = ref('');
  const nokoriRomaji = ref('');
  const hasCompletedWord = ref(false);

  let currentTypingWord: TypingWord | undefined = undefined;

  const typeKey = function (key: string): boolean {
    if (!currentTypingWord) {
      throw new Error('currentTypingWordが未定義');
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

  function prepareNextQuestion(): boolean {
    currenWordIndex.value += 1;

    const nextWord = words[currenWordIndex.value];
    if (!nextWord) {
      return false;
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
  }

  return {
    correctCount,
    wrongCount,
    renzokuCorrectCount,
    typeKey,
    prepareNextQuestion,
    hasCompletedWord,
  };
}
