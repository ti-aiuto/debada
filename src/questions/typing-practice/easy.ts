import {Question} from '../question';

const questions = [
  ['こうていがわ', '肯定側'],
  ['ひていがわ', '否定側'],
  ['げんじょうぶんせき', '現状分析'],
  ['はっせいかてい', '発生過程'],
  ['しんこくせい', '深刻性'],
  ['ないいんせい', '内因性'],
  ['かいけつせい', '解決性'],
  ['じゅうようせい', '重要性'],
  ['いんぱくと', 'インパクト'],
  ['いんぱくとあたっく', 'インパクトアタック'],
  ['りつろん', '立論'],
  ['しつぎ', '質疑'],
  ['おうとう', '応答'],
  ['はんばく', '反駁'],
  ['だうと', 'ダウト'],
  ['すぷれっど', 'スプレッド'],
  ['れいとれすぽんす', 'レイトレスポンス'],
  ['にゅーあーぎゅめんと', 'ニューアーギュメント'],
  ['しりょうせいきゅう', '資料請求'],
  ['さいんぽすてぃんぐ', 'サインポスティング'],
  ['りっしょうせきにん', '立証責任'],
  ['ぱぶりっくすぴーきんぐ', 'パブリックスピーキング'],
  ['どろーひてい', 'ドロー否定'],
  ['さいはんばく', '再反駁'],
  ['きっくあんどごー', 'キックアンドゴー'],
  ['しりょうせいきゅう', '資料請求'],
  ['ひかく', '比較'],
  ['こうひょう', '講評'],
  ['こみゅにけーしょんてん', 'コミュニケーション点'],
  ['ぷらん', 'プラン'],
  ['こんきょ', '根拠'],
  ['しょうこしりょう', '証拠資料'],
  ['えびでんす', 'エビデンス'],
  ['いんよう', '引用'],
  ['しゅちょう', '主張'],
  ['けつろん', '結論'],
  ['ろじっく', 'ロジック'],
  ['じつれい', '実例'],
  ['ちゅうりゃく', '中略'],
  ['ふろーしーと', 'フローシート'],
  ['しゅしん', '主審'],
  ['ふくしん', '副審'],
  ['じゅんびじかん', '準備時間'],
  ['どろっぷ', 'ドロップ'],
  ['こみゅてん', 'コミュ点'],
  ['ぼーと', 'ボート'],
  ['おふせっと', 'オフセット'],
];

export function findEasyQuestions(): Question[] {
  return questions.map(question => {
    return {
      kana: question[0],
      label: question[1],
    };
  });
}
