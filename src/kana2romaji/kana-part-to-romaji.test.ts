import {kanaPartToRomaji} from './kana-part-to-romaji';

describe('kanaPartToRomaji', () => {
  describe('一文字の場合', () => {
    test('対応する文字のローマ字に変換すること', () => {
      expect(kanaPartToRomaji('あ')).toEqual(['a']);
      expect(kanaPartToRomaji('つ')).toEqual(['tu', 'tsu']);
      expect(kanaPartToRomaji('ぁ')).toEqual(['xa', 'la']);
    });
  });

  describe('複数文字の場合', () => {
    test('対応する文字に変換したものと、一文字ずつ分解して変換したものを結合すること', () => {
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

  test('対応表にない文字は空', () => {
    expect(kanaPartToRomaji('無')).toEqual([]);
  });
});
