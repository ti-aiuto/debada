// 単語一つを入力し終えたときのスコア加算
export function calcCompleteWordScore({
  currentJudgesCount,
  currentCommPoint,
}: {
  currentJudgesCount: number;
  currentCommPoint: number;
}) {
  return currentJudgesCount * currentCommPoint;
}

// 攻守交替でブロックに失敗したときのスコア加算
export function calcBlockFailScore({
  currentJudgesCount,
  nokoriRomajiLength,
  koremadeUttaRoamjiLength,
}: {
  currentJudgesCount: number;
  nokoriRomajiLength: number;
  koremadeUttaRoamjiLength: number;
}) {
  return (
    -1 *
    (currentJudgesCount *
      (2 +
        (3 * nokoriRomajiLength) /
          (koremadeUttaRoamjiLength + nokoriRomajiLength)))
  );
}

// 全ての単語を入力したときのスコア加算
export function calcCompleteGameScore({
  nokoriJikanSeconds,
}: {
  nokoriJikanSeconds: number;
}) {
  return nokoriJikanSeconds;
}
