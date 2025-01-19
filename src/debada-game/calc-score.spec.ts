import {
  calcBlockFailScore,
  calcCompleteGameScore,
  calcCompleteWordScore,
  standardJikanSeconds,
} from './calc-score';

describe('standardJikanSeconds', () => {
  it('時間を返すこと', () => {
    expect(
      standardJikanSeconds({currentJudgesCount: 1})
    ).toBeGreaterThanOrEqual(1);
    expect(
      standardJikanSeconds({currentJudgesCount: 3})
    ).toBeGreaterThanOrEqual(1);
    expect(
      standardJikanSeconds({currentJudgesCount: 5})
    ).toBeGreaterThanOrEqual(1);
  });
});

describe('standardJikanSeconds', () => {
  describe('currentCommPointを増やした場合', () => {
    it('ポイントが加算されていくこと', () => {
      expect(
        calcCompleteWordScore({
          currentJudgesCount: 1,
          currentCommPoint: 3,
          koremadeUttaRoamjiLength: 1,
        })
      ).toEqual(50);

      expect(
        calcCompleteWordScore({
          currentJudgesCount: 1,
          currentCommPoint: 4,
          koremadeUttaRoamjiLength: 1,
        })
      ).toEqual(67);

      expect(
        calcCompleteWordScore({
          currentJudgesCount: 1,
          currentCommPoint: 5,
          koremadeUttaRoamjiLength: 1,
        })
      ).toEqual(84);
    });

    describe('審判人数が増えた場合', () => {
      it('難易度に応じたスコアを加算すること', () => {
        expect(
          calcCompleteWordScore({
            currentJudgesCount: 1,
            currentCommPoint: 3,
            koremadeUttaRoamjiLength: 1,
          })
        ).toEqual(50);

        expect(
          calcCompleteWordScore({
            currentJudgesCount: 3,
            currentCommPoint: 3,
            koremadeUttaRoamjiLength: 1,
          })
        ).toEqual(50);

        expect(
          calcCompleteWordScore({
            currentJudgesCount: 5,
            currentCommPoint: 3,
            koremadeUttaRoamjiLength: 1,
          })
        ).toEqual(42);

        expect(
          calcCompleteWordScore({
            currentJudgesCount: 1,
            currentCommPoint: 3,
            koremadeUttaRoamjiLength: 10,
          })
        ).toEqual(501);

        expect(
          calcCompleteWordScore({
            currentJudgesCount: 3,
            currentCommPoint: 3,
            koremadeUttaRoamjiLength: 10,
          })
        ).toEqual(501);

        expect(
          calcCompleteWordScore({
            currentJudgesCount: 5,
            currentCommPoint: 3,
            koremadeUttaRoamjiLength: 10,
          })
        ).toEqual(417);
      });
    });
  });
});

describe('calcBlockFailScore', () => {
  it('残り文字数に応じたスコアを減算すること', () => {
    // nokoriRomajiLength=0の場合
    expect(
      calcBlockFailScore({
        currentJudgesCount: 1,
        nokoriRomajiLength: 0,
      })
    ).toEqual(-0);

    expect(
      calcBlockFailScore({
        currentJudgesCount: 1,
        nokoriRomajiLength: 10,
      })
    ).toEqual(-501);

    expect(
      calcBlockFailScore({
        currentJudgesCount: 3,
        nokoriRomajiLength: 10,
      })
    ).toEqual(-501);

    expect(
      calcBlockFailScore({
        currentJudgesCount: 5,
        nokoriRomajiLength: 10,
      })
    ).toEqual(-417);
  });
});

describe('calcCompleteGameScore', () => {
  it('残り時間に応じたスコアを加算すること', () => {
    // nokoriJikanSeconds=0の場合
    expect(
      calcCompleteGameScore({currentJudgesCount: 1, nokoriJikanSeconds: 0})
    ).toEqual(0);

    expect(
      calcCompleteGameScore({currentJudgesCount: 1, nokoriJikanSeconds: 10})
    ).toEqual(167);

    expect(
      calcCompleteGameScore({currentJudgesCount: 3, nokoriJikanSeconds: 10})
    ).toEqual(334);

    expect(
      calcCompleteGameScore({currentJudgesCount: 5, nokoriJikanSeconds: 10})
    ).toEqual(417);
  });
});
