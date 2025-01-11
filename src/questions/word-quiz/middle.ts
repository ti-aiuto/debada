import {Question} from '../question';

const questions: [string, string][] = [
  [
    'なんばりんぐ',
    '数字を振って順番に話をしていくことで、話の全体像を分かりやすくすること。',
  ],
  [
    'らべりんぐ',
    '言いたいことを短い言葉でまとめることで、話の全体像を分かりやすくすること。',
  ],
  [
    'はんばくのよんびょうし',
    '「引用」「主張」「根拠」「結論」の四つを意識することで効果的な反駁ができる手順のこと。',
  ],
  [
    'だうと',
    '相手の説明や根拠の不十分な点を指摘しながら、証拠資料を読まずに「～かどうかわかりません」と反駁すること。',
  ],
  [
    'きっくあんどごー',
    '相手の主張の不十分な点を指摘したうえで、相手の主張を覆す主張を重ねること',
  ],
  ['いんぱくとあたっく', 'インパクトに対する反駁のこと。'],
  ['れあけーす', '「とても珍しい事例」のこと'],
  [
    'しょうこしりょう',
    '自分たちの主張を補強するために引用（≒持ってきてそのまま読み上げる）する文献等のこと。',
  ],
  ['しんぴょうせい', '証拠資料をなぜ・どのくらい信頼できるのか？の度合い。'],
  [
    'ゆういせい',
    '自分たちの主張が相手の主張よりもどれだけ優れているか？ということ。',
  ],
  [
    'しりょうせいきゅう',
    '相手チームがスピーチ内で引用した証拠資料の内容を見せてもらうこと。',
  ],
  [
    'ひかく',
    'メリットとデメリットがどちらも発生すると仮定したときに、それでも自分たちのほうが勝っているという主張をすること。',
  ],
  ['ぼーと', '「投票」を英語でいうと？'],
];

export function findMiddleQuestions(): Question[] {
  return questions.map(question => {
    return {
      kana: question[0],
      label: question[1],
    };
  });
}
