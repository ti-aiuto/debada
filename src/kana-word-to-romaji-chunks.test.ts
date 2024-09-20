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
  });
});
