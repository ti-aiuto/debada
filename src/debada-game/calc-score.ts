import {JudgesCount} from '../types/judges-count';

// 標準秒間キータイプ数
function standardKeyTypeCountPerSeconds({
  currentJudgesCount,
}: {
  currentJudgesCount: JudgesCount;
}): number {
  return {
    1: 2,
    3: 4,
    5: 6,
  }[currentJudgesCount];
}

// 単位クリアスコア
function unitClearScore(): number {
  return 1000;
}

// 標準クリアスコア
function standardClearScore({
  currentJudgesCount,
}: {
  currentJudgesCount: JudgesCount;
}): number {
  return unitClearScore() * currentJudgesCount;
}

export function standardJikanSeconds({
  currentJudgesCount,
}: {
  currentJudgesCount: JudgesCount;
}): number {
  return {
    1: 3,
    3: 45,
    5: 60,
  }[currentJudgesCount];
}

// 標準キータイプあたりスコア
function standardPerKeyTypeScore({
  currentJudgesCount,
}: {
  currentJudgesCount: JudgesCount;
}): number {
  return (
    standardClearScore({currentJudgesCount}) /
    (standardJikanSeconds({currentJudgesCount}) *
      standardKeyTypeCountPerSeconds({currentJudgesCount}))
  );
}

// 単語一つを入力し終えたときのスコア加算
export function calcCompleteWordScore({
  currentJudgesCount,
  currentCommPoint,
  koremadeUttaRoamjiLength,
}: {
  currentJudgesCount: JudgesCount;
  currentCommPoint: number;
  koremadeUttaRoamjiLength: number;
}): number {
  return Math.ceil(
    koremadeUttaRoamjiLength *
      currentCommPoint *
      standardPerKeyTypeScore({
        currentJudgesCount,
      })
  );
}

// 攻守交替でブロックに失敗したときのスコア加算
export function calcBlockFailScore({
  currentJudgesCount,
  nokoriRomajiLength,
}: {
  currentJudgesCount: JudgesCount;
  nokoriRomajiLength: number;
}): number {
  return (
    -1 *
    3 *
    Math.ceil(
      nokoriRomajiLength *
        standardPerKeyTypeScore({
          currentJudgesCount,
        })
    )
  );
}

// 全ての単語を入力したときのスコア加算
export function calcCompleteGameScore({
  currentJudgesCount,
  nokoriJikanSeconds,
}: {
  currentJudgesCount: JudgesCount;
  nokoriJikanSeconds: number;
}): number {
  return Math.ceil(
    nokoriJikanSeconds *
      0.5 *
      standardKeyTypeCountPerSeconds({
        currentJudgesCount,
      }) *
      standardPerKeyTypeScore({
        currentJudgesCount,
      })
  );
}
