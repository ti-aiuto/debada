import {nextTick} from 'vue';
import {useDebadaGame} from './use-debada-game';

describe('useDebadaGame', () => {
  async function waitForTick() {
    // Promiseを適切にawaitしていることをテストするため適当に待機
    await nextTick();
  }

  function prepareMockEventFn() {
    const notifyGameEvent = jest.fn();
    let notifyGameEventMockCursor = 0;

    const resolvers: {
      resolve: Function;
      reject: Function;
      eventName: string;
    }[] = [];
    let resolverCursor = 0;

    // 前回の呼び出し以後に発生したイベント名の配列を返す（ステートフルなので注意）
    function fetchEventNamesSinceLastCall() {
      const result = notifyGameEvent.mock.calls
        .slice(notifyGameEventMockCursor, notifyGameEvent.mock.calls.length)
        .map(it => it[0]);
      notifyGameEventMockCursor = notifyGameEvent.mock.calls.length;
      return result;
    }

    // 手動でresolve()して使う場合
    function enableManualResolve() {
      notifyGameEvent.mockImplementation((eventName: string) => {
        let resolve!: Function, reject!: Function;
        // いつかはPromise.withResolvers()でスッキリ書ける
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        resolvers.push({resolve, reject, eventName});
        return promise;
      });
    }

    function disableManualResolve() {
      return notifyGameEvent.mockImplementation(() => Promise.resolve(true));
    }

    // モックした関数に返させるPromiseを準備する
    // 戻り値の関数を呼び出すことで{ resolve, reject }の配列を取得できる
    function fetchResolversSinceLastCall() {
      const result = resolvers.slice(resolverCursor, resolvers.length);
      resolverCursor = resolvers.length;
      return result;
    }

    return {
      notifyGameEvent,
      fetchEventNamesSinceLastCall,
      fetchResolversSinceLastCall,
      enableManualResolve,
      disableManualResolve,
    };
  }

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
      const {notifyGameEvent, fetchEventNamesSinceLastCall} =
        prepareMockEventFn();

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
      expect(fetchEventNamesSinceLastCall()).toEqual([]);

      await handleKeyDownEvent('i');

      // レベルアップしたこと
      expect(currentJudgesCount.value).toEqual(3);
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'level_up',
      ]);
      expect(correctCount.value).toEqual(16);
      expect(renzokuCorrectCount.value).toEqual(16);
      expect(currentScore.value).toEqual(1335);

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
      expect(currentScore.value).toEqual(1737);
      expect(fetchEventNamesSinceLastCall()).toEqual([]);

      await handleKeyDownEvent('e');

      // レベルアップしたこと
      expect(currentJudgesCount.value).toEqual(5);
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'level_up',
      ]);
      expect(currentScore.value).toEqual(3371);

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
      expect(currentScore.value).toEqual(3873);
      expect(fetchEventNamesSinceLastCall()).toEqual([]);

      await handleKeyDownEvent('o');

      // クリアしたこと
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'game_complete',
      ]);
      expect(currentScore.value).toEqual(6512);
      expect(currentEnabledState.value).toEqual(false);
      expect(perKeyWrongCount.value).toEqual({});

      // ゲーム終了後の状態の確認（基本的には最終問題のまま）
      expect(currentQuestion.value.label).toEqual('の');
      expect(currentJudgesCount.value).toEqual(5);
    });
  });

  describe('ブロックモード中に間違えた場合', () => {
    it('強制的に次の問題に遷移すること', async () => {
      const {notifyGameEvent, fetchEventNamesSinceLastCall} =
        prepareMockEventFn();

      const {
        handleKeyDownEvent,
        startGame,
        currentQuestion,
        correctCount,
        wrongCount,
        renzokuCorrectCount,
        perKeyWrongCount,
        currentScore,
        currentEnabledState,
        currentBlockModeEnabled,
      } = build({notifyGameEvent});

      await startGame();

      expect(currentQuestion.value.label).toEqual('か');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('a');
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'game_start',
        'question_complete',
      ]);

      // 2問目
      expect(currentQuestion.value.label).toEqual('きき');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);

      // 3問目
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('u');

      // ブロックモードへの遷移の確認
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'block_mode_start',
      ]);

      expect(currentEnabledState.value).toBe(true);
      expect(currentBlockModeEnabled.value).toBe(true);

      // 4問目
      expect(currentQuestion.value.label).toEqual('け');

      await handleKeyDownEvent('k');

      expect(correctCount.value).toEqual(9);
      expect(renzokuCorrectCount.value).toEqual(9);
      expect(currentScore.value).toEqual(400);
      expect(wrongCount.value).toEqual(0);
      expect(perKeyWrongCount.value).toEqual({});

      // ここで間違える
      await handleKeyDownEvent('o');

      expect(fetchEventNamesSinceLastCall()).toEqual(['block_mode_failed']);

      // ブロックモード終了の確認
      expect(currentEnabledState.value).toBe(true);
      expect(currentBlockModeEnabled.value).toBe(false);

      // スコアが減ること
      expect(correctCount.value).toEqual(9);
      expect(renzokuCorrectCount.value).toEqual(0);
      expect(currentScore.value).toEqual(349);
      expect(wrongCount.value).toEqual(1);
      expect(perKeyWrongCount.value).toEqual({e: 1});

      // 5問目に遷移すること
      expect(currentQuestion.value.label).toEqual('こ');
    });
  });

  describe('時間が経過した場合のスコアの確認', () => {
    it('時間消費が0の場合は丸ごとスコア加算されること', async () => {
      const {
        handleKeyDownEvent,
        startGame,
        currentQuestion,
        currentScore,
        nokoriJikanSeconds,
      } = build();
      await startGame();

      // ゲーム開始直後の状態の確認
      expect(nokoriJikanSeconds.value).toEqual(30);

      expect(currentQuestion.value.label).toEqual('か');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('a');

      expect(currentScore.value).toEqual(100);

      // 2問目
      expect(currentQuestion.value.label).toEqual('きき');

      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');

      expect(currentScore.value).toEqual(300);

      // 3問目
      expect(currentQuestion.value.label).toEqual('く');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('u');

      expect(currentScore.value).toEqual(400);

      // 4問目
      expect(currentQuestion.value.label).toEqual('け');

      // 4問目入力完了
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('e');

      // 正解してればスコア加算
      expect(currentScore.value).toEqual(500);

      // 5問目, 6問目
      expect(currentQuestion.value.label).toEqual('こ');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('o');

      expect(currentQuestion.value.label).toEqual('さ');
      await handleKeyDownEvent('s');
      await handleKeyDownEvent('a');

      // 7問目=最終問題
      expect(currentQuestion.value.label).toEqual('し');
      await handleKeyDownEvent('s');

      // 時間消費なし
      expect(nokoriJikanSeconds.value).toEqual(30);

      await handleKeyDownEvent('i');

      // 残時間分の加算
      expect(currentScore.value).toEqual(1335);
    });

    it('時間を使った場合はその分スコア加算が減ること', async () => {
      const {
        handleKeyDownEvent,
        startGame,
        currentQuestion,
        currentScore,
        nokoriJikanSeconds,
        clockTick,
      } = build();
      await startGame();

      // ゲーム開始直後の状態の確認
      expect(nokoriJikanSeconds.value).toEqual(30);

      expect(currentQuestion.value.label).toEqual('か');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('a');

      expect(currentScore.value).toEqual(100);

      // 2問目
      expect(currentQuestion.value.label).toEqual('きき');

      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');

      expect(currentScore.value).toEqual(300);

      // 3問目
      expect(currentQuestion.value.label).toEqual('く');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('u');

      expect(currentScore.value).toEqual(400);

      // 4問目
      expect(currentQuestion.value.label).toEqual('け');

      // 4問目入力完了
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('e');

      // 正解してればスコア加算
      expect(currentScore.value).toEqual(500);

      // 5問目, 6問目
      expect(currentQuestion.value.label).toEqual('こ');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('o');

      expect(currentQuestion.value.label).toEqual('さ');
      await handleKeyDownEvent('s');
      await handleKeyDownEvent('a');

      // 7問目=最終問題
      expect(currentQuestion.value.label).toEqual('し');
      await handleKeyDownEvent('s');

      // 時間消費なし
      expect(nokoriJikanSeconds.value).toEqual(30);

      // 経過時間だけ減ること
      await clockTick(1);
      expect(nokoriJikanSeconds.value).toEqual(29);

      await clockTick(2);
      expect(nokoriJikanSeconds.value).toEqual(27);

      await handleKeyDownEvent('i');

      // 残時間分の加算
      expect(currentScore.value).toEqual(1285);
    });
  });

  describe('時間切れの挙動のテスト', () => {
    it('通常の入力中に時間切れになったら時間切れのイベントが発生すること', async () => {
      const {notifyGameEvent, fetchEventNamesSinceLastCall} =
        prepareMockEventFn();

      const {startGame, currentQuestion, nokoriJikanSeconds, clockTick} = build(
        {notifyGameEvent}
      );
      await startGame();

      // ゲーム開始直後の状態の確認
      expect(fetchEventNamesSinceLastCall()).toEqual(['game_start']);
      expect(nokoriJikanSeconds.value).toEqual(30);
      expect(currentQuestion.value.label).toEqual('か');

      // 時間切れの再現
      await clockTick(31);
      expect(nokoriJikanSeconds.value).toEqual(0); // 負数にはならない
      expect(fetchEventNamesSinceLastCall()).toEqual(['time_is_up']);
    });

    it('ブロックモード中に時間切れになったら時間切れのイベントが発生すること', async () => {
      const {notifyGameEvent, fetchEventNamesSinceLastCall} =
        prepareMockEventFn();

      const {
        handleKeyDownEvent,
        startGame,
        currentQuestion,
        clockTick,
        nokoriJikanSeconds,
      } = build({notifyGameEvent});

      await startGame();

      expect(currentQuestion.value.label).toEqual('か');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('a');
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'game_start',
        'question_complete',
      ]);

      // 2問目
      expect(currentQuestion.value.label).toEqual('きき');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);

      // 3問目
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('u');

      // ブロックモードへの遷移の確認
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'block_mode_start',
      ]);

      // 時間切れの再現
      await clockTick(31);
      expect(nokoriJikanSeconds.value).toEqual(0); // 負数にはならない
      expect(fetchEventNamesSinceLastCall()).toEqual(['time_is_up']);
    });
  });

  describe('時間が進行するべきでないときの時間経過のテスト', () => {
    it('時間が変わらないこと・適切にawaitできていること', async () => {
      const {
        notifyGameEvent,
        fetchEventNamesSinceLastCall,
        fetchResolversSinceLastCall,
        enableManualResolve,
        disableManualResolve,
      } = prepareMockEventFn();

      enableManualResolve();

      const {
        handleKeyDownEvent,
        startGame,
        currentQuestion,
        clockTick,
        nokoriJikanSeconds,
      } = build({notifyGameEvent});

      // game_startの処理中に時間切れを起こした場合
      let promise = startGame();
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual(['game_start']);
      expect(nokoriJikanSeconds.value).toEqual(30); // promise解決前
      await clockTick(100);
      expect(nokoriJikanSeconds.value).toEqual(30); // 時間経過しない
      fetchResolversSinceLastCall()[0].resolve();
      await promise;

      expect(currentQuestion.value.label).toEqual('か');
      await handleKeyDownEvent('k');
      promise = handleKeyDownEvent('a');
      fetchResolversSinceLastCall()[0].resolve();
      await promise;
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);

      // // 2問目
      expect(currentQuestion.value.label).toEqual('きき');
      await handleKeyDownEvent('k');
      await handleKeyDownEvent('i');
      await handleKeyDownEvent('k');

      // question_completeの処理中に時間経過を起こした場合
      promise = handleKeyDownEvent('i');
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);
      expect(nokoriJikanSeconds.value).toEqual(30);
      await clockTick(1);
      expect(nokoriJikanSeconds.value).toEqual(29); // 時間経過が進むこと
      fetchResolversSinceLastCall()[0].resolve();
      await promise;

      // 3問目
      expect(currentQuestion.value.label).toEqual('く');
      await handleKeyDownEvent('k');

      // block_mode_startの処理中に時間経過を起こした場合
      promise = handleKeyDownEvent('u');
      fetchResolversSinceLastCall()[0].resolve();
      await nextTick();
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'block_mode_start',
      ]);
      expect(nokoriJikanSeconds.value).toEqual(29); // promise解決前
      await clockTick(100);
      expect(nokoriJikanSeconds.value).toEqual(29); // 時間経過しない

      fetchResolversSinceLastCall()[0].resolve();
      await promise;
      await waitForTick();

      // 4問目
      expect(currentQuestion.value.label).toEqual('け');
      await handleKeyDownEvent('k');

      // block_mode_succeededの処理中に時間経過を起こした場合
      promise = handleKeyDownEvent('e');
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'block_mode_succeeded',
        'question_complete',
      ]);
      expect(nokoriJikanSeconds.value).toEqual(29);
      await clockTick(100);
      expect(nokoriJikanSeconds.value).toEqual(29); // 時間経過しない
      fetchResolversSinceLastCall()
        .slice(0, 2)
        .forEach(it => it.resolve());
      await promise;

      // 5問目, 6問目
      disableManualResolve();
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
      enableManualResolve();

      // 7問目
      // level_upの処理中に時間経過した場合
      expect(currentQuestion.value.label).toEqual('し');
      await handleKeyDownEvent('s');
      promise = handleKeyDownEvent('i');
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);
      fetchResolversSinceLastCall()[0].resolve();
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual(['level_up']);

      expect(nokoriJikanSeconds.value).toEqual(29); // promise解決前
      await clockTick(100);
      expect(nokoriJikanSeconds.value).toEqual(29); // 時間経過しない

      fetchResolversSinceLastCall()[0].resolve();
      await promise;
      await waitForTick();

      // 次レベルの一問目
      expect(currentQuestion.value.label).toEqual('た');
      await handleKeyDownEvent('t');
      promise = handleKeyDownEvent('a');
      fetchResolversSinceLastCall()[0].resolve();
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'block_mode_start',
      ]);
      fetchResolversSinceLastCall()[0].resolve();
      await promise;
      await waitForTick();

      // 次のレベルの2問目＝ブロックモード
      expect(currentQuestion.value.label).toEqual('ち');
      await handleKeyDownEvent('t');

      // block_mode_failedの処理中に時間経過を起こした場合
      promise = handleKeyDownEvent('o'); // タイプミス
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual(['block_mode_failed']);
      expect(nokoriJikanSeconds.value).toEqual(45);
      await clockTick(100);
      expect(nokoriJikanSeconds.value).toEqual(45); // 時間経過しない
      fetchResolversSinceLastCall()
        .slice(0, 2)
        .forEach(it => it.resolve());
      await promise;
      await waitForTick();

      // 残りの問題
      disableManualResolve();

      expect(currentQuestion.value.label).toEqual('つ');
      await handleKeyDownEvent('t');
      await handleKeyDownEvent('u');
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);

      expect(currentQuestion.value.label).toEqual('て');
      await handleKeyDownEvent('t');
      await handleKeyDownEvent('e');
      expect(fetchEventNamesSinceLastCall()).toEqual([
        'question_complete',
        'level_up',
      ]);

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

      enableManualResolve();
      expect(currentQuestion.value.label).toEqual('の');
      await handleKeyDownEvent('n');

      // game_completeの途中に時間経過した場合
      promise = handleKeyDownEvent('o');
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual(['question_complete']);
      fetchResolversSinceLastCall()[0].resolve();
      await waitForTick();
      expect(fetchEventNamesSinceLastCall()).toEqual(['game_complete']);

      expect(nokoriJikanSeconds.value).toEqual(60);
      await clockTick(100);
      expect(nokoriJikanSeconds.value).toEqual(60); // 時間経過しない
      fetchResolversSinceLastCall()[0].resolve();
      await promise; // promiseが時間内に解決できること
      expect(fetchEventNamesSinceLastCall()).toEqual([]); // 余計なイベントが発火しないこと
    });
  });

  // 途中で打ち間違えたときのテスト・コミュ点ゲージのテスト
  // エスケープはいつでもできることのテスト

  describe('質問の個数が足りない場合', () => {
    it('例外になること', () => {
      expect(() => build({selectedEasyQuestions: []})).toThrow();
      expect(() => build({selectedMiddleQuestions: []})).toThrow();
      expect(() => build({selectedHardQuestions: []})).toThrow();
    });
  });
});
