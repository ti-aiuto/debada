import {typingGame} from './typing-game';

describe('typingGame', () => {
  test('一連の流れのテスト', () => {
    const {
      correctCount,
      wrongCount,
      renzokuCorrectCount,
      typeKey,
      proceedToNextQuestion,
      hasCompletedWord,
      hasCompletedGame,
      koremadeUttaRoamji,
      nokoriRomaji,
      currentQuestionIndex,
      questions,
    } = typingGame(['あか', 'あお', 'き']);

    expect(questions.value).toEqual(['あか', 'あお', 'き']);

    expect(correctCount.value).toEqual(0);
    expect(wrongCount.value).toEqual(0);
    expect(renzokuCorrectCount.value).toEqual(0);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('');
    expect(nokoriRomaji.value).toEqual('aka');
    expect(currentQuestionIndex.value).toEqual(0);
    expect(hasCompletedGame.value).toEqual(false);

    expect(correctCount.value).toEqual(0);
    expect(wrongCount.value).toEqual(0);
    expect(renzokuCorrectCount.value).toEqual(0);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('');
    expect(nokoriRomaji.value).toEqual('aka');

    expect(typeKey('a')).toBe(true);

    expect(correctCount.value).toEqual(1);
    expect(wrongCount.value).toEqual(0);
    expect(renzokuCorrectCount.value).toEqual(1);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('a');
    expect(nokoriRomaji.value).toEqual('ka');

    expect(typeKey('k')).toBe(true);

    expect(correctCount.value).toEqual(2);
    expect(wrongCount.value).toEqual(0);
    expect(renzokuCorrectCount.value).toEqual(2);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('ak');
    expect(nokoriRomaji.value).toEqual('a');

    expect(typeKey('s')).toBe(false);

    expect(correctCount.value).toEqual(2);
    expect(wrongCount.value).toEqual(1);
    expect(renzokuCorrectCount.value).toEqual(0);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('ak');
    expect(nokoriRomaji.value).toEqual('a');

    expect(typeKey('a')).toBe(true);

    expect(correctCount.value).toEqual(3);
    expect(wrongCount.value).toEqual(1);
    expect(renzokuCorrectCount.value).toEqual(1);
    expect(hasCompletedWord.value).toEqual(true);
    expect(koremadeUttaRoamji.value).toEqual('aka');
    expect(nokoriRomaji.value).toEqual('');

    expect(proceedToNextQuestion()).toBe(true);
    expect(hasCompletedGame.value).toEqual(false);

    expect(correctCount.value).toEqual(3);
    expect(wrongCount.value).toEqual(1);
    expect(renzokuCorrectCount.value).toEqual(1);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('');
    expect(nokoriRomaji.value).toEqual('ao');
    expect(currentQuestionIndex.value).toEqual(1);

    expect(typeKey('s')).toBe(false);

    expect(correctCount.value).toEqual(3);
    expect(wrongCount.value).toEqual(2);
    expect(renzokuCorrectCount.value).toEqual(0);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('');
    expect(nokoriRomaji.value).toEqual('ao');

    expect(typeKey('a')).toBe(true);

    expect(correctCount.value).toEqual(4);
    expect(wrongCount.value).toEqual(2);
    expect(renzokuCorrectCount.value).toEqual(1);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('a');
    expect(nokoriRomaji.value).toEqual('o');

    expect(typeKey('o')).toBe(true);

    expect(correctCount.value).toEqual(5);
    expect(wrongCount.value).toEqual(2);
    expect(renzokuCorrectCount.value).toEqual(2);
    expect(hasCompletedWord.value).toEqual(true);
    expect(koremadeUttaRoamji.value).toEqual('ao');
    expect(nokoriRomaji.value).toEqual('');

    expect(proceedToNextQuestion()).toBe(true);
    expect(hasCompletedGame.value).toEqual(false);

    expect(correctCount.value).toEqual(5);
    expect(wrongCount.value).toEqual(2);
    expect(renzokuCorrectCount.value).toEqual(2);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('');
    expect(nokoriRomaji.value).toEqual('ki');

    expect(typeKey('k')).toBe(true);

    expect(correctCount.value).toEqual(6);
    expect(wrongCount.value).toEqual(2);
    expect(renzokuCorrectCount.value).toEqual(3);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('k');
    expect(nokoriRomaji.value).toEqual('i');

    expect(typeKey('o')).toBe(false);

    expect(correctCount.value).toEqual(6);
    expect(wrongCount.value).toEqual(3);
    expect(renzokuCorrectCount.value).toEqual(0);
    expect(hasCompletedWord.value).toEqual(false);
    expect(koremadeUttaRoamji.value).toEqual('k');
    expect(nokoriRomaji.value).toEqual('i');

    expect(typeKey('i')).toBe(true);

    expect(correctCount.value).toEqual(7);
    expect(wrongCount.value).toEqual(3);
    expect(renzokuCorrectCount.value).toEqual(1);
    expect(hasCompletedWord.value).toEqual(true);
    expect(koremadeUttaRoamji.value).toEqual('ki');
    expect(nokoriRomaji.value).toEqual('');

    expect(proceedToNextQuestion()).toBe(false);
    expect(hasCompletedGame.value).toEqual(true);

    expect(correctCount.value).toEqual(7);
    expect(wrongCount.value).toEqual(3);
    expect(renzokuCorrectCount.value).toEqual(1);
    expect(hasCompletedWord.value).toEqual(true);
    expect(koremadeUttaRoamji.value).toEqual('ki');
    expect(nokoriRomaji.value).toEqual('');
    expect(currentQuestionIndex.value).toEqual(2);

    // 完了後に何かキーを入力した場合
    expect(typeKey('i')).toBe(false);

    expect(correctCount.value).toEqual(7);
    expect(wrongCount.value).toEqual(3);
    expect(renzokuCorrectCount.value).toEqual(1);
    expect(hasCompletedWord.value).toEqual(true);
    expect(koremadeUttaRoamji.value).toEqual('ki');
    expect(nokoriRomaji.value).toEqual('');
    expect(currentQuestionIndex.value).toEqual(2);
  });
});
