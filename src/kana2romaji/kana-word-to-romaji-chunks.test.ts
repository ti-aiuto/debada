import {kanaWordToRomajiChunks} from './kana-word-to-romaji-chunks';

describe('kanaWordToRomajiChunks', () => {
  test('対応する文字のRomajiChunkに変換すること', () => {
    expect(kanaWordToRomajiChunks('みそにこみ')).toEqual([
      {
        chunk: 'み',
        candidates: ['mi'],
      },
      {
        chunk: 'そ',
        candidates: ['so'],
      },
      {
        chunk: 'に',
        candidates: ['ni'],
      },
      {
        chunk: 'こ',
        candidates: ['ko', 'co'],
      },
      {
        chunk: 'み',
        candidates: ['mi'],
      },
    ]);
  });

  describe('「ん」', () => {
    test('「ん」一文字はnを2回', () => {
      expect(kanaWordToRomajiChunks('ん')).toEqual([
        {
          chunk: 'ん',
          candidates: ['nn'],
        },
      ]);
    });

    test('「ん」で終わる場合はnを2回', () => {
      expect(kanaWordToRomajiChunks('ぺん')).toEqual([
        {
          chunk: 'ぺ',
          candidates: ['pe'],
        },
        {
          chunk: 'ん',
          candidates: ['nn'],
        },
      ]);
    });

    test('「ん」＋な行の場合はnを2回', () => {
      expect(kanaWordToRomajiChunks('かんな')).toEqual([
        {
          chunk: 'か',
          candidates: ['ka', 'ca'],
        },
        {
          chunk: 'ん',
          candidates: ['nn'],
        },
        {
          chunk: 'な',
          candidates: ['na'],
        },
      ]);
    });

    test('「ん」＋な行以外の場合はnを1回でも可', () => {
      expect(kanaWordToRomajiChunks('ひんと')).toEqual([
        {
          chunk: 'ひ',
          candidates: ['hi'],
        },
        {
          chunk: 'んと',
          candidates: ['nto', 'nnto'],
        },
      ]);
    });

    test('「ん」＋「やゆよ」行の場合はnが2回必要', () => {
      expect(kanaWordToRomajiChunks('いんよう')).toEqual([
        {
          chunk: 'い',
          candidates: ['i'],
        },
        {
          chunk: 'ん',
          candidates: ['nn'],
        },
        {
          chunk: 'よ',
          candidates: ['yo'],
        },
        {
          chunk: 'う',
          candidates: ['u', 'wu', 'whu'],
        },
      ]);
    });
  });

  describe('「っ」', () => {
    test('「っ」で終わる場合は一文字単体で入力', () => {
      expect(kanaWordToRomajiChunks('さっ')).toEqual([
        {
          chunk: 'さ',
          candidates: ['sa'],
        },
        {
          chunk: 'っ',
          candidates: ['xtu', 'ltu'],
        },
      ]);
    });

    test('促音の場合は次の文字の一文字を重ねて入力も可', () => {
      expect(kanaWordToRomajiChunks('きっと')).toEqual([
        {
          chunk: 'き',
          candidates: ['ki'],
        },
        {
          chunk: 'っと',
          candidates: ['tto', 'xtuto', 'ltuto'],
        },
      ]);
    });
  });

  test('撥音+拗音の変換', () => {
    expect(kanaWordToRomajiChunks('いしゃ')).toEqual([
      {
        chunk: 'い',
        candidates: ['i'],
      },
      {
        chunk: 'しゃ',
        candidates: ['sya', 'sha', 'sixya', 'silya', 'shixya', 'shilya'],
      },
    ]);

    expect(kanaWordToRomajiChunks('でんしゃ')).toEqual([
      {
        chunk: 'で',
        candidates: ['de'],
      },
      {
        chunk: 'んしゃ',
        candidates: [
          'nsya',
          'nsha',
          'nsixya',
          'nsilya',
          'nshixya',
          'nshilya',
          'nnsya',
          'nnsha',
          'nnsixya',
          'nnsilya',
          'nnshixya',
          'nnshilya',
        ],
      },
    ]);

    expect(kanaWordToRomajiChunks('てんにょ')).toEqual([
      {
        chunk: 'て',
        candidates: ['te'],
      },
      {
        chunk: 'ん',
        candidates: ['nn'],
      },
      {
        chunk: 'にょ',
        candidates: ['nyo', 'nixyo', 'nilyo'],
      },
    ]);
  });

  test('長音の変換', () => {
    expect(kanaWordToRomajiChunks('おーい')).toEqual([
      {
        chunk: 'お',
        candidates: ['o'],
      },
      {
        chunk: 'ー',
        candidates: ['-'],
      },
      {
        chunk: 'い',
        candidates: ['i'],
      },
    ]);
  });
});
