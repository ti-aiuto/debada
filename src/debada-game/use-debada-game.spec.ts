import {useDebadaGame} from './use-debada-game';

describe('useDebadaGame', () => {
  function build({
    selectedEasyQuestions = [
      {label: 'か', kana: 'か'},
      {label: 'き', kana: 'き'},
      {label: 'く', kana: 'く'},
      {label: 'け', kana: 'け'},
      {label: 'こ', kana: 'こ'},
      {label: 'さ', kana: 'さ'},
      {label: 'し', kana: 'し'},
    ],
    selectedMiddleQuestions = [
      {label: 'た', kana: 'た'},
      {label: 'ち', kana: 'ち'},
      {label: 'つ', kana: 'つ'},
      {label: 'て', kana: 'て'},
    ],
    selectedHardQuestions = [
      {label: 'な', kana: 'な'},
      {label: 'に', kana: 'に'},
      {label: 'ぬ', kana: 'ぬ'},
      {label: 'ね', kana: 'ね'},
      {label: 'の', kana: 'の'},
    ],
    notifyGameEvent = jest.fn(),
  } = {}) {
    return useDebadaGame({
      selectedEasyQuestions,
      selectedMiddleQuestions,
      selectedHardQuestions,
      notifyGameEvent,
    });
  }

  // 全て想定通り入力できたときのテスト
  // 途中で打ち間違えたときのテスト
  // ブロックモード中にタイピング失敗した場合のテスト
  // 時間切れのテスト
  // 時間が進行するべきでないときに進行しないことのテスト
  // エスケープはいつでもできることのテスト
  // （できれば適切にawaitしていることのテスト）

  describe('質問の個数が足りない場合', () => {
    it('例外になること', () => {
      expect(() => build({selectedEasyQuestions: []})).toThrow();
      expect(() => build({selectedMiddleQuestions: []})).toThrow();
      expect(() => build({selectedHardQuestions: []})).toThrow();
    });
  });
});
