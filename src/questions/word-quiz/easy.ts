import {Question} from '../question';

const questions = [
  [
    'せいさくろんだい',
    '「AはBするべきである。是か非か」の形式で、ある主体が政策を実行するべきか否かを争う論題。',
  ],
  ['いんぱくと', '重要性・深刻性のこと。'],
  [
    'どろーひてい',
    'メリットとデメリットがどちらも同じ大きさのときに、否定側の勝ちとなるルール。',
  ],
  ['ぷらん', '論題を実行する具体的な手段のこと。'],
  [
    'しょうこしりょう',
    '自分たちの主張を補強するために引用（≒持ってきてそのまま読み上げる）する文献等のこと。',
  ],
  [
    'ぱぶりっくすぴーきんぐ',
    '公衆の面前でスピーチするのにふさわしい言葉遣いで話さなければならないというルール。',
  ],
  ['まなーてん', 'マナーが悪かった人が引かれる点数。'],
  ['じゅんびじかん', '試合の各パートの間に設けられる時間。'],
];

export function findEasyQuestions(): Question[] {
  return questions.map(question => {
    return {
      kana: question[0],
      label: question[1],
    };
  });
}