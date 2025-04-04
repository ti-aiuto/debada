import {Question} from '../../debada-game/question';

const questions: [string, string][] = [
  [
    'すぷれっど',
    'ひたすらいろいろな反駁をして相手が再反駁できる余地を減らしていくこと。',
  ],
  ['すぱいくぷらん', 'デメリットの発生を防ぐために入れるプランのこと。'],
  [
    'ろんだいじゅうとうせい',
    '「プランが論題の範囲内に収まっているのか」という問題のこと。',
  ],
  ['ふぃあっと', '論題の内容は実行されるものとするルール。'],
  [
    'ぷらんのじっこうかのうせい',
    '「本当にそのプランが現実に可能なものなのか」という問題のこと。',
  ],
  [
    'せいさくろんだい',
    '「A は B するべきである。是か非か」の形式で、ある主体が政策を実行するべきか否かを争う論題。',
  ],
  [
    'かーどちぇっく',
    '相手が引用している証拠資料から本当にそう言えるのか？を確認・反論すること。',
  ],
  [
    'ぶんちゅうちゅうりゃく',
    '証拠資料を引用するときに文の途中で中略すること。',
  ],
  [
    'でぃすとーしょん',
    '不適切な中略を行うなど、筆者の言いたいことをねじ曲げるような方法で証拠資料を引用すること。',
  ],
  ['ろんてん', '試合の中で議論（≒反駁の応酬）となる・なったポイントのこと。'],
  [
    'こうとういんよう',
    '証拠資料の図表の数字や用語の定義など一部分だけを読み上げて引用すること。',
  ],
];

export function findHardQuestions(): Question[] {
  return questions.map(question => {
    return {
      kana: question[0],
      label: question[1],
    };
  });
}
