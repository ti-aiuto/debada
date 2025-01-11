import {kanaPartToRomaji} from './kana-part-to-romaji';
import {RomajiChunk} from './romaji-chunk';

export function kanaWordToRomajiChunks(word: string): RomajiChunk[] {
  const result: RomajiChunk[] = [];
  let cursor = 0;
  while (cursor < word.length) {
    let cursorDiff = 0;
    const part2 = word.substr(cursor, 2);
    const part1 = word.substr(cursor, 1);
    if (
      part2.match(/^ん/) &&
      !part2.match(/^ん$/) &&
      !part2.match(/^ん[なにぬねの]/) &&
      !part2.match(/^ん[やゆよ]/)
    ) {
      // 「ん」でnが1回でも良いパターン
      const innerPart2 = word.substr(cursor + 1, 2);
      const innerPart1 = word.substr(cursor + 1, 1);
      for (const part of [innerPart2, innerPart1]) {
        const partsResult = kanaPartToRomaji(part);
        if (partsResult.length) {
          const appendedPartsResult = [];
          for (const i of ['n', 'nn']) {
            for (const j of partsResult) {
              appendedPartsResult.push(`${i}${j}`);
            }
          }
          result.push({chunk: `ん${part}`, candidates: appendedPartsResult});
          cursorDiff = part.length + 1;
          break;
        }
      }
    } else if (part2.match(/^っ/) && !part2.match(/^っ$/)) {
      // っから始まるパターン
      const innerPart2 = word.substr(cursor + 1, 2);
      const innerPart1 = word.substr(cursor + 1, 1);
      for (const part of [innerPart2, innerPart1]) {
        const partsResult = kanaPartToRomaji(part);
        if (partsResult.length) {
          const appendedPartsResult = [];
          for (const j of partsResult) {
            for (const i of [j[0]].concat(kanaPartToRomaji('っ'))) {
              appendedPartsResult.push(`${i}${j}`);
            }
          }
          result.push({chunk: `っ${part}`, candidates: appendedPartsResult});
          cursorDiff = part.length + 1;
          break;
        }
      }
    } else {
      for (const part of [part2, part1]) {
        const partsResult = kanaPartToRomaji(part);
        if (partsResult.length) {
          result.push({chunk: part, candidates: partsResult});
          cursorDiff = part.length;
          break;
        }
      }
    }
    if (cursorDiff === 0) {
      throw new Error(`${word}に変換不能な文字が含まれています`);
    }
    cursor += cursorDiff;
  }
  return result;
}
