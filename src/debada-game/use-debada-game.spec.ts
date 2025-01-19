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

      // 開始前でも一問目が返る
      expect(currentJudgesCount.value).toEqual(1);
      expect(currentQuestion.value.label).toEqual('か');
      expect(koremadeUttaRoamji.value).toEqual('');
      expect(nokoriRomaji.value).toEqual('ka');

      // 初期状態の確認
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

      // 4問目
      expect(currentQuestion.value.label).toEqual('け');

      // 4問目入力完了
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('e');

      expect(fetchEventNamesSinceLastCall()).toEqual([
        'block_mode_succeeded',
        'question_complete',
      ]);

      // ブロックモード終了の確認
      expect(currentEnabledState.value).toBe(true);
      expect(currentBlockModeEnabled.value).toBe(false);

      // 正解してればスコア加算
      expect(correctCount.value).toEqual(10);
      expect(renzokuCorrectCount.value).toEqual(10);
      expect(currentScore.value).toEqual(500);

      // 5問目, 6問目
      expect(currentQuestion.value.label).toEqual('こ');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('o');

      expect(currentQuestion.value.label).toEqual('さ');
      await handleKeyDownEvent('s');
      await handleKeyDownEvent('a');

      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'question_complete',
      ]);

      // 7問目=最終問題
      expect(currentQuestion.value.label).toEqual('し');
      await handleKeyDownEvent('s');

      // レベルアップ前
      expect(currentJudgesCount.value).toEqual(1);
      expect(correctCount.value).toEqual(15);
      expect(renzokuCorrectCount.value).toEqual(15);
      expect(currentScore.value).toEqual(700);

      await handleKeyDownEvent('i');

      // レベルアップしたこと
      expect(currentJudgesCount.value).toEqual(3);
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'level_up',
      ]);
      expect(correctCount.value).toEqual(16);
      expect(renzokuCorrectCount.value).toEqual(16);
      expect(currentScore.value).toEqual(834);

      // レベル2を順に実行していく
      expect(currentQuestion.value.label).toEqual('た');
      await handleKeyDownEvent('t');
      await handleKeyDownEvent('a');
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'block_mode_start',
      ]);

      expect(currentQuestion.value.label).toEqual('ち');
      await handleKeyDownEvent('t');
      await handleKeyDownEvent('i');
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'block_mode_succeeded',
        'question_complete',
      ]);

      expect(currentQuestion.value.label).toEqual('つ');
      await handleKeyDownEvent('t');
      await handleKeyDownEvent('u');
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);

      expect(currentQuestion.value.label).toEqual('て');
      await handleKeyDownEvent('t');

      // レベルアップ前
      expect(currentJudgesCount.value).toEqual(3);
      expect(correctCount.value).toEqual(23);
      expect(renzokuCorrectCount.value).toEqual(23);
      expect(currentScore.value).toEqual(1236);

      await handleKeyDownEvent('e');

      // レベルアップしたこと
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'level_up',
      ]);
      expect(currentScore.value).toEqual(1370);

      // レベル3を順に実行していく
      expect(currentQuestion.value.label).toEqual('な');
      await handleKeyDownEvent('n');
      await handleKeyDownEvent('a');
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);

      expect(currentQuestion.value.label).toEqual('に');
      await handleKeyDownEvent('n');
      await handleKeyDownEvent('i');
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'block_mode_start',
      ]);

      expect(currentQuestion.value.label).toEqual('ぬ');
      await handleKeyDownEvent('n');
      await handleKeyDownEvent('u');
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'block_mode_succeeded',
        'question_complete',
      ]);

      expect(currentQuestion.value.label).toEqual('ね');
      await handleKeyDownEvent('n');
      await handleKeyDownEvent('e');
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);

      expect(currentQuestion.value.label).toEqual('の');
      await handleKeyDownEvent('n');

      // クリア前
      expect(currentEnabledState.value).toEqual(true);
      expect(correctCount.value).toEqual(33);
      expect(renzokuCorrectCount.value).toEqual(33);
      expect(currentScore.value).toEqual(1872);

      await handleKeyDownEvent('o');

      // クリアしたこと
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'game_complete',
      ]);
      expect(currentScore.value).toEqual(4511);
      expect(currentEnabledState.value).toEqual(false);
      expect(perKeyWrongCount.value).toEqual({});
    });
  });

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
