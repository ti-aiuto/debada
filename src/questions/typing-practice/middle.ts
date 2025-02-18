import {Question} from '../../debada-game/question';

const questions = [
  ['これはれあけーすです', 'これはレアケースです'],
  ['よってぷらんをどうにゅうするべきです', 'よってプランを導入するべきです'],
  ['りつろんちゅうではのべていません', '立論中では述べていません'],
  ['ぐたいてきなすうじはわかりますか', '具体的な数字はわかりますか'],
  ['ほかのじつれいはありますか', '他の実例はありますか'],
  ['しりょうせいきゅうをおねがいします', '資料請求をお願いします'],
  ['めりっとのらべるをおしえてください', 'メリットのラベルを教えてください'],
  ['どうしてそういえるのですか', 'どうしてそういえるのですか'],
  [
    'これをこんきょにぼーとすることはできません',
    'これを根拠にボートすることはできません',
  ],
  ['ではいませつめいしてください', 'では今説明してください'],
  ['ぷらんはさんてんです', 'プランは三点です'],
  ['しんこくせいにはんばくします', '深刻性に反駁します'],
  [
    'よってぷらんではもんだいをかいけつできません',
    'よってプランでは問題を解決できません',
  ],
  [
    'めりっとがわのふろーしーとをごらんください',
    'メリット側のフローシートをご覧ください',
  ],
];

export function findMiddleQuestions(): Question[] {
  return questions.map(question => {
    return {
      kana: question[0],
      label: question[1],
    };
  });
}
