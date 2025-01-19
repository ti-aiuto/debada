import {kanaRomajiTable} from './kana-romaji-table';
import {RomajiCandidate} from './romaji-candidate';

// ローマ字表の一マスについて対応するローマ字を返す
// 複数の入力方法がある場合は全パターンを返す
export function kanaPartToRomaji(part: string): RomajiCandidate[] {
  const romajis = kanaRomajiTable[part];
  if (romajis) {
    const partCharProduct = [];
    if (part.length > 1) {
      if (part.length > 2) {
        throw new Error(`想定外のpart: ${part}`);
      }
      const partCharRomaji = part.split('').map(char => {
        const charRomaji = kanaRomajiTable[char];
        if (!charRomaji) {
          throw new Error(`分解不能 ${part}`);
        }
        return structuredClone(charRomaji);
      });
      for (const i of partCharRomaji[0]) {
        for (const j of partCharRomaji[1]) {
          partCharProduct.push(`${i}${j}`);
        }
      }
    }
    return structuredClone(romajis.concat(partCharProduct));
  }
  return [];
}
