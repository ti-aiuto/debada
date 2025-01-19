import {kanaWordToRomajiChunks} from '../../kana2romaji/kana-word-to-romaji-chunks';
import {findMiddleQuestions} from './middle';

describe('findMiddleQuestions', () => {
  it('変換エラーがないこと', () => {
    expect(() => {
      findMiddleQuestions().forEach(question =>
        kanaWordToRomajiChunks(question.kana)
      );
    }).not.toThrow();
  });
});
