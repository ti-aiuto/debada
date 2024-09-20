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
});
