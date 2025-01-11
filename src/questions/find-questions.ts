import {shuffle} from 'lodash';
import {findEasyQuestions as practiceFindEasyQuestions} from './typing-practice/easy';
import {findMiddleQuestions as practiceFindMiddleQuestions} from './typing-practice/middle';
import {findHardQuestions as practiceFindHardQuestions} from './typing-practice/hard';
import {findEasyQuestions as quizFindEasyQuestions} from './word-quiz/easy';
import {findMiddleQuestions as quizFindMiddleQuestions} from './word-quiz/middle';
import {findHardQuestions as quizFindHardQuestions} from './word-quiz/hard';
import {kanaWordToRomajiChunks} from '../kana2romaji/kana-word-to-romaji-chunks';

export function findQuestions(mode: 'typing-practice' | 'word-quiz') {
  if (mode === 'typing-practice') {
    // 最初に変換エラーがないことを確認しておく
    practiceFindEasyQuestions().forEach(item =>
      kanaWordToRomajiChunks(item.kana)
    );
    practiceFindMiddleQuestions().forEach(item =>
      kanaWordToRomajiChunks(item.kana)
    );
    practiceFindHardQuestions().forEach(item =>
      kanaWordToRomajiChunks(item.kana)
    );

    const selectedEasyQuestions = shuffle(practiceFindEasyQuestions()).slice(
      0,
      6
    );
    const selectedMiddleQuestions = shuffle(
      practiceFindMiddleQuestions()
    ).slice(0, 3);
    const selectedHardQuestions = shuffle(practiceFindHardQuestions()).slice(
      0,
      4
    );
    return {
      selectedEasyQuestions,
      selectedMiddleQuestions,
      selectedHardQuestions,
    };
  } else {
    // 最初に変換エラーがないことを確認しておく
    quizFindEasyQuestions().forEach(item => kanaWordToRomajiChunks(item.kana));
    quizFindMiddleQuestions().forEach(item =>
      kanaWordToRomajiChunks(item.kana)
    );
    quizFindHardQuestions().forEach(item => kanaWordToRomajiChunks(item.kana));

    const selectedEasyQuestions = shuffle(quizFindEasyQuestions()).slice(0, 6);
    const selectedMiddleQuestions = shuffle(quizFindMiddleQuestions()).slice(
      0,
      6
    );
    const selectedHardQuestions = shuffle(quizFindHardQuestions()).slice(0, 6);
    return {
      selectedEasyQuestions,
      selectedMiddleQuestions,
      selectedHardQuestions,
    };
  }
}
