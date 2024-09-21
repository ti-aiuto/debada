import {kanaPartToRomaji} from './kana-part-to-romaji';

describe('kanaPartToRomaji', () => {
  test('対応する文字のローマ字に変換すること', () => {
    expect(kanaPartToRomaji('あ')).toEqual(['a']);
    expect(kanaPartToRomaji('つ')).toEqual(['tu', 'tsu']);
    expect(kanaPartToRomaji('ぁ')).toEqual(['xa', 'la']);
    expect(kanaPartToRomaji('ふぁ')).toEqual([
      'fa',
      'huxa',
      'hula',
      'fuxa',
      'fula',
    ]);
  });
});
