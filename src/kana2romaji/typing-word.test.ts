import {TypingWord} from './typing-word';

describe('TypingWord', () => {
  test('表示通りに間違いなく入力した場合', () => {
    const typingWord = new TypingWord('どてに');

    expect(typingWord.koremadeUttaRoamji()).toEqual('');
    expect(typingWord.koremadeUttaRomajiInChunk()).toEqual('');
    expect(typingWord.nokoriRomaji()).toEqual('doteni');
    expect(typingWord.correctCount()).toEqual(0);
    expect(typingWord.wrongCount()).toEqual(0);
    expect(typingWord.renzokuCorrectCount()).toEqual(0);
    expect(typingWord.hasCompleted()).toBe(false);

    expect(typingWord.typeKey('d')).toBe(true);

    expect(typingWord.koremadeUttaRoamji()).toEqual('d');
    expect(typingWord.koremadeUttaRomajiInChunk()).toEqual('d');
    expect(typingWord.nokoriRomaji()).toEqual('oteni');
    expect(typingWord.correctCount()).toEqual(1);
    expect(typingWord.wrongCount()).toEqual(0);
    expect(typingWord.renzokuCorrectCount()).toEqual(1);
    expect(typingWord.hasCompleted()).toBe(false);

    expect(typingWord.typeKey('o')).toBe(true);

    expect(typingWord.koremadeUttaRoamji()).toEqual('do');
    expect(typingWord.koremadeUttaRomajiInChunk()).toEqual('');
    expect(typingWord.nokoriRomaji()).toEqual('teni');
    expect(typingWord.correctCount()).toEqual(2);
    expect(typingWord.wrongCount()).toEqual(0);
    expect(typingWord.renzokuCorrectCount()).toEqual(2);
    expect(typingWord.hasCompleted()).toBe(false);

    expect(typingWord.typeKey('t')).toBe(true);

    expect(typingWord.koremadeUttaRoamji()).toEqual('dot');
    expect(typingWord.koremadeUttaRomajiInChunk()).toEqual('t');
    expect(typingWord.nokoriRomaji()).toEqual('eni');
    expect(typingWord.correctCount()).toEqual(3);
    expect(typingWord.wrongCount()).toEqual(0);
    expect(typingWord.renzokuCorrectCount()).toEqual(3);
    expect(typingWord.hasCompleted()).toBe(false);

    expect(typingWord.typeKey('e')).toBe(true);

    expect(typingWord.koremadeUttaRoamji()).toEqual('dote');
    expect(typingWord.koremadeUttaRomajiInChunk()).toEqual('');
    expect(typingWord.nokoriRomaji()).toEqual('ni');
    expect(typingWord.correctCount()).toEqual(4);
    expect(typingWord.wrongCount()).toEqual(0);
    expect(typingWord.renzokuCorrectCount()).toEqual(4);
    expect(typingWord.hasCompleted()).toBe(false);

    expect(typingWord.typeKey('n')).toBe(true);

    expect(typingWord.koremadeUttaRoamji()).toEqual('doten');
    expect(typingWord.koremadeUttaRomajiInChunk()).toEqual('n');
    expect(typingWord.nokoriRomaji()).toEqual('i');
    expect(typingWord.correctCount()).toEqual(5);
    expect(typingWord.wrongCount()).toEqual(0);
    expect(typingWord.renzokuCorrectCount()).toEqual(5);
    expect(typingWord.hasCompleted()).toBe(false);

    expect(typingWord.typeKey('i')).toBe(true);

    expect(typingWord.koremadeUttaRoamji()).toEqual('doteni');
    expect(typingWord.koremadeUttaRomajiInChunk()).toEqual('');
    expect(typingWord.nokoriRomaji()).toEqual('ni');
    expect(typingWord.correctCount()).toEqual(6);
    expect(typingWord.wrongCount()).toEqual(0);
    expect(typingWord.renzokuCorrectCount()).toEqual(6);
    expect(typingWord.hasCompleted()).toBe(true);
  });
});
