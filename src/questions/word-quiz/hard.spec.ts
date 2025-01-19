import {kanaWordToRomajiChunks} from '../../kana2romaji/kana-word-to-romaji-chunks';
import {findHardQuestions} from './hard';

describe('findMiddleQuestions', () => {
  it('変換エラーがないこと', () => {
    expect(() => {
      findHardQuestions().forEach(question =>
        kanaWordToRomajiChunks(question.kana)
      );
    }).not.toThrow();
  });
});
