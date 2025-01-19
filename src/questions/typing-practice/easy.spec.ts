import {kanaWordToRomajiChunks} from '../../kana2romaji/kana-word-to-romaji-chunks';
import {findEasyQuestions} from './easy';

describe('findEasyQuestions', () => {
  it('変換エラーがないこと', () => {
    expect(() => {
      findEasyQuestions().forEach(question =>
        kanaWordToRomajiChunks(question.kana)
      );
    }).not.toThrow();
  });
});
