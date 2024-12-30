import { Question } from "./question";

const questions = [
  ["このてんにかんしてはこうひともにきょうつうけんかいです", "この点に関しては肯否ともに共通見解です"],
  ["はっせいりょうときかんのかんてんでひかくしていきます", "発生量と期間の観点で比較していきます"],
  ["こうていがわはこのてんをしょうめいできていませんがじっさいにはこういうじつれいがあります", "肯定側はこの点を証明できていませんが実際にはこういう実例があります"],
  ["どうしてそのじつれいがにほんでもあてはまるといえるのですか", "どうしてその実例が日本でも当てはまるといえるのですか"],
  ["このてんにかんしてはりつろんちゅうのしりょうをのばしてください", "この点に関しては立論中の資料を伸ばしてください"],
  ["こちらのしりょうはこのてんもこうりょにいれているのでゆういせいがあります", "こちらの資料はこの点も考慮に入れているので優位性があります"],
  ["このしりょうはいんがかんけいがみとめられるとまではいえていません", "この資料は因果関係が認められるとまでは言えていません"],
  ["そのもんだいははっせいしませんしかりにはっせいしてもさきほどのりゆうによりちいさいです", "その問題は発生しませんし仮に発生しても先ほどの理由により小さいです"],
  ["しつぎでかくにんしたとおりひていがわはこのてんについてせつめいできていません", "質疑で確認した通り否定側はこの点について説明できていません"],
  ["じつれいにたいしてのはんばくはありましたがろじっくじたいはひていされていません", "実例に対しての反駁はありましたがロジック自体は否定されていません"],
  ["このてんとこのてんがことなるためそのれいはにほんにはあてはまりません", "この点とこの点が異なるためその例は日本には当てはまりません"],
  ["くにとしてこのせいさくをおこなうべきかというかんてんではこうていがわのしゅちょうをさいようするべきです", "国としてこの政策を行うべきかという観点では肯定側の主張を採用するべきです"],
];

export function findHardQuestions(): Question[] {
  return questions.map((question) => {
    return {
      kana: question[0],
      label: question[1]
    }
  });
}
