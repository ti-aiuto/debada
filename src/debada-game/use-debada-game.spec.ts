import {useDebadaGame} from './use-debada-game';

describe('useDebadaGame', () => {
  function build({
    selectedEasyQuestions = [
      {label: 'か', kana: 'か'},
      {label: 'きき', kana: 'きき'}, // 文字数が長い場合にスコアが変わること
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

  describe('ミスなく完了できるパターンのテスト', () => {
    it('諸々想定通りに値になること', async () => {
      const notifyGameEvent = jest.fn();
      let notifyGameEventMockCursor = 0;

      // 前回の呼び出し以後に発生したイベント名の配列を返す（ステートフルなので注意）
      function fetchEventNamesSinceLastCall() {
        const result = notifyGameEvent.mock.calls
          .slice(notifyGameEventMockCursor, notifyGameEvent.mock.calls.length)
          .map(it => it[0]);
        notifyGameEventMockCursor = notifyGameEvent.mock.calls.length;
        return result;
      }

      const {
        handleKeyDownEvent,
        startGame,
        currentQuestion,
        correctCount,
        wrongCount,
        renzokuCorrectCount,
        koremadeUttaRoamji,
        nokoriRomaji,
        perKeyWrongCount,
        currentScore,
        currentJudgesCount,
        currentEnabledState,
        currentBlockModeEnabled,
      } = build({notifyGameEvent});

      expect(currentEnabledState.value).toBe(false);
      expect(currentBlockModeEnabled.value).toBe(false);

      expect(correctCount.value).toEqual(0);
      expect(wrongCount.value).toEqual(0);
      expect(renzokuCorrectCount.value).toEqual(0);
      expect(currentScore.value).toEqual(0);
      expect(perKeyWrongCount.value).toEqual({});

      expect(currentJudgesCount.value).toEqual(1);

      // 開始前でも一問目が返る
      expect(currentQuestion.value.label).toEqual('か');
      expect(koremadeUttaRoamji.value).toEqual('');
      expect(nokoriRomaji.value).toEqual('ka');

      expect(fetchEventNamesSinceLastCall()).toEqual([]);

      await startGame();

      // ゲーム開始直後の状態の確認
      expect(fetchEventNamesSinceLastCall()).toEqual(['game_start']);
      expect(currentEnabledState.value).toBe(true);
      expect(currentBlockModeEnabled.value).toBe(false);
      expect(currentJudgesCount.value).toEqual(1);

      expect(currentQuestion.value.label).toEqual('か');
      expect(koremadeUttaRoamji.value).toEqual('');
      expect(nokoriRomaji.value).toEqual('ka');

      await handleKeyDownEvent('k');

      expect(correctCount.value).toEqual(1);
      expect(wrongCount.value).toEqual(0);
      expect(renzokuCorrectCount.value).toEqual(1);
      expect(currentScore.value).toEqual(0);
      expect(currentQuestion.value.label).toEqual('か');
      expect(koremadeUttaRoamji.value).toEqual('k');
      expect(nokoriRomaji.value).toEqual('a');

      await handleKeyDownEvent('a');
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);

      expect(correctCount.value).toEqual(2);
      expect(renzokuCorrectCount.value).toEqual(2);
      expect(currentScore.value).toEqual(100);

      // 2問目
      expect(currentQuestion.value.label).toEqual('きき');
      expect(koremadeUttaRoamji.value).toEqual('');
      expect(nokoriRomaji.value).toEqual('kiki');

      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');

      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);
      expect(correctCount.value).toEqual(6);
      expect(renzokuCorrectCount.value).toEqual(6);
      expect(currentScore.value).toEqual(300);

      // 3問目
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('u');

      expect(correctCount.value).toEqual(8);
      expect(renzokuCorrectCount.value).toEqual(8);
      expect(currentScore.value).toEqual(400);

      // ブロックモードへの遷移の確認
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'block_mode_start',
      ]);

      expect(currentEnabledState.value).toBe(true);
      expect(currentBlockModeEnabled.value).toBe(true);

      expect(currentQuestion.value.label).toEqual('け');
      expect(koremadeUttaRoamji.value).toEqual('');
      expect(nokoriRomaji.value).toEqual('ke');
    });
  });

  // 全て想定通り入力できたときのテスト
  // 途中で打ち間違えたときのテスト
  // ブロックモード中にタイピング失敗した場合のテスト
  // 時間が経過した場合のテスト
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
