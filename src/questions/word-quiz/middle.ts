import { Question } from "../question";

const questions = [
  ["ひかく", "メリットとデメリットがどちらも発生すると仮定したときに、それでも自分たちのメリット・デメリットのほうが勝っているという主張をすること。"],
  ['でぃすとーしょん', '不適切な中略を行うなど、筆者の言いたいことをねじ曲げるような方法で証拠資料を引用すること。'],
  ["いんぱくとあたっく", "インパクトに対する反駁のこと。"],
  ["だうと", "相手の説明や根拠の不十分な点を指摘しながら、証拠資料を読まずに「～かどうかわかりません」と反駁すること。"],
  ["れいとれすぽんす", "第一反駁でするべき反駁を第二反駁ですること。"],
  ["にゅーあぎゅめんと", "立論で主張しなかったメリット・デメリットを反駁で新たに主張すること。"],
  ["たーんあらうんど", "相手の主張している内容を逆用して、自分たちの側に有利な主張につなげること。"],
];

export function findMiddleQuestions(): Question[] {
  return questions.map((question) => {
    return {
      kana: question[0],
      label: question[1]
    }
  });
}
