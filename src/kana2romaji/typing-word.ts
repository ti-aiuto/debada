import {kanaWordToRomajiChunks} from './kana-word-to-romaji-chunks';
import {RomajiCandidate} from './romaji-candidate';
import {RomajiChunk} from './romaji-chunk';

export class TypingWord {
  // chunkに分解した単語
  private romajiChunks: RomajiChunk[];

  // 現在何個目のchunkを入力しているか
  private chunkCursor = -1;

  private currentChunkRomajiCandidates: RomajiCandidate[] = [];
  private selectedChunkRomajiCandidate: RomajiCandidate = '';

  // これまでに打ったchunkの文字全部
  private uttaChunkRomajiAll = '';

  // 現在のchunkの中で何文字目まで入力したか
  private cursorInChunk = 0;

  private _correctCount = 0;
  private _wrongCount = 0;
  private _renzokuCorrectCount = 0;

  constructor(kanaWord: string) {
    this.romajiChunks = kanaWordToRomajiChunks(kanaWord);
    this.prepareNextChunk();
  }

  private prepareNextChunk(): boolean {
    this.chunkCursor += 1;

    if (this.selectedChunkRomajiCandidate) {
      this.uttaChunkRomajiAll += this.selectedChunkRomajiCandidate;
    }

    // 「chunk内の文字を全部打ったら空にする」で挙動を統一するため
    this.cursorInChunk = 0;

    const currentChunk = this.romajiChunks[this.chunkCursor];
    if (!currentChunk) {
      // 全chunkの入力完了
      return false;
    }

    this.currentChunkRomajiCandidates = currentChunk.candidates;
    const nextChunkRomajiCandidate = this.currentChunkRomajiCandidates[0];
    if (!nextChunkRomajiCandidate) {
      throw new Error('候補が見つかりません');
    }
    this.selectedChunkRomajiCandidate = nextChunkRomajiCandidate;

    return true;
  }

  // 文字入力
  // 戻り値は成否
  typeKey(uttaMoji: string): boolean {
    const chunkRomajiAndUttamoji = `${this.koremadeUttaRomajiInChunk()}${uttaMoji.toLowerCase()}`; // 現在のchunkで今打った文字も含めて打った文字

    // 画面に表示されているのとは違った入力方法があるためこの時点では正解・不正解はまだ決まっていない
    const nextChunkRomajiCandidate = this.currentChunkRomajiCandidates.find(
      candidateRomaji => {
        return candidateRomaji.startsWith(chunkRomajiAndUttamoji); // 最初にマッチした項目を採用する
      }
    );

    if (nextChunkRomajiCandidate) {
      // 正解
      this._correctCount += 1;
      this._renzokuCorrectCount += 1;

      if (this.cursorInChunk + 1 === nextChunkRomajiCandidate.length) {
        this.cursorInChunk += 1;
        // chunkを全部打ち終わったとき
        this.prepareNextChunk();
      } else {
        this.cursorInChunk += 1;
        // まだ入力中
        this.selectedChunkRomajiCandidate = nextChunkRomajiCandidate;
      }

      return true;
    } else {
      // 不正解
      this._wrongCount = 0;
      this._renzokuCorrectCount = 0;

      return false;
    }
  }

  koremadeUttaRomajiInChunk(): string {
    return this.selectedChunkRomajiCandidate.slice(0, this.cursorInChunk);
  }

  koremadeUttaRoamji(): string {
    return `${this.uttaChunkRomajiAll}${this.koremadeUttaRomajiInChunk()}`;
  }

  nokoriRomaji(): string {
    return (
      this.selectedChunkRomajiCandidate.slice(
        this.cursorInChunk,
        this.selectedChunkRomajiCandidate.length
      ) +
      this.romajiChunks
        .slice(this.chunkCursor + 1)
        .map(chunk => chunk.candidates[0])
        .join('')
    );
  }

  correctCount() {
    return this._correctCount;
  }

  wrongCount() {
    return this._wrongCount;
  }

  renzokuCorrectCount() {
    return this._renzokuCorrectCount;
  }

  hasCompleted(): boolean {
    return this.chunkCursor === this.romajiChunks.length;
  }
}
