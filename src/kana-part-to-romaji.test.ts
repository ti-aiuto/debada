import {kanaPartToRomaji} from './kana-part-to-romaji';

describe('kanaPartToRomaji', () => {
  test('対応する文字のローマ字に変換すること', () => {
    expect(kanaPartToRomaji('あ')).toEqual(['a']);
  });
});
